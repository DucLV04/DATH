import React from "react";
import OptionItem from "./OptionItem";
function OptionList(props) {
  const listOption=props.listOption;
  return (
    <ul className="option-list">
      {listOption.map((option,index)=>{
        return <OptionItem optioned={props.option} onSelect={props.onSelect} option={option} key={index}/>
      })}
    </ul>
  );
}
export default OptionList;
