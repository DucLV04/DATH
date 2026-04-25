import React from "react";
import PaymentMethod from "./PaymentMethod";
import { useState } from "react";
import { CreditCard } from "lucide-react";
function Payment(props) {
  const [selected, setSelect] = useState(1);
  function hanldeSelect(id){
    if (id===1) props.onSelect({paymentMethod:"COD"});
    else props.onSelect({paymentMethod:"ONLINE"});
    setSelect(id);
  }
  return (
    <div className="order-info">
      <span style={{ fontWeight: "500" }}>
        <CreditCard
          color="#ff6a00"
          style={{ marginRight: "5px", marginBottom: "5px" }}
        />
        Phương thức thanh toán
      </span>
      <span style={{ opacity: "0.5", marginLeft: "5px", marginBottom:"10px" }}>
        Chọn phương thức thanh toán phù hợp
      </span>
      <PaymentMethod
        id={1}
        selected={selected}
        title="Thanh toán khi nhận hàng (COD)"
        description="Thanh toán bằng tiền mặt khi nhận hàng"
        onSelect={hanldeSelect}
      />
      <PaymentMethod
        id={2}
        selected={selected}
        title="Chuyển khoảng ngân hàng"
        description="Chuyển khoảng qua tài khoản ngân hàng"
        onSelect={hanldeSelect}
      />
      <PaymentMethod
        id={3}
        selected={selected}
        title="Ví MoMo"
        description="Thanh toán qua ví MoMo"
        onSelect={hanldeSelect}
      />
      <PaymentMethod
        id={4}
        selected={selected}
        title="Thẻ tín dụng/ Ghi nợ"
        description="Visa, Mastercard, JCB"
        onSelect={hanldeSelect}
      />
    </div>
  );
}
export default Payment;
