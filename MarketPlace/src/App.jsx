import React from "react";

import { BrowserRouter, Router, Routes, Route, useLocation  } from "react-router-dom";
import  Layout  from "./Layout";
function App() {
   return (
    <BrowserRouter basename="/MarketPlace">
      <Layout />
    </BrowserRouter>
  );
}
export default App;
