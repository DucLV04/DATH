import React from "react";
import ProductItem from "../../OrderPage/InfoProduct/ProductItem";
import { formatPriceByCode } from "../../../utils/utils";
function ProductContainer(props) {
  const products = props.products;
  const orderStatus=props.orderStatus;
  return (
    <div className="d-flex flex-column gap-2">
      <span style={{ fontWeight: "500" }}>Sản phẩm</span>
      {products.length>0 ? products.map((product, index) => {
        return (
          <ProductItem
            key={index}
            idItem={product.order_item_id}
            nameProduct={product.name}
            quantity={product.quantity}
            onOpenFeedBack={props.onOpenFeedBack}
            onClose={props.onClose}
            price={formatPriceByCode(product.price_at_purchase,"VND")}
            img={product.image_url}
            showFeedback={orderStatus==="COMPLETED"}
          />
        );
      }): <span>Sản phẩm không còn tồn tại trên hệ thống</span>}
      {}
      <hr style={{ margin: "0" }} />
    </div>
  );
}
export default ProductContainer;
