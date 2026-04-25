import React, { useState } from "react";
import { X } from "lucide-react";
import RatingForm from "./RatingForm";
import FeedBackForm from "./FeedBackForm";
import { submitReview } from "../../../services/reviewService";
function FeedBackPopup(props) {
  const item = props.item || null;
  const orderInfo = props.orderInfo;
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const [message,setMessage]=useState({
    rating:"",
    other:""
  })
  async function handleSubmit() {
    const msg={};
    try {
      await submitReview(item.id, item.order_item_id, comment, rate);
      props.onClose();
    } catch (err) {
       if (err.response && err.response.status === 400) {
          const listError = err.response.data.errors;
          listError.forEach((error) => {
            msg[error.path] = error.msg;
          });
        }
        else if (err.response && err.response.status === 500){
          msg["other"]="You have already reviewed this item."
        }
    }
    setMessage(msg);
  }
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
              Đánh giá sản phẩm
            </span>
            <span style={{ opacity: "0.5" }}>
              Chia sẻ trải nghiệm về sản phẩm này
            </span>
          </div>
          <button className="close-button" onClick={props.onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="popup-body">
          <div
            className="d-flex flex-column"
            style={{
              width: "100%",
              padding: "10px 15px",
              backgroundColor: "rgba(238, 238, 238, 0.5)",
              borderRadius: "0.7rem",
            }}
          >
            <span style={{ fontWeight: "500" }}>{item.name}</span>
            <span style={{ opacity: "0.5" }}>Đơn hàng: #ORD{orderInfo.id}</span>
          </div>
          <RatingForm onRate={setRate} message={message} />
          <FeedBackForm onComment={setComment} />
           <span style={{ color: "red" }}>{message.other}</span>
          <div className="d-flex flex-row-reverse">
            <div
              className="btn-create"
              style={{ marginLeft: "15px" }}
              onClick={() => {
                handleSubmit();
              }}
            >
              <span style={{ fontWeight: "500" }}>Gửi đánh giá</span>
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
export default FeedBackPopup;
