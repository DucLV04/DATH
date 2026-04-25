import React from "react";
import ProductCard from "./ProductCard";
import SellerCard from "./SellerCard";
import DescriptionProduct from "./DescriptionProduct";
import ImageProduct from "./ImageProduct";
import Feedback from "../Feedback/Feedback";
function ProductDetail(props) {
  const product=props.product;
  const infoSeller={
    id: product.seller_id,
    name: product.seller_name,
    avatar: product.seller_avatar || "",
    ratingAvg: product.seller_average_rating,
    follower: product.seller_followers_count
  }
  const hashtags=product.hashtags;
  return (
    <div className="row mt-3 ">
      <div className="col-8 gap-4 d-flex flex-column">
        <ImageProduct images={product.images}/>
        <DescriptionProduct content={product.description} hashtags={hashtags} />
      </div>
      <div className="col-4 ">
        <div className="position-sticky" style={{ top: "80px" }}>
          <div className="d-flex flex-column gap-4">
            <ProductCard product={product} currencyCode={"VND"}/>
            <SellerCard infoSeller={infoSeller}/>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetail;
