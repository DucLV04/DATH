import React from "react";
import { useNavigate } from "react-router-dom";
function ContentItem(props) {
  const navigate=useNavigate();
  const srcImg = props.srcImg;
  const title = props.title;
  const litleTitle = props.litleTitle;
  const content = props.content;
  return (
    <div
      className="container"
      style={{
        marginLeft: "150px",
        marginRight: "0px",
        marginBottom: "0px",
        padding: "0px 100px 0px 100px",
      }}
    >
      <div className="row" style={{ height: "91vh" }}>
        <div class="col-5 content-item">
          <span style={{color:"#ff6a00", fontSize:"17px",fontWeight:"500"}}>{litleTitle}</span>
          <span style={{fontSize:"50px",fontWeight:"700"}}>{title}</span>
          <span style={{fontSize:"20px"}}>{content}</span>
          <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm d-none d-md-inline"
            style={{ color: "white", background:"#ff6a00", width:"150px", height:"50px",fontSize:"17px" }}
            onClick={()=>{
              navigate("/login")
            }}
          >
            Shop now
          </button>
        </div>
        <div class="col-7">
          <img src={srcImg} />
        </div>
      </div>
    </div>
  );
}
export default ContentItem;
