import React, { useEffect, useState } from "react";
import { formatTime } from "../../../utils/utils";
import { getMyProduct } from "../../../services/productService";
import { getFollowersCount, getFollowingCount } from "../../../services/followService";
function FollowAndRating(props) {
  const user = props.user;
  const [listProduct, setList] = useState([]);
  const [follower,setFollower]=useState(0);
  const [following,setFollowing]=useState(0);
  async function getListProduct() {
    try {
      const data = await getMyProduct(1,Number.MAX_SAFE_INTEGER);
      setList(data);
    } catch (err) {
      console.error(err);
    }
  }
  async function getFollower() {
    try{
      const data= await getFollowersCount(user.id);
      setFollower(data.follower_count);
    }
    catch (err){
      console.error(err);
    }
  }
  async function getFollowing() {
    try{
      const data= await getFollowingCount();
      setFollowing(data.following_count);
    }
    catch (err){
      console.error(err);
    }
  }
  useEffect(()=>{
    getListProduct();
    getFollower();
    getFollowing();
  },[])
  return (
    <div className="d-flex flex-column px-2 align-items-center">
      <div className="row  text-center" style={{ marginTop: "10px" }}>
        <div className="col-4 d-flex flex-column">
          <span style={{ fontWeight: "500" }}>{listProduct.length}</span>
          <span
            style={{ opacity: "0.7", fontSize: "13px", textAlign: "center" }}
          >
            Sản phẩm
          </span>
        </div>
        <div className="col-4 d-flex flex-column">
          <span style={{ fontWeight: "500" }}>{follower}</span>
          <span
            style={{ opacity: "0.7", fontSize: "13px", textAlign: "center" }}
          >
            Người theo dõi
          </span>
        </div>
        <div className="col-4 d-flex flex-column">
          <span style={{ fontWeight: "500" }}>{following}</span>
          <span
            style={{ opacity: "0.7", fontSize: "13px", textAlign: "center" }}
          >
            Đang theo dõi
          </span>
        </div>
      </div>
    </div>
  );
}
export default FollowAndRating;
