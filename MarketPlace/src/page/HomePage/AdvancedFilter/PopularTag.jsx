import React from "react";
import { useState } from "react";
import TagItem from "./TagItem";
function PopularTag(props) {
  const tag = props.tag;
  const listTag = [
    { name: "electronics", selected: false },
    { name: "apple", selected: false },
    { name: "phone", selected: false },
    { name: "laptop", selected: false },
    { name: "gaming", selected: false },
    { name: "fashion", selected: false },
    { name: "vintage", selected: false },
    { name: "sports", selected: false },
    { name: "fitness", selected: false },
    { name: "homedecor", selected: false },
    { name: "trending", selected: false },
    { name: "sale", selected: false },
    { name: "dell", selected: false },
    { name: "headphones", selected: false },
    { name: "bose", selected: false },
    { name: "audio", selected: false },
    { name: "tea", selected: false },
    { name: "organic", selected: false },
    { name: "groceries", selected: false },
    { name: "handmade", selected: false },
    { name: "ceramics", selected: false },
    { name: "kitchen", selected: false },
  ];

  const [tags, setTags] = useState(
    listTag.map((item) => ({
      ...item,
      selected: tag.includes(item.name),
    }))
  );
  function handleTag(name) {
    const newTags = [...tag];
    const index = newTags.indexOf(name);
    if (index !== -1) {
      newTags.splice(index, 1);
    } else {
      newTags.push(name);
    }
    setTags((prev) =>
      prev.map((tag) =>
        tag.name === name ? { ...tag, selected: !tag.selected } : tag
      )
    );
    props.onTag({ keyword: newTags });
  }
  return (
    <div className="categories-container" style={{ marginTop: "20px" }}>
      <span
        style={{
          fontWeight: "500",
          marginBottom: "10px",
        }}
      >
        Từ khóa phổ biến
      </span>
      <div className="tag-container">
        {tags.map((tag, index) => {
          return (
            <TagItem
              key={index}
              name={tag.name}
              selected={tag.selected}
              onSelect={handleTag}
            />
          );
        })}
      </div>
    </div>
  );
}
export default PopularTag;
