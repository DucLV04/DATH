import React from "react";
import { User, Lock, Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkValidAccount } from "../../utils/utils";
import { login, resendVerificationEmail } from "../../services/authService";
function FormLogin() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [message, setMessage] = useState({
    email: "",
    password: "",
    error: "",
  });
  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      const userInfo = {
        id: data.id,
        username: data.username,
        email: data.email,
        createdAt: data.created_at,
        avatar: data.avatar_url || "",
      };
      setUser(userInfo);
      sessionStorage.setItem("userId", JSON.stringify(userInfo.id));
      localStorage.setItem("token", data.accessToken);
      navigate("/home");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          const listError = err.response.data.errors;
          console.log(listError);
          const msg = {};
          listError.forEach((error) => {
            msg[error.path] = error.msg;
          });
          setMessage(msg);
        } else if (err.response.status === 401) {
          const msg = {
            email: "",
            password: "",
            error: err.response.data.message,
          };
          setMessage(msg);
        }
      }
    }
  }

  return (
    <div className="form-login">
      <span style={{ fontWeight: "500", fontSize: "14px" }}>Email Address</span>
      <form className="input-group position-relative">
        <input
          type="email"
          className="form-control"
          placeholder="Nhập email"
          value={email}
          style={{
            paddingLeft: "2.5rem",
            borderRadius: "0.5rem",
            fontSize: "14px",
          }}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin(e);
          }}
        />
        <User className="search-icon" />
      </form>
      <span style={{ color: "red" }}>{message.email}</span>
      <span style={{ fontWeight: "500", fontSize: "14px" }}>Mật khẩu</span>
      <form className="input-group position-relative">
        <input
          type={show ? "text" : "password"}
          className="form-control"
          value={password}
          placeholder="Nhập mật khẩu"
          style={{
            paddingLeft: "2.5rem",
            borderRadius: "0.5rem",
            fontSize: "14px",
          }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin(e);
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
      <span style={{ color: "red" }}>
        {message.password === "" ? message.error : message.password}
      </span>
      <span
        className="underline-text"
        onClick={() => {
          navigate("/reset-password");
        }}
      >
        Quên mật khẩu?
      </span>
      <div
        className="btn-create"
        style={{ width: "100%" }}
        onClick={handleLogin}
      >
        <span style={{ fontWeight: "500" }}>Đăng nhập</span>
      </div>
      <span
        style={{
          alignSelf: "center",
          paddingTop: "15px",
          opacity: "0.7",
          fontSize: "15px",
        }}
      >
        Chưa có tài khoản?
        <span
          className="underline-text"
          onClick={() => {
            navigate("/register");
          }}
        >
        </span>
      </span>
      <span
        style={{
          alignSelf: "center",
          paddingTop: "10px",
          opacity: "0.7",
          fontSize: "14px",
          cursor: "pointer",
          color: "#ff6a00"
        }}
        onClick={async () => {
          if (!email) {
            setMessage({ ...message, error: "Vui lòng nhập email để gửi lại xác thực." });
            return;
          }
          try {
            const res = await resendVerificationEmail(email);
            setMessage({ ...message, error: "", email: "", password: "", success: res.message });
            alert(res.message);
          } catch (err) {
            setMessage({ ...message, error: "Có lỗi xảy ra." });
          }
        }}
      >
        Chưa nhận được email xác thực? Gửi lại
      </span>
    </div >
  );
}
export default FormLogin;
