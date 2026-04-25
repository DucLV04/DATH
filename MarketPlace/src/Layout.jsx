import React from "react";

import { BrowserRouter, Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./component/Header";
import HomePage from "./page/HomePage/HomePage";
import ProductPage from "./page/ProductPage/ProductPage";
import OrderPage from "./page/OrderPage/OrderPage";
import UploadPage from "./page/UploadPage/UploadPage";
import HeroPage from "./page/HeroPage/HeroPage";
import LoginPage from "./page/LoginPage/LoginPage";
import RegisterPage from "./page/RegisterPage/RegisterPage";
import ForgetPassword from "./page/ForgetPassword/ForgetPassword";
import NotificationPage from "./page/NotificationPage/NotificationPage";
import HistoryOrderPage from "./page/HistoryOrderPage/HistoryOrderPage";
import ProfilePage from "./page/ProfilePage/ProfilePage";
import CartPage from "./page/CartPage/CartPage";
import EditPage from "./page/EditPage/EditPage";
import EmailVerify from "./page/EmailVerify/EmailVerify";
import ShopPage from "./page/ShopPage/ShopPage";
function Layout() {
  const location = useLocation();
  const showHeader = location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/reset-password" && location.pathname !== "/verify-email";
  return (
    <div>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/home" element={<HomePage key={location.search} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<EmailVerify />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/detail" element={<ProductPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/ordered" element={<HistoryOrderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shop/:id" element={<ShopPage />} />
      </Routes>
    </div>
  );
}
export default Layout;
