import React from "react";

import { useNavigate } from "react-router-dom";
function HeaderHero(props) {
  const navigate = useNavigate();
  const pageName = props.pageName;
  return (
    <header className="header-sticky">
      <div className="py-2 d-flex justify-content-between align-items-center px-4">
        <div className="d-flex align-items-center">
          <button
            className="btn d-flex align-items-center btn-logo "
            style={{ cursor: "default" }}
          >
            <div className="logo-space">
              <span style={{ color: "white", fontWeight: "bold" }}>M</span>
            </div>
            <span
              className="d-none d-md-inline"
              style={{
                fontWeight: "600",
                fontSize: "1.125rem",
                marginLeft: "0.5rem",
              }}
            >
              MarketPlace
            </span>
          </button>
        </div>
       
        <div className="d-flex align-items-center gap-3">
               <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm d-none d-md-inline"
            style={{ color: "white", background:"#ff6a00" }}
            onClick={()=>{
              navigate("/login")
            }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm d-none d-md-inline"
            style={{ color: "black",width:"90px" }}
            onClick={()=>{
              navigate("/register")
            }}
          >
            Đăng kí
          </button>
        </div>
      </div>
    </header>
  );
}
export default HeaderHero;
