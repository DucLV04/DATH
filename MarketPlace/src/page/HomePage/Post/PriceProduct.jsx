import React, { useState } from "react";
import { Eye, ShoppingCart } from "lucide-react";
import { formatPriceByCode } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { addItemToCart } from "../../../services/cartService";
function PriceProduct(props) {
  const navigate = useNavigate();
  const price = props.price;
  const currencyCode = props.currencyCode;
  const quantity = props.quantity;
  const [isAdded, setIsAdded] = useState(false);
  async function handleCart(e) {
    e.stopPropagation(); // Stop propagation to prevent navigation if wrapped in link
    try {
      const data = await addItemToCart(props.idProduct, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
    catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="price-product" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Price Row */}
      <div className="name-seller" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", width: "100%" }}>
        <span style={{ fontSize: "1.2rem", color: "#ff6a00", fontWeight: "700" }}>
          {formatPriceByCode(price, currencyCode)}
        </span>
        <span
          style={{ fontSize: "0.8rem", opacity: "0.6", whiteSpace: "nowrap" }}
        >
          Kho: {quantity}
        </span>
      </div>

      {/* Action Row - Full Width Buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          width: "100%",
          marginTop: "4px"
        }}
      >
        <button
          type="button"
          className="btn btn-outline-secondary btn-custom btn-sm"
          style={{
            flex: 1,
            color: "black",
            borderRadius: "0.5rem",
            fontSize: "0.9rem", // Slightly smaller
            display: "flex",
            padding: "6px 4px",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            whiteSpace: "nowrap"
          }}
          onClick={() => {
            navigate("/detail", {
              state: {
                id: props.idProduct,
              },
            });
          }}
        >
          <Eye size={16} /> {/* Smaller icon */}
          Chi tiết
        </button>

        {props.showAddToCart && (
          <div className="btn-create"
            style={{
              flex: 1,
              backgroundColor: isAdded ? "#28a745" : "",
              color: isAdded ? "white" : "",
              borderColor: isAdded ? "#28a745" : "",
              fontSize: "0.9rem",
              padding: "6px 4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onClick={handleCart}>
            <span style={{ fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
              {isAdded ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                  </svg>
                  Đã thêm
                </>
              ) : (
                <>
                  <ShoppingCart
                    color="white"
                    size={16}
                  />
                  Thêm
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default PriceProduct;
