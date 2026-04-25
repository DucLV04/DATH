import React, { useState } from "react";
import { Settings } from "lucide-react";
import { formatTime } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { markAsRead } from "../../../services/notficationService";
function NotificationItemSystem(props) {
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
        style={{ backgroundColor: "rgba(238, 238, 238, 0.5)" }}
      >
        <Settings size={17} color="black" />
      </div>
      <div className="info-notification">
        <span style={{ fontWeight: "500" }}>Thông báo từ hệ thống</span>
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
export default NotificationItemSystem;
