import React from "react";
function CartHeader(){
    return <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span style={{ fontSize: "25px", fontWeight: "500" }}>
        Giỏ hàng của bạn
      </span>
      <span style={{ opacity: "0.5" }}>
      Danh sách những sản phẩm bạn đã thêm vào để xem lại sau
      </span>
    </div>
}
export default CartHeader;