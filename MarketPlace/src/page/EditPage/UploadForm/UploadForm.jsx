import React from "react";
import { Package, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectBox from "../../HomePage/FilterSection/SelectBox";
import OptionList from "../../HomePage/FilterSection/OptionList";
import ImageForm from "./ImageForm";
import {
  updateProduct,
  deleteProductImage,
  getCategories,
} from "../../../services/productService";

function UploadForm(props) {
  const id = props.id;
  const product = props.product;
  const navigate = useNavigate();
  const [listOption, setListOption] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesMap = await getCategories();
        // Sort category names based on their index from the map
        const sortedCategoryNames = Object.keys(categoriesMap).sort(
          (a, b) => categoriesMap[a] - categoriesMap[b]
        );
        setListOption(sortedCategoryNames);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const [message, setMessage] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    image: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState(product.category || "Danh mục");
  const [nameProduct, setName] = useState(product.name);
  const [description, setDesc] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [category, setCategory] = useState(product.category);
  const [files, setFiles] = useState([]);
  const [removeImgList, setList] = useState([]);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function handleOptionSelect(option) {
    setOption(option);
    if (option !== "Danh mục") setCategory(option);
    setIsOpen(!isOpen);
  }
  async function handleUpdate(e) {
    e.preventDefault();
    const msg = {};
    if (
      category === "" ||
      nameProduct === "" ||
      price === "" ||
      stock === "" ||
      (files.length === 0 && removeImgList.length === product.images.length)
    ) {
      msg["image"] = "Vui lòng nhập đầy đủ các thông tin yêu cầu!";
    } else {
      try {
        const formData = new FormData();
        formData.append("name", nameProduct);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("category", category);
        files.forEach((file) => {
          formData.append("images", file);
        });
        for (const img of removeImgList) {
          await deleteProductImage(id, img);
        }
        await updateProduct(formData, id);
        navigate("/home", {
          state: {
            show: true,
            message: "Sản phẩm của bạn đã được cập nhật thành công!",
            color: "#3F7D58",
          },
        });
      } catch (err) {
        if (err.response && err.response.status === 400) {
          const listError = err.response.data.errors;
          listError.forEach((error) => {
            msg[error.path] = error.msg;
          });
        }
      }
    }
    setMessage(msg);
  }
  return (
    <div className="order-info">
      <span style={{ fontWeight: "500" }}>
        <Package color="#ff6a00" style={{ marginRight: "5px" }} />
        Thông tin sản phẩm
      </span>
      <span style={{ opacity: "0.5", marginLeft: "5px" }}>
        Nhập thông tin sản phẩm của bạn
      </span>
      <form>
        <div className="row mt-3">
          <div className="col-12">
            <label htmlFor="InputNameProduct" className="form-label">
              Tên sản phẩm*
            </label>
            <input
              type="text"
              id="InputNameProduct"
              className="form-control"
              placeholder="Ví dụ: Iphone 15 Pro Max 256GB"
              style={{ borderRadius: "0.5rem" }}
              value={nameProduct}
              onChange={(e) => setName(e.target.value)}
            />
            <span style={{ color: "red" }}>{message.name}</span>
          </div>

          <div className="col-6 mt-3">
            <label htmlFor="InputPrice" className="form-label">
              Giá sản phẩm*
            </label>
            <input
              type="text"
              id="InputPrice"
              className="form-control"
              placeholder="Nhập giá sản phẩm"
              style={{ borderRadius: "0.5rem" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <span style={{ color: "red" }}>{message.price}</span>
          </div>
          <div className="col-6 mt-3">
            <label htmlFor="InputQuantity" className="form-label">
              Số lượng*
            </label>
            <input
              type="text"
              id="InputQuantity"
              className="form-control"
              placeholder="Nhập số lượng"
              style={{ borderRadius: "0.5rem" }}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <span style={{ color: "red" }}>{message.stock}</span>
          </div>
          <div className="col-12 mt-3">
            <label htmlFor="InputDescription" className="form-label">
              Mô tả*
            </label>
            <textarea
              type="text"
              id="InputDescription"
              className="form-control"
              placeholder="Mô tả chi tiết về sản phẩm tình trạng, đặc điểm,...."
              style={{ borderRadius: "0.5rem" }}
              rows="5"
              value={description}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
            <span style={{ color: "red" }}>{message.description}</span>
          </div>
          <div className="col-12">
            <div className="selector-container">
              <label
                style={{
                  fontWeight: "500",
                  marginLeft: "5px",
                  marginBottom: "8px",
                }}
              >
                Danh mục*
              </label>
              <SelectBox
                onToggle={toggleDropdown}
                isOpen={isOpen}
                option={option}
              />
              {isOpen && (
                <OptionList
                  option={option}
                  onSelect={handleOptionSelect}
                  listOption={listOption}
                />
              )}
              <span style={{ color: "red" }}>{message.category}</span>
            </div>
          </div>
          <div className="col-12">
            <label
              style={{
                fontWeight: "500",
                marginLeft: "5px",
                marginBottom: "8px",
              }}
            >
              Hình ảnh sản phẩm*
            </label>
            <ImageForm
              onUpload={setFiles}
              onRemove={setList}
              oldImages={product.images}
              setMessage={setMessage}
            />
            <span style={{ color: "red" }}>{message.image}</span>
          </div>
          <div className="col-12  mt-3 d-flex flex-row-reverse">
            <div
              className="btn-create"
              style={{ marginLeft: "15px" }}
              onClick={handleUpdate}
            >
              <span style={{ fontWeight: "500" }}>
                <Upload
                  color="white"
                  size={20}
                  style={{ marginRight: "5px", paddingBottom: "3px" }}
                />
                Đăng sản phẩm
              </span>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-custom btn-sm"
              style={{
                color: "black",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                display: "flex",
                padding: "5px 15px",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
              }}
              onClick={() => {
                navigate("/home");
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default UploadForm;
