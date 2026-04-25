import React,{useState} from "react";
import Header from "../../component/Header";
import HistoryOrderHeader from "./HeaderPage/HistoryOrderHeader";
import OrderContainer from "./OrderContainer/OrderContainer";
function HistoryOrderPage(){
    const [status,setStatus]=useState("Tất cả");
    return <div>
         <div className="container px-5 py-3 d-flex flex-column gap-4" style={{width:"1000px"}}>
          <HistoryOrderHeader status={status} onStatus={setStatus}/>
          <OrderContainer status={status}/>
      </div>
    </div>
}
export default HistoryOrderPage;