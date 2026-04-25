import React, { useState } from "react";
import { EyeClosed, Lock, Eye, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { resetPassword, requestPasswordReset } from "../../services/authService";

function ForgetPassword() {
  const [param] = useSearchParams();
  const resetToken = param.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState({}); // Stores errors or success messages

  const navigate = useNavigate();

  async function handleSendRequest(e) {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setMessage({ success: "Nếu email tồn tại, link xác nhận đã được gửi!" });
    } catch (err) {
      setMessage({ error: "Có lỗi xảy ra, vui lòng thử lại." });
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    try {
      await resetPassword(resetToken, password);
      navigate("/home", {
        state: {
          show: true,
          message: "Đặt lại mật khẩu thành công!",
          color: "#11224E"
        }
      });
    }
    catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          const listError = err.response.data.errors;
          const msg = {};
          if (listError) {
            listError.forEach((error) => {
              msg[error.param] = error.msg;
            });
          } else {
            msg.password = err.response.data.message;
          }
          setMessage(msg);
        } else {
          setMessage({ password: err.response.data.message });
        }
      }
    }
  }

  const isRequestMode = !resetToken;

  return (
    <div className="container-login">
      <div className="login-form" style={{ height: "400px", width: "420px" }}>
        <div className="header-login">
          <div
            style={{
              display: "flex", width: "60px", height: "60px",
              background: "#ff6a00", borderRadius: "0.8rem",
              justifyContent: "center", alignItems: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: "700", fontSize: "1.4rem" }}>
              M
            </span>
          </div>
          <span style={{ fontSize: "22px", marginTop: "20px" }}>
            {isRequestMode ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
          </span>
          <span style={{ fontSize: "15px", marginTop: "5px", opacity: "0.7", textAlign: "center" }}>
            {isRequestMode ? "Nhập email để nhận link đặt lại mật khẩu" : "Nhập mật khẩu mới của bạn"}
          </span>
        </div>

        <div className="form-login">
          {isRequestMode ? (
            // Request Mode: Enter Email
            <>
              <span style={{ fontWeight: "500", fontSize: "14px" }}>Email Address</span>
              <form className="input-group position-relative">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email của bạn"
                  value={email}
                  style={{ paddingLeft: "2.5rem", borderRadius: "0.5rem", fontSize: "14px" }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="search-icon" />
              </form>
              {message.success && <span style={{ color: "green", fontSize: "13px" }}>{message.success}</span>}
              {message.error && <span style={{ color: "red", fontSize: "13px" }}>{message.error}</span>}
            </>
          ) : (
            // Reset Mode: Enter New Password
            <>
              <span style={{ fontWeight: "500", fontSize: "14px" }}>Mật khẩu mới</span>
              <form className="input-group position-relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  style={{ paddingLeft: "2.5rem", borderRadius: "0.5rem", fontSize: "14px" }}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="search-icon" />
                <div onClick={() => setShow(!show)}>
                  {show ? <Eye className="eye-icon" /> : <EyeClosed className="eye-icon" />}
                </div>
              </form>
              <span style={{ color: "red" }}>{message.password}</span>
            </>
          )}
        </div>

        <div
          className="btn-create"
          style={{ width: "100%", marginTop: "20px" }}
          onClick={isRequestMode ? handleSendRequest : handleResetPassword}
        >
          <span style={{ fontWeight: "500" }}>
            {isRequestMode ? "Gửi yêu cầu" : "Xác nhận"}
          </span>
        </div>

        {isRequestMode && (
          <span
            style={{ alignSelf: "center", paddingTop: "15px", opacity: "0.7", fontSize: "15px", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </span>
        )}

      </div>
    </div>
  );
}

export default ForgetPassword;
