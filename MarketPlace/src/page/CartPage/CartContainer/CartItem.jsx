import React from "react";
import myPicture from "../../../img/iphone.webp";
import { Minus, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateItemQuantity, removeItem } from "../../../services/cartService";
import { getProductImageById, getProductById } from "../../../services/productService";
import { API_BASE } from "../../../api/axiosClient";
import { formatPriceByCode } from "../../../utils/utils";
function CartItem(props) {
  const item = props.item;
  const listSelected=props.listSelected;
  const id = item.product_id;
  const name = item.name;
  const price = Number(item.price);
  const navigate = useNavigate();
  const [count, setCount] = useState(item.quantity);
  const [total, setTotal] = useState(item.subtotal);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  function handleCheck(e){
    const isChecked=e.target.checked;
    props.onSelect(id,isChecked);
    setChecked(isChecked);
  }
  async function handleCount(action) {
    if (action === "plus") {
      const product = await getProductById(id);
      const quantityInStock = product.stock;
      if (count + 1 > quantityInStock) {
        return;
      }
      setCount(count + 1);
      setTotal(price * (count + 1));
    } else if (action === "minus" && count - 1 >= 1) {
      setCount(count - 1);
      setTotal(price * (count - 1));
    }
  }
  useEffect(() => {
    props.onUpdate(item.product_id, count);
  }, [count]);
  async function getImgProduct(id) {
    try {
      const data = await getProductImageById(id);
      data.length > 0 && setImage(data[0].image_url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getImgProduct(item.product_id);
  }, []);
  useEffect(()=>{
    setChecked(listSelected.includes(id));
  },[listSelected])
  if (loading) return <div>Loading...</div>;
  return (
    <div className="cart-bar" style={{ padding: "20px 20px", gap: "7px" }}>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value={id}
          checked={checked}
          id={`check-${id}`}
          onChange={handleCheck}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0",
          width: "40%",
          height: "auto",
          marginRight: "80px",
        }}
      >
        <div className="mini-img">
          <img src={`${API_BASE}${image}`} />
        </div>
        <div
          style={{
            textAlign: "left",
            alignSelf: "flex-start",
            fontSize: "15px",
            width: "100%",
          }}
        >
          <span>{name}</span>
        </div>
      </div>
      <div
        className="d-flex "
        style={{
          marginLeft: "auto",
          gap: "0px",
          alignItems: "center",
          textAlign: "center",
          fontSize: "15px",
          width: "60%",
          fontWeight: "500",
        }}
      >
        <span style={{ width: "25%", color: "#ff6a00" }}>
          {formatPriceByCode(price, "VND")}
        </span>
        <div style={{ width: "25%" }}>
          <div className="product-count">
            <button
              type="button"
              className="btn btn-outline-secondary btn-custom btn-sm ms-3 "
              style={{ color: "black", marginRight: "5px" }}
              onClick={() => {
                if (count > 1) handleCount("minus");
              }}
            >
              <Minus size={10} />
            </button>
            <div
              className="number"
              style={{ margin: "0px", padding: "4px 10px" }}
            >
              {count}
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-custom btn-sm "
              style={{ color: "black", marginLeft: "5px" }}
              onClick={() => handleCount("plus")}
            >
              <Plus size={10} />
            </button>
          </div>
        </div>
        <span style={{ width: "25%", color: "#ff6a00" }}>
          {formatPriceByCode(total, "VND")}
        </span>
        <div
          className="btn-create"
          onClick={() => {
            navigate("/order", {
              state: {
                listItem: [item],
              },
            });
          }}
        >
          <span style={{ fontWeight: "500" }}>Mua ngay</span>
        </div>
        <div
          style={{
            top: "5px",
            right: "10px",
            zIndex: "10",
            position: "absolute",
            cursor: "pointer",
          }}
          onClick={()=>{
            props.onRemove(item.product_id)
          }}
        >
          <X size={15} />
        </div>
      </div>
    </div>
  );
}
export default CartItem;
