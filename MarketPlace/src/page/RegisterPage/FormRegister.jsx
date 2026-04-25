import React from "react";
import { User, Lock, Eye, Mail, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { checkValidAccount } from "../../utils/utils";
import { register } from "../../services/authService";
function FormRegister() {
  const [message, setMessage] = useState({
    username: "",
    password: "",
    email: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  async function hanldeRegister(e) {
    e.preventDefault();
    try {
      if (confirm !== password) {
        const msg = {
          username: "",
          password: "",
          email: "",
          confirm: "Confirm password must match password",
        };
        setMessage(msg);
      } else {
        const data = await register(username, email, password);
        navigate("/login");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400 && err.response.data.errors) {
          const listError = err.response.data.errors;
          const msg = {};
          listError.forEach((error) => {
            msg[error.path] = error.msg;
          });
          setMessage(msg);
        } else {
          // Handle 500 or other errors (like duplicate email)
          setMessage({
            ...message,
            email: err.response.data.message || "Đăng ký thất bại."
          });
        }
      }
    }
  }
  return (
    <div className="form-login">
      <span style={{ fontWeight: "500", fontSize: "14px" }}>Họ và tên</span>
      <form className="input-group position-relative">
        <input
          type="text"
          className="form-control"
          value={username}
          placeholder="Nhập họ và tên"
          style={{
            paddingLeft: "2.5rem",
            borderRadius: "0.5rem",
            fontSize: "14px",
          }}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <User className="search-icon" />
      </form>
      <span style={{ color: "red" }}>{message.username}</span>
      <span style={{ fontWeight: "500", fontSize: "14px" }}>Email Address</span>
      <form className="input-group position-relative">
        <input
          type="text"
          className="form-control"
          value={email}
          placeholder="Nhập email"
          style={{
            paddingLeft: "2.5rem",
            borderRadius: "0.5rem",
            fontSize: "14px",
          }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Mail className="search-icon" />
      </form>
      <span style={{ color: "red" }}>{message.email}</span>
      <span style={{ fontWeight: "500", fontSize: "14px" }}>Mật khẩu</span>
      <form className="input-group position-relative">
        <input
          type={show ? "text" : "password"}
          value={password}
          className="form-control"
          placeholder="Nhập mật khẩu"
          style={{
            paddingLeft: "2.5rem",
            borderRadius: "0.5rem",
            fontSize: "14px",
          }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Lock className="search-icon" />
        <div
          onClick={() => {
            setShow(!show);
          }}
        >
          {show ? (
            <Eye className="eye-icon" />
          ) : (
            <EyeClosed className="eye-icon" />
          )}
        </div>
      </form>
      <span style={{ color: "red" }}>{message.password}</span>
      <span style={{ fontWeight: "500", fontSize: "14px" }}>
        Nhập lại mật khẩu
      </span>
      <form className="input-group position-relative">
        <input
          type={showConfirm ? "text" : "password"}
          value={confirm}
          className="form-control"
          placeholder="Nhập lại mật khẩu"
          style={{
            paddingLeft: "2.5rem",
            borderRadius: "0.5rem",
            fontSize: "14px",
          }}
          onChange={(e) => {
            setConfirm(e.target.value);
          }}
        />
        <Lock className="search-icon" />
        <div
          onClick={() => {
            setShowConfirm(!showConfirm);
          }}
        >
          {showConfirm ? (
            <Eye className="eye-icon" />
          ) : (
            <EyeClosed className="eye-icon" />
          )}
        </div>
      </form>
      <span style={{ color: "red" }}>{message.confirm}</span>
      <div
        className="btn-create"
        style={{ width: "100%", marginTop: "10px" }}
        onClick={hanldeRegister}
      >
        <span style={{ fontWeight: "500" }}>Tạo tài khoản</span>
      </div>
      <span
        style={{
          alignSelf: "center",
          paddingTop: "15px",
          opacity: "0.7",
          fontSize: "15px",
        }}
      >
        Đã có tài khoản?
        <span
          className="underline-text"
          onClick={() => {
            navigate("/login");
          }}
        >
          Đăng nhập ngay
        </span>
      </span>
    </div>
  );
}
export default FormRegister;
