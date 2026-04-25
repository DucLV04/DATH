import React from "react";
function BrandItem(props) {
  const name = props.name;
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value={name}
        id={`check-${name}`}
        checked={props.checked}
        onChange={() => {
          props.onCheck(name);
        }}
      />
      <label
        className="form-check-label"
        htmlFor={`check-${name}`}
        style={{ fontSize: "15px", fontWeight: "450" }}
      >
        {name}
      </label>
    </div>
  );
}
export default BrandItem;
