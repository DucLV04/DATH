import React from "react";
function BarItem(props) {
  const number = props.number;
  const rate = props.rate;
  const total = props.total;
  return (
    <div className="bar-item">
      <span>{number}</span>
      <div className="bar-wrapper">
        <div
          className="bar-filled"
          style={{ width: `${(rate * 100) / total}%` }}
        ></div>
      </div>
    </div>
  );
}
export default BarItem;
