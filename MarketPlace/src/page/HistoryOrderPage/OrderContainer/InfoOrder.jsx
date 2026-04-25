import React from "react";
import { formatTime, getOrderStatus,formatPriceByCode,getStatusColor } from "../../../utils/utils";
function InfoOrder(props) {

  return (
    <div className="d-flex flex-column">
      <div className="d-flex gap-2">
        <span style={{ fontWeight: "500" }}>{`#ORD${props.id}`}</span>
        <span className="hashtag" style={{backgroundColor:getStatusColor(props.status),color:"white", fontSize:"12px"}}>
            {getOrderStatus(props.status)}
        </span>
        <span style={{marginLeft:"auto", fontWeight:"500",color:"#ff6600",fontSize:"17px"}}>
          {formatPriceByCode(props.totalAmount,"VND")}
        </span>
      </div>
      <span style={{opacity:"0.5",fontSize:"14px"}}>
        {`Đặt vào ${formatTime(props.created_at)}`}
      </span>
    </div>
  );
}
export default InfoOrder;
