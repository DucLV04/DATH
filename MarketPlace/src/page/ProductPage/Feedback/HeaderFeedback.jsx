import React from "react";
import { useState } from "react";
function HeaderFeedback(props) {
  const [newest,setNewest] =useState(true);
  function hanldeNewest(){
    setNewest(!newest);
    props.onSort(newest);
  }
  return (
    <div className="header-feedback">
      <span style={{ color: "black", fontWeight: "500", fontSize: "17px",marginRight:"auto" }}>
        ĐÁNH GIÁ SẢN PHẨM
      </span>
      <div className={`filter-feedback ${!newest && "selected-feedback"}`} onClick={hanldeNewest}>Tất cả</div>
       <div className={`filter-feedback ${newest && "selected-feedback"}`} onClick={hanldeNewest}>Mới nhất</div>
    </div>
  );
}
export default HeaderFeedback;
