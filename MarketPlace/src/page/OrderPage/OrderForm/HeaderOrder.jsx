import React from "react";
function HeaderOrder() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span style={{ fontSize: "25px", fontWeight: "500" }}>
        Thông tin đơn hàng
      </span>
      <span style={{ opacity: "0.5" }}>
        Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng
      </span>
    </div>
  );
}

export default HeaderOrder;
