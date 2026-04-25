import React from "react";
import { TrendingUp, Filter, Hash, Plus } from "lucide-react";
import SelectorFilter from "./SelectorFilter";
import Categories from "./Categories";
function FilterSection(props) {
  const listCategories=props.listCategories;
  const filter=props.filter;
  return (
    <div className="filter-container">
      <span className="title-filter">
        <Filter className="icon-btn-size" /> Bộ lọc
      </span>
      <SelectorFilter sortBy={filter.sortBy} onSort={props.onFilter}/>
      <Categories filtBy={filter.category} onFilter={props.onFilter} listCategories={listCategories}/>
    </div>
  );
}
export default FilterSection;
