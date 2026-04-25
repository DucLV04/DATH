import React, { useState, useEffect } from "react";
import {
  Search,
  Camera,
  Wallet,
  Bell,
  Menu,
  Sun,
  Moon,
  User,
  Settings,
  Badge,
  Home,
  ShoppingBag,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { getNotification } from "../services/notficationService";
import { getCartItems } from "../services/cartService";

function Header(props) {
  const navigate = useNavigate();
  const [notifications, setList] = useState([]);
  const [numberNoti, setNumber] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [keyword, setKeyword] = useState("");

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  }

  async function fetchNotificationForHeader() {
    try {
      const data = await getNotification();
      setList(data);
      setNumber(data.filter((noti) => !noti.is_read).length);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCartCount() {
    try {
      const cartData = await getCartItems();
      if (cartData && cartData.items) {
        setCartCount(cartData.items.length);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      // console.error(err);
    }
  }

  useEffect(() => {
    fetchNotificationForHeader();
    fetchCartCount();

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cart-updated', handleCartUpdate);

    const interval = setInterval(fetchNotificationForHeader, 500);
    return () => {
      clearInterval(interval);
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);
  return (
    <header className="header-sticky">
      <div className="py-2 d-flex justify-content-between align-items-center px-4">
        <div className="d-flex align-items-center">
          <button
            className="btn d-flex align-items-center btn-logo "
            style={{ cursor: "default" }}
            onClick={() => {
              navigate("/home");
            }}
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
        <div
          className="flex-grow-1 mx-4 relative"
          style={{ maxWidth: "28rem", minWidth: "130px" }}
        >
          <form className="input-group position-relative" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sản phẩm theo mô tả ..."
              style={{ paddingLeft: "2.5rem", borderRadius: "0.5rem" }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/home?search=${keyword}`);
              }}
            />
            <Search
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/home?search=${keyword}`);
              }}
              className="search-icon"
            />
          </form>
        </div>
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm d-none d-md-inline"
            style={{ color: "black" }}
            onClick={() => {
              navigate("/upload");
            }}
          >
            Đăng bán
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm ms-3 "
            style={{
              color: "black",
            }}
            onClick={() => {
              navigate("/home");
            }}
          >
            <Home className="icon-btn-size" />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm ms-3 position-relative"
            style={{ color: "black" }}
            onClick={() => {
              navigate("/notification");
            }}
          >
            <Bell className="icon-btn-size" />
            {numberNoti > 0 && (
              <div className="badge-container">
                <p style={{ margin: "0" }}>{numberNoti}</p>
              </div>
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm ms-3 position-relative d-none d-md-inline"
            style={{ color: "black" }}
            onClick={() => {
              navigate("/ordered");
            }}
          >
            <ShoppingBag className="icon-btn-size" />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm ms-3 position-relative d-none d-md-inline"
            style={{ color: "black" }}
            onClick={() => {
              navigate("/cart");
            }}
          >
            <ShoppingCart className="icon-btn-size" />
            {cartCount > 0 && (
              <div className="badge-container">
                <p style={{ margin: "0" }}>{cartCount}</p>
              </div>
            )}
          </button>
          <button
            className="btn btn-outline-secondary btn-custom ms-3  btn-avt"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person"
              viewBox="0 0 16 16"
              style={{ color: "black" }}
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            </svg>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-custom btn-sm ms-3 position-relative d-none d-md-inline"
            style={{ color: "black" }}
            onClick={handleLogout}
          >
            <LogOut className="icon-btn-size" />
          </button>
        </div>
      </div>
    </header>
  );
}
export default Header;
