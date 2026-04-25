import React from "react";
import PriceProduct from "./PriceProduct";
import Hashtag from "../../../component/Hashtag";
import { extractWords } from "../../../utils/utils";
function InforProduct(props) {
  const productInfo = props.productInfo;
  return (
    <div className="info-product">
      <div className="name-seller">
        <span style={{ fontSize: "1.1rem" }}>{productInfo.name}</span>
        <span
          style={{ fontSize: "0.9rem", opacity: "0.5", marginTop: "0.3rem" }}
        >
          {extractWords(productInfo.description, 15)}
        </span>
      </div>
      <div className="hashtag-product">
        {productInfo.hashtags.map((hashtag, index) => <Hashtag hashtag={hashtag.tag} key={index} />)}
      </div>
      <PriceProduct idProduct={productInfo.id} price={productInfo.price} quantity={productInfo.stock} currencyCode={"VND"} showAddToCart={props.showAddToCart} />
    </div>
  );
}
export default InforProduct;
