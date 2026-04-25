import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";
import StarRating from "../../component/StarRating";
import { API_BASE } from "../../api/axiosClient";
import { addItemToCart } from "../../services/cartService";
import { formatPriceByCode } from "../../utils/utils";

function ShopProductCard({ product }) {
    const navigate = useNavigate();
    const [isAdded, setIsAdded] = useState(false);

    async function handleCart(e) {
        e.stopPropagation();
        try {
            await addItemToCart(product.id, 1);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 1500);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div
            className="product-card-container"
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #f0f0f0"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
            }}
            onClick={() => {
                navigate("/detail", {
                    state: { id: product.id }
                });
            }}
        >
            {/* Product Image */}
            <div style={{ position: "relative", paddingTop: "100%", overflow: "hidden" }}>
                <img
                    src={`${API_BASE}${product.first_image}`}
                    alt={product.name}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s"
                    }}
                />
            </div>

            {/* Content */}
            <div style={{ padding: "12px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                    {/* Title */}
                    <h6 style={{
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        color: "#333",
                        margin: "0 0 6px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "1.4",
                        minHeight: "2.8em" // Reserve space for 2 lines
                    }}>
                        {product.name}
                    </h6>

                    {/* Rating */}
                    <div style={{ marginBottom: "8px" }}>
                        <StarRating rating={product.average_rating || 0} size={12} />
                    </div>
                </div>

                {/* Price & Action Section - Custom Layout for ShopPage */}
                <div style={{ marginTop: "auto" }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.1rem", color: "#ff6a00", fontWeight: "700" }}>
                            {formatPriceByCode(product.price, "VND")}
                        </span>
                        <span style={{ fontSize: "0.8rem", opacity: "0.6" }}>
                            Kho: {product.stock}
                        </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", padding: "6px 0", fontSize: "0.85rem" }}
                        >
                            <Eye size={14} /> Chi tiết
                        </button>
                        <button
                            className="btn btn-sm"
                            style={{
                                flex: 1,
                                backgroundColor: isAdded ? "#28a745" : "#ff6a00",
                                color: "white",
                                border: "none",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                                padding: "6px 0",
                                fontSize: "0.85rem"
                            }}
                            onClick={handleCart}
                        >
                            {isAdded ? <><span style={{ fontSize: "14px" }}>✓</span> Đã thêm</> : <><ShoppingCart size={14} /> Thêm</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopProductCard;
