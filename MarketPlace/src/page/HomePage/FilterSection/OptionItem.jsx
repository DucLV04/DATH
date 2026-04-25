import React from "react";
function OptionItem(props) {
    const option=props.option;
  return (
    <li
      className={`option-item ${
        props.optioned === option ? "selected-filter" : ""
      }`}
      onClick={() => props.onSelect(option)}
    >
      {option}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-check2"
        viewBox="0 0 16 16"
        display={props.optioned === option ? "block" : "none"}
      >
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
      </svg>
    </li>
  );
}
export default OptionItem;
