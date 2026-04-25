import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../../services/authService";
import EditProfile from "./EditProfile";
function Setting(props) {
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  }
  return (
    <div className="d-flex flex-column gap-3">
      
      <EditProfile user={props.user} />
      <div className="about-me">
        <span style={{ fontWeight: "500" }}>Tài khoản</span>
        <div
          data-bs-toggle="modal"
          data-bs-target="#myModal"
          className="btn-add-cart"
          onClick={() => {}}
        >
          <span style={{ fontWeight: "490" }}>Chỉnh sửa thông tin cá nhân</span>
        </div>
        <div
          className="btn-add-cart"
          onClick={() => {
            navigate("/verify-email");
          }}
        >
          <span style={{ fontWeight: "490" }}>Đổi mật khẩu</span>
        </div>
        <div
          className="btn-create"
          style={{ width: "100%" }}
          onClick={() => {
            handleLogout();
            navigate("/");
          }}
        >
          <span style={{ fontWeight: "490" }}>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
}
export default Setting;
