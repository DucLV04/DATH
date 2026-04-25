import React, { useEffect, useState } from "react";
import Header from "../../component/Header";
import NotificationHeader from "./HeaderPage/NotificationHeader";
import ActionComponent from "./ActionComponent/ActionComponent";
import NotificationContainer from "./NotificationContainer/NotificationContainer";
import { getNotification } from "../../services/notficationService";
function NotificationPage() {
  const [notifications,setList]=useState([]);
  const [typeNotification,setType]=useState("Tất cả");
  async function fetchNotification() {
    try {
      const data = await getNotification();
      setList(data);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(()=>{
    fetchNotification()
  },[]);
  function handleTypeChange(type){
    setType(type);
  }
  return (
    <div>
      <div
        className="container px-5 py-3 d-flex flex-column gap-4"
        style={{ width: "1000px" }}
      >
        <NotificationHeader numberNoti={notifications.length}/>
        <ActionComponent onChange={handleTypeChange}/>
        <NotificationContainer notifications={notifications} typeNotification={typeNotification}/>
      </div>
    </div>
  );
}
export default NotificationPage;
