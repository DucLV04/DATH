import React from "react";
function Start(props) {
  const width = props.width;
  if (props.type === "partial") {
    return (
      <div className="star-wrapper partial-start">
        <span className="star-empty">★</span>
        <span className="star-filled-overlay" style={{ width: `${width}%` }}>
          ★
        </span>
      </div>
    );
  }
  return (
    <div className="star-wrapper">
      <span
        className={props.type==="full"?"star-filled":"star-empty"}
      >
        ★
      </span>
    </div>
  );
}
export default Start;
