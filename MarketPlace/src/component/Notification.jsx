import React from "react";
import { Check, X } from "lucide-react";
import { useState } from "react";
function Notification(props){
    return <div className="notifi-container" style={{display:"flex", backgroundColor:props.color}}>
        <span>
           <Check style={{marginRight:"10px"}}/> 
              {props.message}
        </span>
        <div style={{marginLeft:"auto",marginRight:"40px",cursor:"pointer"}} onClick={props.onClose}>
            <X/>
        </div>
    </div>
}
export default Notification;