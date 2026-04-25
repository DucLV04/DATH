import React from "react";
import InfoSeller from "../OrderContainer/InfoSeller";
function InfoSellerPopup(){
    return <div className="d-flex flex-column">
        <span style={{fontWeight:"500"}}>Thông tin người bán</span>
        <InfoSeller/>
        <hr/>
    </div>
}
export default InfoSellerPopup;