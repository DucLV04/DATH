import React from "react";
function TypeAction(props) {
  const type = props.type;
  const chosen = props.chosen === type;
  return (
    <div
      className="col-3 type-container"
      style={{ backgroundColor: chosen ? "white" : "" }}
      onClick={() => {
        props.onChosen(type);
      }}
    >
      <span>{type}</span>
    </div>
  );
}
export default TypeAction;
