import React from "react";
import { CreditCard } from "lucide-react";
import { formatPriceByCode } from "../../../utils/utils";
function InfoPayment(props) {
  return (
    <div className="d-flex flex-column gap-2">
      <span style={{ fontWeight: "500" }}>
        <CreditCard style={{ marginRight: "10px" }} />
        Chí phí đơn hàng
      </span>
      <div
        className="d-flex justify-content-between"
        style={{ fontSize: "15px", fontWeight: "500", opacity: "0.5" }}
      >
        <span>Tạm tính</span>
        <span>{formatPriceByCode(props.total,"VND")}</span>
      </div>
      <hr style={{ color: "gray", marginTop: "5px" }}></hr>
      <div
        className="d-flex justify-content-between"
        style={{ fontSize: "18px", fontWeight: "500" }}
      >
        <span>Tổng cộng</span>
        <span style={{ color: "#ff6a00" }}>{formatPriceByCode(props.total,"VND")}</span>
      </div>
      <div
        className="d-flex justify-content-between"
        style={{ fontSize: "15px", fontWeight: "500", opacity: "0.5" }}
      >
        <span>Phương thức thanh toán</span>
        <span>{props.payment}</span>
      </div>
      <hr style={{ margin: "0" }} />
    </div>
  );
}
export default InfoPayment;
