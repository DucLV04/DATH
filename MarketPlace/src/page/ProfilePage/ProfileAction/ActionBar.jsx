import React from "react";
import { useState } from "react";
import TypeAction from "../../NotificationPage/ActionComponent/TypeAction";
function ActionBar(props) {
  const [chosen, setChosen] = useState("Sản phẩm của tôi");
  function handleChoose(chosen) {
    setChosen(chosen);
    props.onCurrent(chosen);
  }
  return (
    <div className="filter-bar row">
      <TypeAction
        type="Sản phẩm của tôi"
        chosen={chosen}
        onChosen={handleChoose}
      />
      <TypeAction
        type="Đơn hàng của tôi"
        chosen={chosen}
        onChosen={handleChoose}
      />
      <TypeAction type="Giới thiệu" chosen={chosen} onChosen={handleChoose} />
      <TypeAction type="Cài đặt" chosen={chosen} onChosen={handleChoose} />
    </div>
  );
}
export default ActionBar;
