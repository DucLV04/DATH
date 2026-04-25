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
        Đăng sản phẩm mới
      </span>
      <span style={{ opacity: "0.5" }}>
       Vui lòng nhập thông tin về sản phẩm của bạn
      </span>
    </div>
  );
}
export default HeaderUpload;