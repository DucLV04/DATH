import React from "react";
import { Package, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectBox from "../../HomePage/FilterSection/SelectBox";
import OptionList from "../../HomePage/FilterSection/OptionList";
import ImageForm from "./ImageForm";
import { createProduct, getCategories, updateProduct } from "../../../services/productService";
import { makeHashtag } from "../../../utils/utils";
import { useLocation } from "react-router-dom";

function UploadForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listOption, setListOption] = useState([]);

  // Check for edit mode
  const { isEdit, product } = location.state || {};

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesMap = await getCategories();
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

  // Pre-fill if editing
  useEffect(() => {
    if (isEdit && product) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setDesc(product.description);
      setCategory(product.category_name || "Danh mục"); // Assuming category_name is available or mapped
      setOption(product.category_name || "Danh mục");
      // Images handling is complex, for now we skip pre-filling files as they are File objects.
      // User must upload new images to replace (or we handle separately).
    }
  }, [isEdit, product]);

  const [message, setMessage] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    image: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState("Danh mục");
  const [nameProduct, setName] = useState("");
  const [description, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function handleOptionSelect(option) {
    setOption(option);
    if (option !== "Danh mục") setCategory(option);
    setIsOpen(!isOpen);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const msg = {};
    if (
      category === "" ||
      nameProduct === "" ||
      price === "" ||
      stock === ""
      // || files.length === 0 // Allow empty files for update if generic behavior (but here created requires it)
      // For simplicity, require files for now or assume update replaces it.
      // If edit, maybe allow empty files?
    ) {
      if (!isEdit && files.length === 0) {
        msg["image"] = "Vui lòng chọn hình ảnh!";
      }
      if (category === "") msg["category"] = "Vui lòng chọn danh mục!";
      if (nameProduct === "") msg["name"] = "Vui lòng nhập tên sản phẩm!";
      // etc.
      // Reuse existing validation logic but adapted
    }

    // Simple validation copy from original but adapted
    if (
      category === "" ||
      nameProduct === "" ||
      price === "" ||
      stock === "" ||
      (!isEdit && files.length === 0)
    ) {
      msg["image"] = "Vui lòng nhập đầy đủ các thông tin yêu cầu!";
      if (files.length === 0 && !isEdit) msg["image"] = "Vui lòng chọn ảnh.";
      setMessage(msg);
      return;
    }


    try {
      const formData = new FormData();
      formData.append("name", nameProduct);
      formData.append("stock", stock);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("hashtags", [category, makeHashtag(nameProduct)]); // Simplified array to string usually handled by backend? Backend expects array usually.
      // But original code passed array.

      files.forEach((file) => {
        formData.append("images", file);
      });

      if (isEdit) {
        await updateProduct(formData, product.id);
        navigate("/home", {
          state: {
            show: true,
            message: "Cập nhật sản phẩm thành công!",
            color: "#28a745",
          },
        });
      } else {
        await createProduct(formData);
        navigate("/home", {
          state: {
            show: true,
            message: "Sản phẩm của bạn đã được đăng bán thành công!",
            color: "#ff9013",
          },
        });
      }

    } catch (err) {
      if (err.response && err.response.status === 400) {
        const listError = err.response.data.errors;
        if (listError) {
          listError.forEach((error) => {
            msg[error.path] = error.msg;
          });
        } else {
          // Genric
          console.error(err);
        }
      }
      setMessage(msg);
    }
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
              name="nameProduct"
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
              type="number"
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
              type="number"
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
            <ImageForm onUpload={setFiles} setMessage={setMessage} />
            <span style={{ color: "red" }}>{message.image}</span>
          </div>
          <div className="col-12  mt-3 d-flex flex-row-reverse">
            <div
              className="btn-create"
              style={{ marginLeft: "15px" }}
              onClick={handleSubmit}
            >
              <span style={{ fontWeight: "500" }}>
                <Upload
                  color="white"
                  size={20}
                  style={{ marginRight: "5px", paddingBottom: "3px" }}
                />
                {isEdit ? "Cập nhật sản phẩm" : "Đăng sản phẩm"}
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
