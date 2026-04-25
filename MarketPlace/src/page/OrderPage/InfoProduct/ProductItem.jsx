import React, { use } from "react";
import myPicture from "../../../img/iphone.webp";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../api/axiosClient";
function ProductItem(props) {
  const navigate = useNavigate();
  const nameProduct = props.nameProduct;
  const quantity = props.quantity;
  const price = props.price;
  const img = props.img;
  const idItem = props.idItem || null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0",
        cursor: "pointer",
      }}
    >
      <div
        className="mini-img"
        onClick={() => {
          navigate("/detail", {
            state: {
              id: props.id
            }
          });
        }}
      >
        <img src={`${API_BASE}${img}`} />
      </div>
      <div
        className="d-flex flex-column"
        style={{ fontSize: "13px", fontWeight: "500", width: "70%" }}
      >
        <span>{nameProduct}</span>
        <span style={{ opacity: "0.5", marginBottom: "10px" }}>
          Số lượng: {quantity}
        </span>
        <div className="d-flex justify-content-between">
          <span style={{ color: "#ff6a00" }}>{price}</span>
          {props.showFeedback && <span
            className="btn btn-sm btn-outline-warning"
            style={{
              fontSize: "13px",
              padding: "2px 8px"
            }}
            onClick={(e) => {
              e.stopPropagation();
              props.onClose();
              props.onOpenFeedBack(idItem);
            }}
          >
            Đánh giá
          </span>}
        </div>
      </div>
    </div>
  );
}
export default ProductItem;
