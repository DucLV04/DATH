import React from "react";
function PaymentMethod(props) {
  const selected = props.selected===props.id;
  const title=props.title;
  const description=props.description;
  return (
    <div className={`payment-item ${selected && 'select-payment'}`} onClick={()=>{
        props.onSelect(props.id);
    }}>
      <div className="circle-wrapper">
        <div
          className="circle-dot"
          style={{ display: selected ? "" : "none" }}
        ></div>
      </div>
      <div>
        <span style={{ fontWeight: "500" }}>
         {title}
        </span>
        <span style={{ opacity: "0.5", marginLeft: "5px" }}>
         {description}
        </span>
      </div>
    </div>
  );
}
export default PaymentMethod;
