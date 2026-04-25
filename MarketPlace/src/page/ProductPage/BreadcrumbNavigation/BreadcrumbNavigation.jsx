import React from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight} from "lucide-react"
function BreadcrumnNavigation (props){
    const navigate=useNavigate();
    return <div className="container-breadcrumb">
        <span className="rootpage" onClick={()=>{
            navigate("/home")
        }}>Trang chủ</span>
        <span><ChevronRight size={14}/></span>
        <span style={{color:"black"}}>{props.title}</span>
    </div>
}
export default BreadcrumnNavigation