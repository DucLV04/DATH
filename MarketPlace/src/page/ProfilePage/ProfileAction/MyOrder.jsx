import React from "react";
import OrderContainer from "../../HistoryOrderPage/OrderContainer/OrderContainer";
function MyOrder() {
  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <span style={{ fontWeight: "500", fontSize: "17px" }}>
          Đơn hàng của tôi
        </span>
      </div>
      <OrderContainer />
    </div>
  );
}
export default MyOrder;
