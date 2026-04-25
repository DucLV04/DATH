import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
function SelectBox(props){
    return <div className="select-box" onClick={()=>{props.onToggle()}}>
        <span>{props.option}</span>
        {props.siOpen?<ChevronUp style={{width:"1rem",height:"1rem",opacity:"0.5"}}/>:                                                          
        <ChevronDown style={{width:"1rem",height:"1rem",opacity:"0.5"}}/>}
    </div>
}
export default SelectBox;