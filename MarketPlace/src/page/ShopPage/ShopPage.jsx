import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../services/productService";
import ShopProductCard from "./ShopProductCard";
import { API_BASE } from "../../api/axiosClient";

function ShopPage() {
    const { id } = useParams(); // Start with id from URL
    const [products, setProducts] = useState([]);
    const [sellerInfo, setSellerInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchShopProducts = async () => {
            try {
                setLoading(true);
                console.log('ShopPage: Fetching products for seller_id:', id);
                const data = await getProduct({
                    seller_id: parseInt(id), // Convert to number
                    limit: 50
                });
                console.log('ShopPage: Received products:', data);
                setProducts(data);
                if (data.length > 0) {
                    const first = data[0];
                    setSellerInfo({
                        name: first.seller_name,
                        avatar: first.seller_avatar,
                        rating: first.seller_average_rating,
                        followers: first.seller_followers_count
                    });
                } else {
                    console.warn('ShopPage: No products found for seller_id:', id);
                }
            } catch (err) {
                console.error('ShopPage: Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchShopProducts();
    }, [id]);

    // Premium UI Design
    return (
        <div className="shop-page-container" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", paddingBottom: "50px" }}>
            {/* Hero Banner with Gradient */}
            <div style={{
                height: "200px",
                background: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
                position: "relative",
                marginBottom: "60px"
            }}>
            </div>

            <div className="container">
                {/* Seller Info Card - Floating Effect */}
                <div className="card border-0 shadow-lg" style={{
                    marginTop: "-100px",
                    borderRadius: "15px",
                    overflow: "hidden",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    marginBottom: "30px"
                }}>
                    <div className="card-body p-4 d-flex align-items-center gap-4 flex-wrap">
                        <div className="avt-wrapper" style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            border: "4px solid white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            flexShrink: 0
                        }}>
                            {sellerInfo?.avatar ? (
                                <img src={`${API_BASE}${sellerInfo.avatar}`} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: "100%", height: "100%", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: "bold", color: "#888" }}>
                                    {sellerInfo?.name?.[0]?.toUpperCase() || "S"}
                                </div>
                            )}
                        </div>

                        <div className="seller-details flex-grow-1">
                            <h2 style={{ fontWeight: "700", marginBottom: "10px", color: "#333" }}>{sellerInfo?.name || "Loading Config..."}</h2>

                            <div className="d-flex gap-4 text-secondary">
                                <div className="d-flex align-items-center gap-2">
                                    <span style={{ fontSize: "1.2rem" }}>⭐</span>
                                    <div>
                                        <div style={{ fontWeight: "bold", color: "#333" }}>{sellerInfo?.rating || 0}</div>
                                        <div style={{ fontSize: "0.85rem" }}>Đánh giá</div>
                                    </div>
                                </div>
                                <div className="border-end mx-2"></div>
                                <div className="d-flex align-items-center gap-2">
                                    <span style={{ fontSize: "1.2rem" }}>👥</span>
                                    <div>
                                        <div style={{ fontWeight: "bold", color: "#333" }}>{sellerInfo?.followers || 0}</div>
                                        <div style={{ fontSize: "0.85rem" }}>Người theo dõi</div>
                                    </div>
                                </div>
                                <div className="border-end mx-2"></div>
                                <div className="d-flex align-items-center gap-2">
                                    <span style={{ fontSize: "1.2rem" }}>📦</span>
                                    <div>
                                        <div style={{ fontWeight: "bold", color: "#333" }}>{products.length}</div>
                                        <div style={{ fontSize: "0.85rem" }}>Sản phẩm</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <h4 style={{ fontWeight: "600", marginBottom: "20px", color: "#444" }}>Danh sách sản phẩm</h4>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={product.id}>
                                    <ShopProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <div style={{ opacity: 0.5, fontSize: "4rem", marginBottom: "20px" }}>📦</div>
                                <h5 className="text-muted">Cửa hàng chưa có sản phẩm nào.</h5>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShopPage;
