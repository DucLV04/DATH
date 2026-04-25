import React,{useEffect, useState} from "react";
import OrderItem from "./OrderIItem";
import { getOrderHistory } from "../../../services/orderService";
import { filterOrdersByStatusVi } from "../../../utils/utils";
function OrderContainer(props) {
  const status=props.status;
  const [loading,setLoading]=useState(true);
  const [orders,setList]=useState([]);
  const [orderFilter,setFilter]=useState([]);
  async function getOrder() {
    try{
      const data=await getOrderHistory();
      setList(data);
      setFilter(data);
    }
    catch(err){
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  } 
  useEffect(()=>{
    getOrder();
  },[]);
  useEffect(()=>{
    setFilter(filterOrdersByStatusVi(orders,status));
  },[status])
  return (
    <div className="d-flex flex-column gap-2">
      {orderFilter.map((order,index)=>{
        return <OrderItem key={index} order={order}/>
      })}
    </div>
  );
}
export default OrderContainer;
