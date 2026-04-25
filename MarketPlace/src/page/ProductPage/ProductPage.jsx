import React, { useEffect, useState } from "react";
import Header from "../../component/Header";
import BreadcrumnNavigation from "./BreadcrumbNavigation/BreadcrumbNavigation";
import ProductDetail from "./ProductDetail/ProductDetail";
import Feedback from "./Feedback/Feedback";
import { useLocation } from "react-router-dom";
import { getProductById } from "../../services/productService";
function ProductPage() {
  const { state } = useLocation();
  const id = state.id;
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  async function getProduct(id) {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getProduct(id);
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <div className="container py-3 px-5">
        <div className="cotainer-product-page">
          <BreadcrumnNavigation title={product.name} />
          <ProductDetail product={product} />
          <Feedback id={id} />
        </div>
      </div>
    </div>
  );
}
export default ProductPage;
