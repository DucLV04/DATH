import React from "react";
import Header from "../../component/Header";
import HeaderUpload from "./UploadForm/HeaderUpload";
import UploadForm from "./UploadForm/UploadForm";
import { useLocation } from "react-router-dom";
function UploadPage(){
    return <div>
        <div className="container-order">
            <div className="container px-5 py-3 d-flex flex-column gap-4" style={{textAlign:"left",width:"1000px"}}>
                <HeaderUpload />
                <UploadForm/>
            </div>
        </div>
    </div>
}
export default UploadPage;