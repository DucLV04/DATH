import React, { useState } from "react";
import { Settings, User } from "lucide-react";
import { formatTime } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { markAsRead } from "../../../services/notficationService";
function NotificationItemUser(props) {
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
        style={{ backgroundColor: "oklch(0.558 0.288 302.321 / 0.2)" }}
      >
        <User size={17} color="oklch(.558 .288 302.321)" />
      </div>
      <div className="info-notification">
        <span style={{ fontWeight: "500" }}>
          {notification.type === "NEW_PRODUCT_FROM_SELLER" &&
            "Có 1 sản phẩm mới vừa được đăng tải"}
          {notification.type === "NEW_REVIEW" &&
            "Có đánh giá mới về sản phẩm của bạn"}
          {notification.type === "MENTION" &&
            "Phản hồi của bạn đã được trả lời"}
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
export default NotificationItemUser;
