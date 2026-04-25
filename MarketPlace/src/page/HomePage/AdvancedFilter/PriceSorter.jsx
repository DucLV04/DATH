import React from "react";
import { useState } from "react";
import SelectBox from "../FilterSection/SelectBox";
import OptionList from "../FilterSection/OptionList";
function PriceSorter(props) {
  const listOption = ["Giá: Thấp đến cao", "Giá: Cao đến thấp"];
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState(props.sortBy);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function handleOptionSelect(option) {
    setOption(option);
    props.onSort({sortByPrice:option})
    props.onOrder(prev => ({...prev,price:option}));
    setIsOpen(!isOpen);
  }

  return (
    <div className="selector-container">
      <span
        style={{
          fontWeight: "500",
          marginBottom: "5px",
        }}
      >
        Sắp xếp
      </span>
        <SelectBox onToggle={toggleDropdown} isOpen={isOpen} option={option}/>
       {isOpen&&<OptionList option={option} onSelect={handleOptionSelect} listOption={listOption}/>}
    </div>
  );
}
export default PriceSorter;
