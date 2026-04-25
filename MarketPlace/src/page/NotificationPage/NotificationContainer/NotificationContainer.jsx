import React from "react";
import NotificationItemUser from "./NotificationItemUser";
import NotificationItemProduct from "./NotificationItemProduct";
import NotificationItemSystem from "./NotificationItemSystem";
import { groupNotifications } from "../../../utils/utils";
function NotificationContainer(props) {
  const notifications = props.notifications;
  const typeNotification = props.typeNotification;
  const groupedNotification = groupNotifications(notifications);
  return (
    <div className="d-flex flex-column gap-2" style={{ textAlign: "left" }}>
      {Object.keys(groupedNotification).map((date, index) => {
        if (groupedNotification[date].length > 0) {
          return (  
            <div key={index} className="d-flex flex-column gap-2">
              <span
                style={{ fontSize: "15px", fontWeight: "500", opacity: "0.5" }}
              >
                {date}
              </span>
              <div className="notification-container">
                {groupedNotification[date].map((notification, index) => {
                  if (
                    (notification.type === "NEW_ORDER" ||
                      notification.type === "ORDER_STATUS_UPDATE") &&
                    (typeNotification === "Đơn hàng của tôi" ||
                      typeNotification === "Tất cả")
                  ) {
                    return (
                      <NotificationItemProduct
                        notification={notification}
                        key={index}
                      />
                    );
                  } else if (
                    (notification.type === "NEW_REVIEW" ||
                      notification.type === "NEW_PRODUCT_FROM_SELLER" ||
                      notification.type === "MENTION") &&
                    (typeNotification === "Người dùng" ||
                      typeNotification === "Tất cả")
                  ) {
                    return (
                      <NotificationItemUser
                        notification={notification}
                        key={index}
                      />
                    );
                  } else if (
                    typeNotification === "Hệ thống" ||
                    typeNotification === "Tất cả"
                  ) {
                    return (
                      <NotificationItemSystem
                        notification={notification}
                        key={index}
                      />
                    );
                  }
                })}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
export default NotificationContainer;
