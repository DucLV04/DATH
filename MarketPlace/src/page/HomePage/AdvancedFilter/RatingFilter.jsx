import React from "react";
import RatingItem from "./RatingItem";
import { useState } from "react";
function RatingFilter(props) {
   const listRating=[5,4,3,2,1];
   const [selected,setSelected]=useState(props.ratingMin);
   function hanldeSelect(rating){
    if (rating===selected) {
      setSelected(0);
      props.onRating({
        rating_min:0
      });
    }
     else {
      setSelected(rating);
      props.onRating({
        rating_min:rating
      });
     }
   }
  return (
    <div className="categories-container" style={{ marginTop: "20px" }}>
      <span
        style={{
          fontWeight: "500",
          marginBottom: "5px",
        }}
      >
        Đánh giá
      </span>
        {listRating.map((rating,index)=>{
            return <RatingItem key={index} rating={rating} selected={selected} onSelect={hanldeSelect}/>
        })}
    </div>
  );
}
export default RatingFilter;
