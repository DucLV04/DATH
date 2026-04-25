import React, { useState, useEffect } from "react";
import ProductItem from "./ProductItem";
import { ShoppingCart, Package } from "lucide-react";
import { formatPriceByCode, calculateTotal } from "../../../utils/utils";
import { getProductImageById, getProductById } from "../../../services/productService";
import { placeOrder } from "../../../services/orderService";
import { useNavigate } from "react-router-dom";
function InfoProduct(props) {
  const navigate = useNavigate();
  const products = props.products;
  const infoOrder = props.infoOrder;
  const [listImg, setListImg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listProductId, setList] = useState(
    products.map((product) => product.product_id)
  );
  async function getImgProduct(id) {
    try {
      const data = await getProductImageById(id);
      if (data.length > 0) {
        setListImg(prev => [...prev, {
          id: id,
          img_url: data[0].image_url
        }])
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  }
  async function checkStock(products) {
    for (const product of products) {
      try {
        const productDetail = await getProductById(product.product_id);
        if (product.quantity > productDetail.stock) {
          props.onError({
            order: `Sản phẩm ${product.name} không đủ số lượng. Hiện tại chỉ còn ${productDetail.stock} sản phẩm.`
          });
          return false;
        }
      } catch (error) {
        console.error("Lỗi kiểm tra số lượng:", error);
        props.onError({
          order: "Lỗi khi kiểm tra số lượng sản phẩm."
        });
        return false;
      }
    }
    return true;
  }
  async function handleOrder(infoOrder, products) {
    const msg = {};
    const stockAvailable = await checkStock(products);
    if (!stockAvailable) {
      return;
    }
    try {
      const listProductId = products.map((product) => product.product_id);
      await placeOrder(infoOrder, listProductId);
      navigate("/home", {
        state: {
          show: true,
          message: "Đơn hàng của bạn đã được tạo thành công!",
          color: "#001F3D",
        },
      });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const listError = err.response.data.errors;
        if (listError) {
          listError.forEach((error) => {
            msg[error.path] = error.msg;
          });
        }
      }
      else {
        msg.order = "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
      }
    }
    props.onError(msg);
  }
  useEffect(() => {
    listProductId.forEach((id) => {
      getImgProduct(id);
    })
  }, [listProductId])
  if (loading) return <div>Loading...</div>
  return (
    <div className="order-info">
      <span style={{ fontWeight: "500", marginBottom: "20px" }}>
        <ShoppingCart
          color="#ff6a00"
          style={{ marginRight: "10px" }}
          size={22}
        />
        Đơn hàng của bạn
      </span>
      {products.map((product, index) => {
        return (
          <ProductItem
            id={product.product_id}
            key={index}
            nameProduct={product.name}
            quantity={product.quantity}
            onOpenFeedBack={props.onOpenFeedBack}
            onClose={props.onClose}
            price={formatPriceByCode(product.price, "VND")}
            img={listImg.find(obj => obj.id === product.product_id)?.img_url || ""}
            showFeedback={false}
          />
        );
      })}
      <hr style={{ color: "gray", marginBottom: "5px" }}></hr>
      <div
        className="d-flex justify-content-between"
        style={{ fontSize: "15px", fontWeight: "500", opacity: "0.5" }}
      >
        <span>Tạm tính</span>
        <span>{formatPriceByCode(calculateTotal(products), "VND")}</span>
      </div>
      <hr style={{ color: "gray", marginTop: "5px" }}></hr>
      <div
        className="d-flex justify-content-between"
        style={{ fontSize: "18px", fontWeight: "500" }}
      >
        <span>Tổng cộng</span>
        <span style={{ color: "#ff6a00" }}>
          {formatPriceByCode(calculateTotal(products), "VND")}
        </span>
      </div>
      <div
        className="btn-create"
        style={{ width: "100%", marginTop: "7px" }}
        onClick={() => {
          handleOrder(infoOrder, products);
        }}
      >
        <span style={{ fontWeight: "500" }}>
          <Package color="white" style={{ marginRight: "10px" }} />
          Đặt hàng
        </span>
      </div>
    </div>
  );
}
export default InfoProduct;
