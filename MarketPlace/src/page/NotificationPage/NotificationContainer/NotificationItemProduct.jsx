import React, { useState } from "react";
import { Settings, Package } from "lucide-react";
import { formatTime } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { markAsRead } from "../../../services/notficationService";
function NotificationItemProduct(props) {
  const navigate = useNavigate();
  const notification = props.notification;
  const [isRead, setIsRead] = useState(notification.is_read);
  async function handleMarkAsRead() {
    try {
      await markAsRead(notification.id);
      setIsRead(true);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div
      className={
        isRead
          ? "notification-item"
          : " notification-item notification-item-new"
      }
      onClick={handleMarkAsRead}
    >
      <div
        className="btn-avt"
        style={{ backgroundColor: "rgba(255, 198, 154, 0.5)" }}
      >
        <Package size={17} color="#ff6600" />
      </div>
      <div className="info-notification">
        <span style={{ fontWeight: "500" }}>
          {notification.type === "NEW_ORDER"
            ? "Bạn có đơn hàng mới"
            : "Cập nhật trạng thái đơn hàng"}
        </span>
        <span style={{ opacity: "0.5" }}>{notification.message}</span>
        <span style={{ opacity: "0.5" }}>
          {formatTime(notification.created_at)}
        </span>
      </div>
      <div style={{ marginLeft: "auto", marginRight: "5px" }}>
        <button
          type="button"
          className="btn btn-outline-secondary btn-custom btn-sm ms-3 "
          style={{
            color: "black",
          }}
          onClick={() => {
            navigate("/profile");
          }}
        >
          <Settings className="icon-btn-size" />
        </button>
      </div>
    </div>
  );
}
export default NotificationItemProduct;
