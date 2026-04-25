import React from "react";
import { useNavigate } from "react-router-dom";
import {Plus} from "lucide-react"
function CreateProductPost() {
  const navigate=useNavigate();
  return (
    <div className="create-card" onClick={()=>{
      navigate("/upload",{state:{
        update:false
      }})
    }}>
      <div className="btn-add">
        <Plus className="icon-btn-size" style={{color:"#ff6a00"}}/>
      </div>
      <div className="content-create">
        <span>Chia sẻ sản phẩm của bạn</span>
        <span style={{opacity:"0.5", fontSize:"0.9rem"}}>Bắt đầu bán hoặc chia sẻ những gì bạn có...</span>
      </div>
    <div className="btn-create">
        <span style={{fontWeight:"490"}}>Đăng bán</span>
    </div>
    </div>
  );
}
export default CreateProductPost;
