import React from "react";
function PriceRange(props) {
  const range = props.range;
  const select = props.selected === props.id;
  return (
    <div className="price-range">
      <div
        className="circle-wrapper"
        onClick={() => {
          props.onSelect(props.id);
        }}
        style={{ cursor: "pointer" }}
      >
        <div
          className="circle-dot"
          style={{ display: select ? "" : "none" }}
        ></div>
      </div>
      <span style={{ fontSize: "15px", fontWeight: "450", paddingTop: "2px" }}>
        {range}
      </span>
    </div>
  );
}
export default PriceRange;
