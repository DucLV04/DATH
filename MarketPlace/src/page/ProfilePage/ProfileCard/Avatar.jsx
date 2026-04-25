import React from "react";
import { API_BASE } from "../../../api/axiosClient";
function Avatar(props) {
  const avatar=props.avatar || "";
  const username=props.username;
  return (
    <div
      className="avt-mini"
      style={{ width: "4.5rem", height: "4.5rem", fontSize: "20px", marginBottom:"10px" }}
    >
      {avatar === "" ? (
          username[0]
        ) : (
          <img src={`${API_BASE}${avatar}`} alt="avatar" />
        )}
    </div>
  );
}
export default Avatar;
