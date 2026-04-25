import React from "react";
import Start from "./Start";
import { useState } from "react";
import { formatTime } from "../../../utils/utils";
import myPicture from "../../../img/iphone.webp";
import myPicture2 from "../../../img/iphone2.webp";
import { parseISO } from "date-fns";
import FeedBackPopup from "../FeedBackPopup/FeedBackPopup";
import { API_BASE } from "../../../api/axiosClient";
function Comment(props) {
  const [isFeedBackPopupOpen, setIsFeedBackPopupOpen] = useState(false);
  const openFeedBackPopup = () => setIsFeedBackPopupOpen(true);
  const closeFeedBackPopup = () => setIsFeedBackPopupOpen(false);
  const id = props.id;
  const replies = props.replies;
  const numberReplies = props.numberReplies || 0;
  const authorName = props.author;
  const authorAvatar = props.avatar;
  const createAt = parseISO(props.createAt);
  const content = props.content;
  const [show, setShow] = useState(false);
  const [source, setSource] = useState();
  const rating = props.rating;
  const number = Math.floor(props.number / 1000);
  const fullStarts = Math.floor(rating);
  const partialStartWidth = (rating - fullStarts) * 100;
  const starts = Array.from({ length: 5 }, (_, index) => {
    const startNumber = index + 1;
    if (startNumber <= fullStarts) {
      return <Start key={index} type="full" />;
    } else if (startNumber === fullStarts + 1 && partialStartWidth > 0) {
      return <Start key={index} type="partial" width={partialStartWidth} />;
    } else {
      return <Start key={index} type="empty" />;
    }
  });
  function handleShow(e) {
    if (source === e.target.src || !show) setShow(!show);
    setSource(e.target.src);
  }
  return (
    <div className="comment-container">
      <div className="avt-container">
        <span className="avt-mini">
          {authorAvatar === "" ? (
            authorName[0]
          ) : (
            <img src={`${API_BASE}${authorAvatar}`} alt="avatar" />
          )}
        </span>
      </div>

      <div className="info-comment">
        <span style={{ fontWeight: "500", paddingLeft: "2px" }}>
          {authorName}
        </span>
        <span style={{ opacity: "0.5", fontSize: "12px", paddingLeft: "2px" }}>
          {formatTime(createAt)}
        </span>
        {!replies && (
          <div className="star-list" style={{ fontSize: "9px" }}>
            {starts}
          </div>
        )}

        <span style={{ marginTop: "10px" }}>{content}</span>
      </div>
      {!replies && (
        <div className="btn-create" onClick={openFeedBackPopup}>Phản hồi ({numberReplies})</div>
      )}
      <FeedBackPopup id={id} isOpen={isFeedBackPopupOpen} onClose={closeFeedBackPopup} nameUser={authorName} comment={content} />
    </div>
  );
}
export default Comment;
