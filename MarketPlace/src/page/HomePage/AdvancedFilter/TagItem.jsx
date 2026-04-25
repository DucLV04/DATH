import React from "react";
function TagItem(props){
    return <div className={`tag-item ${props.selected&&"tag-select"}`} onClick={()=>{
        props.onSelect(props.name)
    }}>
        {props.name}
    </div>
}
export default TagItem;