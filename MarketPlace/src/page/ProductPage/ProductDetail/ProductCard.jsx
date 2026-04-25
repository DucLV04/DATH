import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hashtag from "../../../component/Hashtag";
import StarRating from "../../../component/StarRating";
import { formatPriceByCode } from "../../../utils/utils";
import { Minus, Plus, ShoppingCart, Truck, Shield, Trash2, Pencil } from "lucide-react";
import { addItemToCart, getCartItems } from "../../../services/cartService";
import { deleteProduct } from "../../../services/productService";

function ProductCard(props) {
  const navigate = useNavigate();
  const product = props.product;
  const id = product.id
  const title = product.name;
  const sold = product.sold;
  const quantity = product.stock;
  const price = product.price;
  const currencyCode = props.currencyCode;
  const [count, setCount] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Check ownership
  const currentUserIdStr = sessionStorage.getItem("userId");
  let currentUserId = null;
  if (currentUserIdStr) {
    try {
      currentUserId = JSON.parse(currentUserIdStr);
    } catch (e) {
      currentUserId = currentUserIdStr;
    }
  }
  // Loose comparison in case one is string one is number
  const isOwner = currentUserId && (currentUserId == product.seller_id);

  function handleCount(action) {
    if (action === "plus") {
      if (count < quantity) {
        setCount(count + 1);
      }
    } else { // action === "minus"
      if (count > 1) {
        setCount(count - 1);
      }
    }
  }

  async function handleCart() {
    if (count > quantity) {
      alert(`Số lượng sản phẩm không đủ. Chỉ còn ${quantity} sản phẩm.`);
      return;
    }
    try {
      const data = await getCartItems();
      if (data.items.length > 0) {
        const items = data.items;
        if (!(items.some(item => item.product_id === id))) await addItemToCart(id, count);
      }
      else {
        await addItemToCart(id, count);
      }

      // Feedback
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);

    }
    catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id);
        alert("Đã xóa sản phẩm thành công!");
        navigate("/home");
      } catch (err) {
        alert("Xóa sản phẩm thất bại.");
        console.error(err);
      }
    }
  }

  return (
    <div className="product-card">
      <h5>{title}</h5>
      <div className="d-flex align-items-center gap-2 mt-2">
        <StarRating rating={product.average_rating || 0} size={18} />
        <span style={{ fontSize: "14px", opacity: 0.6 }}>
          ({product.review_count} đánh giá)
        </span>
      </div>
      <span
        style={{
          fontSize: "2rem",
          color: "#ff6a00",
          fontWeight: "500",
          marginTop: "10px",
        }}
      >
        {formatPriceByCode(price, currencyCode)}
      </span>
      <div className="hashtag-product">
        <Hashtag hashtag={`Còn ${quantity} sản phẩm`} />
      </div>

      {isOwner ? (
        // Owner View: Edit/Delete
        <div className="action-buy mt-4">
          <div className="btn-create"
            style={{ width: "100%", backgroundColor: "#ffc107", color: "black", borderColor: "#ffc107" }}
            onClick={() => {
              navigate("/upload", { state: { product: product, isEdit: true } });
            }}>
            <span style={{ fontWeight: "500" }}>
              <Pencil size={18} style={{ marginRight: "5px", paddingBottom: "2px" }} />
              Chỉnh sửa
            </span>
          </div>
          <div className="btn-add-cart"
            style={{ backgroundColor: "#dc3545", color: "white", borderColor: "#dc3545" }}
            onClick={handleDelete}>
            <span style={{ fontWeight: "500" }}>
              <Trash2 size={18} style={{ marginRight: "5px", paddingBottom: "2px" }} />
              Xóa
            </span>
          </div>
        </div>
      ) : (
        // Visitor View: Count + Buy
        <>
          <div className="product-count">
            <span style={{ fontWeight: "500" }}>Số lượng:</span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-custom btn-sm ms-3 "
              style={{ color: "black" }}
              onClick={() => handleCount("minus")}
              disabled={count <= 1}
            >
              <Minus className="icon-btn-size" />
            </button>
            <div className="number">{count}</div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-custom btn-sm ms-3 "
              style={{ color: "black", marginLeft: "10px" }}
              onClick={() => handleCount("plus")}
              disabled={count >= quantity}
            >
              <Plus className="icon-btn-size" />
            </button>
          </div>
          <div className="action-buy">
            <div className="btn-create" style={{ width: "100%" }} onClick={async () => {
              await handleCart();
              navigate("/cart", {
                state: {
                  idFromProductPage: [id]
                }
              })
            }}>
              <span style={{ fontWeight: "490" }}>Mua ngay</span>
            </div>
            <div className="btn-add-cart"
              style={{ backgroundColor: isAdded ? "#28a745" : "", color: isAdded ? "white" : "", borderColor: isAdded ? "#28a745" : "" }}
              onClick={handleCart}>
              <span style={{ fontWeight: "490" }}>
                {isAdded ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg icon-btn-size" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                    </svg> Đã thêm
                  </>
                ) : (
                  <>
                    <ShoppingCart className="icon-btn-size" /> Thêm vào giỏ hàng
                  </>
                )}
              </span>
            </div>
          </div>
        </>
      )}

      <hr style={{ color: "gray" }}></hr>
      <div className="service-gurantees">
        <span>
          <Truck size={15} style={{ marginRight: "10px" }} color="#ff6a00" />
          Miễn phí giao hàng toàn quốc
        </span>
        <span>
          <Shield size={15} style={{ marginRight: "10px" }} color="#ff6a00" />
          Bảo hành 12 tháng chính hãng
        </span>
        <span style={{ opacity: "0.5" }}>
          Đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất
        </span>
      </div>
    </div>
  );
}
export default ProductCard;
