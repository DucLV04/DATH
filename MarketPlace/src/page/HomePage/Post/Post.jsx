import React from "react";
import HeaderPost from "./HeaderPost";
import StarRating from "../../../component/StarRating";
import { useNavigate } from "react-router-dom";
import myPicture from "../../../img/iphone.webp";
import InforProduct from "./InforProduct";
import { API_BASE } from "../../../api/axiosClient";
function Post(props) {

  const navigate = useNavigate();
  const product = props.productInfo;
  const headerInfo = {
    author: {
      name: product.seller_name,
      avatar: product.seller_avatar || "",
      id: product.seller_id,
    },
    createAt: product.created_at || "",
    updateAt: product.updated_at || "",
  }
  return (
    <div className="post-container" >
      <HeaderPost idProduct={product.id} headerInfo={headerInfo} showAction={props.showAction} openNotifi={props.openNotifi || null} />
      <img src={`${API_BASE}${product.first_image}`} onClick={() => {
        navigate("/detail", {
          state: {
            id: product.id
          }
        })
      }} />
      <div style={{ padding: "0 10px", marginTop: "5px" }}>
        <StarRating rating={product.average_rating || 0} size={14} />
      </div>
      <InforProduct productInfo={product} showAddToCart={props.showAddToCart} />
    </div>
  );
}
export default Post;
