import React, { useEffect, useState } from "react";
import Header from "../../component/Header";
import CartHeader from "./CartHeader/CartHeader";
import CartContainer from "./CartContainer/CartContainer";
import FooterCart from "./FooterCart/FooterCart";
import { getCartItems } from "../../services/cartService";
import { getInfoCheckout } from "../../utils/utils";
import { useLocation } from "react-router-dom";
function CartPage(props) {
  const location=useLocation();
  const {idFromProductPage}=location.state || []
  const [items, setList] = useState([]);
  const [listSelected, setListSelected] = useState(idFromProductPage || []);
  const [checkAll, setAll] = useState(false);
  function handleSelect(id, checked) {
    if (checked) {
      setListSelected((prev) => [...prev, id]);
    } else {
      setListSelected((prev) => prev.filter((item) => item != id));
    }
  }
   function handleCheckAll(checked) {
    if (checked) {
      setAll(true);
      setListSelected(items.map(item=>item.product_id));
    } else {
       setAll(false);
      setListSelected([]);
    }
  }
 
  return (
    <div>
      <div
        className="container px-5 py-3 d-flex flex-column gap-4"
        style={{ width: "1000px" }}
      >
        <CartHeader />
        <CartContainer onGetItem={setList} onSelect={handleSelect} listSelected={listSelected}/>
      </div>
      <div class="footer-spacer"></div>
      <FooterCart
        items={items}
        listSelected={listSelected}
        infoCheckout={getInfoCheckout(items, listSelected)}
        onCheckAll={handleCheckAll}
        checkAll={checkAll}
      />
    </div>
  );
}
export default CartPage;
