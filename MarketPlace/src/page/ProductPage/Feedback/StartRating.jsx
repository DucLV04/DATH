import React from "react";
import Start from "./Start";
function StartRating(props) {
  const rating = props.rating;
  const number =props.number>=1000 ?  Math.floor(props.number / 1000) : props.number;
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
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <span style={{ fontSize: "30px", fontWeight: "500" }}>
        {rating} <span style={{ fontSize: "17px" }}>trên 5</span>
      </span>
      <div className="star-list">{starts}</div>
      <span style={{ fontSize: "12px", opacity: "0.5" }}>
        {props.number >=1000 ? number + "N đánh giá" : number + " đánh giá"} 
      </span>
    </div>
  );
}
export default StartRating;
