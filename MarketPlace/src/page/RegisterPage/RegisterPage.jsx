import React from "react";
import HeaderRegister from "./HeaderRegister";
import FormRegister from "./FormRegister";
function RegisterPage() {
  return (
    <div className="container-login">
      <div className="register-form">
        <HeaderRegister />
        <FormRegister/>
      </div>
    </div>
  );
}
export default RegisterPage;
