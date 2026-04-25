import React from "react";
import CheckAndSetting from "./CheckAndSetting";
import FilterNotification from "./FilterNotification";
function ActionComponent(props){
    return <div className="d-flex flex-column gap-3">
        <CheckAndSetting/>
        <FilterNotification onChange={props.onChange}/>
    </div>
}
export default ActionComponent;