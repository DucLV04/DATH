import React from "react";
import BarItem from "./BarItem";
import { getTotalRating } from "../../../utils/utils";
function RatingBar(props) {
  const rateList=props.rateList;
  const total=getTotalRating(rateList);
  return (
    <div className="bar-container">
        {rateList.map((item,index)=>{
            return   <BarItem key={index} number={item.number} rate={item.rate} total={total} />
        })}
      
    </div>
  );
}
export default RatingBar;
