import React, { useState } from "react";
import Payment from "./Payment";
import OrderInfo from "./OrderInfo";
import InfoProduct from "../InfoProduct/InfoProducts";
function OrderForm(props) {
  const products = props.products;
  const [message, setMessage] = useState({
   phone:"",
   address:"",
   note:""
  });
  const [infoOrder, setInfo] = useState({
    phone: "",
    address: "",
    paymentMethod: "COD",
    note: "",
  });
  function handleInfo(info = {}) {
    setInfo((prev) => ({ ...prev, ...info }));
  }
  return (
    <div className="row">
      <div className="col-8 d-flex flex-column gap-4">
        <OrderInfo message={message} onEnter={handleInfo} />
        <Payment onSelect={handleInfo} />
      </div>
      <div className="col-4">
        <InfoProduct onError={setMessage} infoOrder={infoOrder} products={products} />
      </div>
    </div>
  );
}
export default OrderForm;
