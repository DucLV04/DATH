import React from "react";
import Header from "../../component/Header";
import HeaderOrder from "./OrderForm/HeaderOrder";
import OrderForm from "./OrderForm/OrderForm"
import { useLocation } from "react-router-dom";
function OrderPage(){
    const location=useLocation();
    const {listItem} =location.state;
    console.log(listItem);
    return <div>
        <div className="container-order">
            <div className="container px-5 py-3 d-flex flex-column gap-4" style={{textAlign:"left"}}>
                <HeaderOrder/>
                <OrderForm products={listItem}/>
            </div>
        </div>
    </div>
}
export default OrderPage;