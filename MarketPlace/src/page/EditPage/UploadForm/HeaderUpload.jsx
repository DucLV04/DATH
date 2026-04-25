import React from "react";
function HeaderUpload() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span style={{ fontSize: "25px", fontWeight: "500" }}>
        Chỉnh sửa thông tin sản phẩm
      </span>
      <span style={{ opacity: "0.5" }}>
       Vui lòng nhập thông tin về sản phẩm của bạn
      </span>
    </div>
  );
}
export default HeaderUpload;