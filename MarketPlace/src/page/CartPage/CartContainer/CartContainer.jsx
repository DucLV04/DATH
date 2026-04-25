import React, { useState, useEffect } from "react";
import CartBar from "./CartBar";
import CartItem from "./CartItem";
import {
  getCartItems,
  updateItemQuantity,
  removeItem,
} from "../../../services/cartService";
function CartContainer(props) {
  const [items, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const listSelected=props.listSelected;
  async function getCart() {
    try {
      const data = await getCartItems();
      setList(data.items);
      props.onGetItem(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function handleItemQuantity(id, quantity) {
    try {
      await updateItemQuantity(id, quantity);
      getCart();
    } catch (err) {
      console.error(err);
    }
  }
  async function handleRemoveItem(id) {
    try {
      await removeItem(id);
      getCart();
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    getCart();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div
      className="d-flex flex-column gap-3"
      style={{
        border: "1px solid rgba(11, 18, 32, 0.1)",
        borderRadius: "0.7rem",
      }}
    >
      <CartBar />
      {items.map((item, index) => {
        if (index !== items.length - 1) {
          return (
            <div key={index}>
              <CartItem
                item={item}
                listSelected={listSelected}
                onSelect={props.onSelect}
                onUpdate={handleItemQuantity}
                onRemove={handleRemoveItem}
              />
              <hr
                style={{
                  margin: "5px",
                  width: "95%",
                  alignSelf: "center",
                  opacity: "0.1",
                  marginLeft: "20px",
                }}
              />
            </div>
          );
        } else {
          return (
            <CartItem
              item={item}
              key={index}
              listSelected={listSelected}
              onSelect={props.onSelect}
              onUpdate={handleItemQuantity}
              onRemove={handleRemoveItem}
            />
          );
        }
      })}
    </div>
  );
}
export default CartContainer;
