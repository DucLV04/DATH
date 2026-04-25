import React, { useEffect } from "react";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { followUser, checkFollowing, unfollowUser } from "../../../services/followService";
import { API_BASE } from "../../../api/axiosClient";
function SellerCard(props) {
  const navigate = useNavigate();
  const infoSeller = props.infoSeller;
  const [follow, setFollowed] = useState(false);
  const [loading, setLoading] = useState(true);
  async function checkFollow(id) {
    try {
      const data = await checkFollowing(id);
      setFollowed(data.is_following);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  }
  async function handleFollow() {
    if (!follow) {
      try {
        await followUser(infoSeller.id);
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      try {
        await unfollowUser(infoSeller.id);
      }
      catch (err) {
        console.log(err);
      }
    }
    setFollowed(!follow);
  }
  useEffect(() => {
    checkFollow(infoSeller.id);
  }, [])
  if (loading) return <div>Loading....</div>
  return (
    <div className="product-card">
      <span style={{ fontWeight: "500", marginBottom: "20px" }}>
        Thông tin người bán
      </span>
      <div className="recommend" style={{ alignItems: "start" }}>
        <div className="avt-container">
          <span className="avt-mini">
            {infoSeller.avatar === "" ? (
              infoSeller.name[0]
            ) : (
              <img src={`${API_BASE}${infoSeller.avatar}`} alt="avatar" />
            )}
          </span>
        </div>
        <div className="info-recommend" style={{ width: "100%" }}>
          <span style={{ fontSize: "1.1rem" }}>{infoSeller.name}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            ⭐
            <span style={{ opacity: "0.5", fontSize: "15px" }}>
              {`${Number(infoSeller.ratingAvg).toFixed(1)} `}
            </span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            👥
            <span style={{ opacity: "0.5", fontSize: "15px" }}>
              {`${Intl.NumberFormat("vi-VN").format(infoSeller.follower)} người theo dõi`}
            </span>
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "5px", margin: "10px 0" }}>
        <div className="btn-add-cart" onClick={handleFollow}>
          <span style={{ fontWeight: "500" }}>{follow ? "Đang theo dõi" : "Theo dõi"}</span>
        </div>
        <div className="btn-add-cart">
          <span
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              fontWeight: "500",
            }}
          >
            <MessageCircle size={15} />
            Nhắn tin
          </span>
        </div>
      </div>
      <div className="btn-add-cart" onClick={() => {
        navigate(`/shop/${infoSeller.id}`);
      }}>
        <span style={{ fontWeight: "500" }}>
          Xem cửa hàng
        </span>
      </div>
    </div>
  );
}
export default SellerCard;
