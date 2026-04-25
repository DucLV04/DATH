import React,{useState} from "react";
import { X } from "lucide-react";
import RatingForm from "./RatingForm";
import FeedBackForm from "./FeedBackForm";
import { postReplyReview } from "../../../services/reviewService";
function FeedBackPopup(props) {
  if (!props.isOpen) return null;
  const [content,setContent]=useState("");
  function handleContent(content){
    setContent(content);
  }
  async function handlePostReply() {
    try {
      const data=await postReplyReview(props.id,content);
    }
    catch(err){
      console.error(err);
    }
  }
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
              Phản hồi đánh giá của khách hàng
            </span>
            <span style={{ opacity: "0.5" }}>
              Trả lời lại các đánh giá của khác hàng
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
            <span style={{ fontWeight: "500" }}>{props.nameUser}</span>
            <span style={{ opacity: "0.5" }}>{props.comment}</span>
          </div>
          <FeedBackForm onChange={handleContent}/>
          <div className="d-flex flex-row-reverse">
            <div
              className="btn-create"
              style={{ marginLeft: "15px" }}
              onClick={()=>{
                props.onClose();
                handlePostReply();
              }}
            >
              <span style={{ fontWeight: "500" }}>Gửi phản hồi</span>
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
