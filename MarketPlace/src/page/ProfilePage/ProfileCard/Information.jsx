import React from "react";
function Information(props) {
  const user=props.user;

  return (
    <div className="d-flex flex-column gap-2 align-items-center">
      <span style={{ fontWeight: "500", fontSize: "17px" }}>
        {user.username}
      </span>
      <span style={{ opacity: "0.6", fontSize: "13px" }}>{user.email}</span>
    </div>
  );
}
export default Information;
