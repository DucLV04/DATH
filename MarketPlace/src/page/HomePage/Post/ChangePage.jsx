import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
function ChangePage(props) {
  return (
    <div className="change-page">
      <span>The current page: {props.page}</span>
      <div className="d-flex gap-2" style={{ marginLeft: "auto" }}>
        <div
          onClick={() => {
            if (props.page > 1) props.onChange(props.page - 1);
          }}
          className="chevron-box"
        >
          <ChevronLeft size={20} />
        </div>
        <div onClick={()=>props.onChange(props.page+1)} className="chevron-box">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
}
export default ChangePage;
