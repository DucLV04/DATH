import React from "react";
import Hashtag from "../../../component/Hashtag";
function TrendingItem(props) {
  return (
      <li className="trending-item">
        <span className="ranknumber">{props.ranknumber}</span>
       <Hashtag hashtag={props.hashtag}/>
        <span className="countnumber">{props.countnumber}</span>
      </li>
  );
}
export default TrendingItem;
