import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../services/authService";

function EmailVerify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Đang xác thực email...");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Link xác thực không hợp lệ.");
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    async function verify() {
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Xác thực thất bại. Link có thể đã hết hạn.");
      }
    }
    verify();
  }, [token]);

  return (
    <div className="container-login">
      <div className="login-form" style={{ height: "350px", width: "420px" }}>
        <div className="header-login">
          <div
            style={{
              display: "flex", width: "60px", height: "60px",
              background: status === "success" ? "#28a745" : (status === "error" ? "#dc3545" : "#ff6a00"),
              borderRadius: "0.8rem",
              justifyContent: "center", alignItems: "center",
              marginBottom: "20px"
            }}
          >
            {status === "success" ? (
              <CheckCircle color="white" size={32} />
            ) : status === "error" ? (
              <XCircle color="white" size={32} />
            ) : (
              <span style={{ color: "white", fontWeight: "700", fontSize: "1.4rem" }}>M</span>
            )}
          </div>

          <span style={{ fontSize: "22px", fontWeight: "600" }}>
            {status === "success" ? "Xác thực thành công" : (status === "error" ? "Xác thực thất bại" : "Đang xử lý")}
          </span>

          <span style={{ fontSize: "15px", marginTop: "10px", opacity: "0.8", textAlign: "center", padding: "0 20px" }}>
            {message}
          </span>
        </div>

        <div
          className="btn-create"
          style={{ width: "100%", marginTop: "30px", background: status === "success" ? "#28a745" : "#ff6a00" }}
          onClick={() => navigate("/login")}
        >
          <span style={{ fontWeight: "500" }}>
            {status === "success" ? "Đăng nhập ngay" : "Quay lại đăng nhập"}
          </span>
        </div>
      </div>
    </div>
  );
}
export default EmailVerify;
