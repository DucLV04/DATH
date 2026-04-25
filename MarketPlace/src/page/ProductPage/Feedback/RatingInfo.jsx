import React from "react";
import StartRating from "./StartRating";
import RatingBar from "./RatingBar";
import Comment from "./Comment";
import { getTotalRating, getAvgRating } from "../../../utils/utils";
function RatingInfo(props) {
  const rateList=props.rateList;
  return (
    <div className="rating-container">
      <StartRating rating={getAvgRating(rateList)} number={getTotalRating(rateList)} />
      <RatingBar rateList={rateList}/>
    </div>
  );
}
export default RatingInfo;
