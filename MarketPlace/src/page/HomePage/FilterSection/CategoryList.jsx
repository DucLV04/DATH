import React from "react";
import CategoryItem from "./CategoryItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function CategoryList(props) {
  const listCategories=props.listCategories;
  const [fitlerByCategory, setFilterByCategory] = useState(props.filtBy);
  function handleCategorySelect(category){
        props.onFilter({category:category});
        setFilterByCategory(category);
    }
  return (
    <ul className="category-list">
      {listCategories.map((category, index) => (
        <CategoryItem
          key={index} category={category} onSelect={handleCategorySelect} onFilter={fitlerByCategory}/>))}
    </ul>
  );
}
export default CategoryList;
