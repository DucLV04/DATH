import React, { useEffect, useState } from "react";
import { formatTime } from "../../../utils/utils";
import { getMyProduct } from "../../../services/productService";
import { getFollowersCount, getFollowingCount } from "../../../services/followService";
function AboutMe(props) {
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
    <div className="about-me">
      <span style={{ fontWeight: "500" }}>Thông tin cửa hàng</span>
      <div className="d-flex flex-column gap-2">
        <span style={{ fontWeight: "500", fontSize: "15px" }}>
          Cam kết với hệ thống
        </span>
        <span style={{ opacity: "0.7", fontSize: "15px" }}>
          Sản phẩm được đăng bán phải đảm bảo chất lượng, đúng với mô tả, có
          nguồn gốc hợp pháp và tuân thủ các quy định của pháp luật hiện hành.
        </span>
      </div>
      <hr style={{ margin: "0px", opacity: "0.2" }} />
      <div className="row" style={{ fontSize: "15px" }}>
        <div className="d-flex flex-column col-6 gap-2">
          <span style={{ fontWeight: "500" }}>Thống kê</span>
          <div
            className="d-flex justify-content-between"
            style={{ fontSize: "14px" }}
          >
            <span>Tổng sản phẩm:</span>
            <span>{listProduct.length}</span>
          </div>
          <div
            className="d-flex justify-content-between"
            style={{ fontSize: "14px" }}
          >
            <span>Người theo dõi:</span>
            <span>{follower}</span>
          </div>
          <div
            className="d-flex justify-content-between"
            style={{ fontSize: "14px" }}
          >
            <span style={{ paddingTop: "5px" }}>Đang theo dõi </span>
            <span>
              {following}
            </span>
          </div>
        </div>
        <div className="d-flex flex-column col-6 gap-2">
          <span style={{ fontWeight: "500" }}>Chính sách</span>
          <ul style={{ opacity: "0.7", fontSize: "14px", padding: "0px 20px" }}>
            <li style={{ paddingTop: "4px", paddingBottom: "4px" }}>
              Bảo hành 12 tháng
            </li>
            <li style={{ paddingTop: "4px", paddingBottom: "4px" }}>
              Đổi trả trong 7 ngày
            </li>
            <li style={{ paddingTop: "4px", paddingBottom: "4px" }}>
              Giao hàng toàn quốc
            </li>
            <li style={{ paddingTop: "4px", paddingBottom: "4px" }}>
              Hỗ trợ trả góp 0%
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default AboutMe;
