import React from "react";
import { useNavigate } from "react-router-dom";
function ActionOrder(props) {
  const navigate = useNavigate();
  const orderInfo = props.orderInfo;
  const products = orderInfo.products;
  return (
    <div className="d-flex gap-3" style={{ margin: "10px 0px" }}>
      <button
        type="button"
        className="btn btn-outline-secondary btn-custom btn-sm d-none d-md-inline"
        style={{ color: "black" }}
        onClick={props.onOpenDetail}
      >
        Xem chi tiết
      </button>
      {orderInfo.status === "COMPLETED" && products.length > 0 && (
        <button
          type="button"
          className="btn btn-outline-secondary btn-custom btn-sm d-none d-md-inline"
          style={{ color: "black" }}
          onClick={() => {
            navigate("/order", {
              state: {
                listItem: products.map((item) => ({
                  product_id: item.id,
                  quantity: item.quantity,
                  name: item.name,
                  
                  price: item.price_at_purchase.toFixed(2),
                  stock: item.stock || null,
                  status: "active",
                  subtotal: (item.quantity * item.price_at_purchase).toFixed(2),
                })),
              },
            });
          }}
        >
          Mua lại
        </button>
      )}
      {orderInfo.status === "COMPLETED" && products.length > 0 && (
        <button
          type="button"
          className="btn btn-warning btn-custom btn-sm d-none d-md-inline"
          style={{ fontWeight: "500", color: "white" }}
          onClick={props.onOpenDetail}
        >
          Đánh giá đơn hàng
        </button>
      )}
    </div>
  );
}
export default ActionOrder;
