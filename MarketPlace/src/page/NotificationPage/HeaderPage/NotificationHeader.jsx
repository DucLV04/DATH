import React from "react";
function NotificationHeader(props){
    return <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span style={{ fontSize: "25px", fontWeight: "500" }}>
        Thông báo
      </span>
      <span style={{ opacity: "0.5" }}>
        {props.numberNoti>0? `Bạn có ${props.numberNoti} thông báo mới` : "Bạn không có thông báo mới"}
      </span>
    </div>
}
export default NotificationHeader;