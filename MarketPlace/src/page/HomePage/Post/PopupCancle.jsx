import React,{useState} from "react";
import { X } from "lucide-react";
function PopupCancle(props) {
  if (!props.isOpen) return null;
  return (
    <div className="popup-overlay " onClick={props.onClose}>
      <div
        className="popup-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="popup-header">
          <div className="d-flex flex-column">
            <span
              style={{ fontWeight: "500", color: "#ff6600", fontSize: "20px" }}
            >
             Bạn có chắc muốn hủy bán sản phẩm này?
            </span>
            <span style={{ opacity: "0.5" }}>
              Sản phẩm sẽ bị xóa khỏi danh sách của bạn và không thể khôi phục lại.
            </span>
          </div>
          <button className="close-button" onClick={props.onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="popup-body">
          <div className="d-flex flex-row-reverse">
            <div
              className="btn-create"
              style={{ marginLeft: "15px", backgroundColor: "red" }}
              onClick={()=>{
                props.onDelete();
                props.onClose();
                props.onShowNotifi && props.onShowNotifi();
              }}
            >
              <span style={{ fontWeight: "500" }}>Xác nhận</span>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-custom btn-sm"
              style={{
                color: "black",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                display: "flex",
                padding: "5px 15px",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
              }}
              onClick={props.onClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PopupCancle;
