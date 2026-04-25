import React from "react";
import Hashtag from "../../../component/Hashtag";
function DescriptionProduct(props) {
  const listHashtag=props.hashtags;
  return (
    <div className="container-description">
      <span style={{ color: "black", padding: "20px" }}>Mô tả sản phẩm</span>
      <div className="content-description">{props.content}</div>
      <div className="hashtag-product" style={{ paddingLeft: "10px" }}>
          {listHashtag.map((hashtag,index)=>{
             return <Hashtag key={index} hashtag={hashtag.tag}/>
          })}
      </div>
    </div>
  );
}
export default DescriptionProduct;
