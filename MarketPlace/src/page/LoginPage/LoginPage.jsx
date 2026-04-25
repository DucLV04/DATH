import React from "react";
import HeaderLogin from "./HeaderLogin";
import FormLogin from "./FormLogin";
function LoginPage() {
  return (
    <div className="container-login">
      <div className="login-form">
        <HeaderLogin/>
        <FormLogin/>
      </div>
    </div>
  );
}
export default LoginPage;
