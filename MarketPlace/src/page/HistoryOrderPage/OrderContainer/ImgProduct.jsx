import React from "react";
import myPicture from "../../../img/iphone.webp";
import { API_BASE } from "../../../api/axiosClient";
function ImgProduct(props){
    return <div className="mini-img">
          <img src={`${API_BASE}${props.src}`}/>
    </div>
}
export default ImgProduct;