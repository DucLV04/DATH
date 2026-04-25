import React from "react";
import { PackagePlus, Loader, Truck, CheckCircle } from "lucide-react";
function StateItem(props) {
  const state = props.state;
  const current = props.current;
  return (
    <div className="notification-item " style={{ padding: "2px 0px 2px 10px" }}>
      <div
        className="btn-avt"
        style={{
          backgroundColor: current
            ? "rgba(255, 198, 154, 0.2)"
            : "rgba(238, 238, 238, 0.5)",
        }}
      >
        {state === "Đã xác nhận" && (
          <PackagePlus size={20} color={current ? "#ff6600" : "black"} />
        )}
        {state === "Đang chờ xử lí" && (
          <Loader size={20} color={current ? "#ff6600" : "black"} />
        )}
        {state === "Đang vận chuyển" && (
          <Truck size={20} color={current ? "#ff6600" : "black"} />
        )}
        {state === "Hoàn thành" && (
          <CheckCircle size={20} color={current ? "#ff6600" : "black"} />
        )}
      </div>
      <div className="info-notification">
        <span
          style={{ fontWeight: "500", color: current ? "#ff6600" : "black" }}
        >
          {state}
        </span>
        {state === "Đã xác nhận" && (
          <span style={{ opacity: 0.6 }}>Đơn đã được xác nhận</span>
        )}

        {state === "Đang chờ xử lí" && (
          <span style={{ opacity: 0.6 }}>Đơn đang chờ xử lý</span>
        )}

        {state === "Đang vận chuyển" && (
          <span style={{ opacity: 0.6 }}>Đơn đang được vận chuyển</span>
        )}

        {state === "Hoàn thành" && (
          <span style={{ opacity: 0.6 }}>Đơn đã hoàn thành</span>
        )}
      </div>
    </div>
  );
}
export default StateItem;
