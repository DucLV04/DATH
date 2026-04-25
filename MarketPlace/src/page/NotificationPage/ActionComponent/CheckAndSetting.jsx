import React from "react";
import {Settings,Check} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { markAllAsRead } from "../../../services/notficationService"; 
function CheckAndSetting(){
  const navigate=useNavigate();
  async function handleMarkAllAsRead(){
    try{
      const data=await markAllAsRead();
       navigate(0);
    }
    catch(err){
      console.error(err);
    }
  }
    return <div className="d-flex flex-row-reverse gap-3">
             <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm d-none d-md-inline"
            style={{ color: "black" }}
            onClick={handleMarkAllAsRead}
          >
            <Check size={15} style={{marginRight:"10px",marginBottom:"3px"}}/> <span style={{fontSize:"13.5px"}}>Đánh dấu tất cả là đã đọc</span>
          </button>
    </div>
}
export default CheckAndSetting;