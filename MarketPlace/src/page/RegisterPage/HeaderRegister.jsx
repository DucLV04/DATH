import React from "react";
function HeaderRegister() {
  return (
    <div className="header-login">
      <div
        style={{
          display: "flex",
          width: "60px",
          height: "60px",
          background: "#ff6a00",
          borderRadius: "0.8rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ color: "white", fontWeight: "700", fontSize: "1.4rem" }}>
          M
        </span>
      </div>
      <span style={{fontSize:"22px",marginTop:"20px"}}>Đăng ký</span>
       <span style={{fontSize:"15px",marginTop:"5px", opacity:"0.7"}}>Tạo tài khoản mới để bắt đầu</span>
    </div>
  );
}
export default HeaderRegister;
