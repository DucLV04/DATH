import React from "react";
import Start from "../../ProductPage/Feedback/Start";
function RatingItem(props) {
  const rating = props.rating;
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
      className={`star-list ${props.selected === rating && "selected-rating"}`}
      style={{ fontSize: "13px", cursor: "pointer" }}
      onClick={() => {
        props.onSelect(rating);
      }}
    >
      {starts}
      {rating !== 5 && (
        <span
          style={{ paddingTop: "8px", marginLeft: "5px", fontSize: "14px" }}
        >
          trở lên
        </span>
      )}
    </div>
  );
}
export default RatingItem;
