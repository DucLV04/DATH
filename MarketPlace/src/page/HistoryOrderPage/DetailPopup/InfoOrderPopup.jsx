import React from "react";
import { formatTime } from "../../../utils/utils";
function InfoOrderPopup(props) {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex gap-2">
        <span style={{ fontWeight: "500" }}>{`#ORD${props.id}`}</span>
      </div>
      <span style={{opacity:"0.5",fontSize:"14px"}}>
       {`Đặt vào ${formatTime(props.createdAt)}`}
      </span>
    </div>
  );
}
export default InfoOrderPopup;
