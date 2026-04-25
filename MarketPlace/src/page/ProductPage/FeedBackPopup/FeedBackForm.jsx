import React,{useState} from "react";
function FeedBackForm(props) {
  const [content,setContent]=useState(props.content||"");
  function handleChange(e){
    setContent(e.target.value);
    props.onChange(e.target.value);
  }
  return (
    <div className="d-flex flex-column">
      <label htmlFor="InputDescription" className="form-label">
        Phản hồi của bạn
      </label>
      <textarea
        type="text"
        id="InputDescription"
        className="form-control"
        placeholder="Nhập phản hồi của bạn..."
        style={{ borderRadius: "0.5rem" }}
        rows="5"
        value={content}
        onChange={handleChange}
      ></textarea>
    </div>
  );
}
export default FeedBackForm;