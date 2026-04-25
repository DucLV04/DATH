import React, { useState } from "react";
function FeedBackForm(props) {
  const [comment,setComment]=useState("");

  return (
    <div className="d-flex flex-column">
      <label htmlFor="InputDescription" className="form-label">
        Nhận xét của bạn
      </label>
      <textarea
        type="text"
        id="InputDescription"
        className="form-control"
        placeholder="Chia sẽ trải nghiệm của bạn về sản phẩm này...."
        style={{ borderRadius: "0.5rem" }}
        rows="5"
        value={comment}
        onChange={(e)=>{
          setComment(e.target.value);
          props.onComment(e.target.value);
        }}
      ></textarea>
    </div>
  );
}
export default FeedBackForm;