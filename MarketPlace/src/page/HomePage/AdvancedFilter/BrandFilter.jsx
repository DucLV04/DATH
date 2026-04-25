import React from "react";
import { useState } from "react";
import BrandItem from "./BrandItem";
function BrandFilter(props) {
  const listBrand = [
    { name: "Apple", checked: false },
    { name: "Microsoft", checked: false },
    { name: "Dell", checked: false },
    { name: "Symphony", checked: false },
    { name: "Sony", checked: false },
    { name: "LG", checked: false },
    { name: "One Plus", checked: false },
    { name: "Google", checked: false },
    { name: "Samsung", checked: false },
    { name: "HP", checked: false },
    { name: "Xiaomi", checked: false },
    { name: "Panasonic", checked: false },
    { name: "Thương hiệu khác", checked: false },
  ];
  const [brands, setBrands] = useState(listBrand);
  function handleBrand(name) {
    setBrands((prev) =>
      prev.map((brand) =>
        brand.name === name ? { ...brand, checked: !brand.checked } : brand
      )
    );
  }
  return (
    <div className="categories-container" style={{ marginTop: "20px"}}>
      <span
        style={{
          fontWeight: "500",
          marginBottom: "5px",
        }}
      >
        Thương hiệu
      </span>
      <div className="row" style={{ width: "100%", marginTop:"5px" }}>
        <div className="col-6 ">
          {brands.slice(0,7).map((brand, index) => {
            return (
              <BrandItem
                key={index}
                name={brand.name}
                checked={brand.checked}
                onCheck={handleBrand}
              />
            );
          })}
        </div>
        <div className="col-6 " style={{ paddingRight: "0px" }}>
          {brands.slice(7).map((brand, index) => {
            return (
              <BrandItem
                key={index}
                name={brand.name}
                checked={brand.checked}
                onCheck={handleBrand}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default BrandFilter;
