import React from "react";
function CartBar() {
  return (
    <div className="cart-bar">
      <span style={{width:"50%", paddingLeft:"30px"}}>Sản phẩm</span>
      <div
        className="d-flex "
        style={{ marginLeft: "auto", gap: "60px",width:"50%" }}
      >
        <span>Đơn giá</span>
        <span>Số lượng</span>
        <span>Số tiền</span>
        <span>Thao tác</span>
      </div>
    </div>
  );
}
export default CartBar;
