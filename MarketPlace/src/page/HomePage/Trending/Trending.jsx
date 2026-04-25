import React from "react";
import { TrendingUp } from "lucide-react";
import TrendingItem from "./TrendingItem";
function Trending(props) {
  const listTrending = props.listTrending;
  return <div className="filter-container">
    <span className="title-filter"><TrendingUp className="icon-btn-size" /> Hashtag thịnh hành</span>
    <ul className="trending-list">
      {listTrending.map((item, index) => (
        <TrendingItem key={index} hashtag={item.hashtag} ranknumber={item.ranknumber} countnumber={item.countnumber} />
      ))}
    </ul>
  </div>
}
export default Trending;