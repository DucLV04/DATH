import React from "react";
function CategoryItem(props){
  return <li className={`category-item ${props.onFilter===props.category ? "selected-category":""}`} onClick={()=>props.onSelect(props.category)}>
        {props.category}
  </li>
}
export default CategoryItem;