import React from "react";
import StateItem from "./StateItem";
import { getOrderStatus } from "../../../utils/utils";
function StateOrder(props) {
  const status=getOrderStatus(props.status);
  return (
    <div className="d-flex flex-column gap-3" style={{marginBottom:"10px"}}>
      <span style={{ fontWeight: "500", marginBottom:"10px" }}>Trạng thái đơn hàng</span>
      <StateItem state={"Đang chờ xử lí"} current={status==="Đang chờ xử lý"}/>
      <StateItem state={"Đã xác nhận"} current={status==="Đã xác nhận"}/>
      <StateItem state={"Đang vận chuyển"}current={status==="Đang vận chuyển"}/>
      <StateItem state={"Hoàn thành"}current={status==="Hoàn thành"}/>
    </div>
  );
}
export default StateOrder;
