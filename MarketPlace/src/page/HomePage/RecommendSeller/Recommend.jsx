import React, { useEffect } from "react";
import { useState } from "react";
import { getFollowersCount, followUser, unfollowUser } from "../../../services/followService";
import { API_BASE } from "../../../api/axiosClient";
function Recommend(props) {
  const [follow,setFollowed] =useState(true);
  const avatar=props.avatar ?? "";
  const name=props.name;
  const id=props.id;
  const [loading,setLoading]= useState(true);
  const [followers,setFollowers]=useState(0);
  async function getFollowersNumber(id) {
      try{
        const data=await getFollowersCount(id);
        setFollowers(data.follower_count);
      }
      catch(err){
        console.log(err);
      }
      finally{
        setLoading(false);
      }
  }
  async function handleFollow(){
      if (!follow){
        try{
          await followUser(id);
        }
        catch(err){
          console.log(err);
        }
      }
      else{
        try{
          await unfollowUser(id);
        }
        catch(err){
          console.log(err);
        }
      }
      setFollowed(!follow);
    }
  useEffect(()=>{
    getFollowersNumber(id);
  },[]);
  if (loading) return <div>Loading...</div>
  return (
    <div className="recommend">
      <div className="avt-container">
        <span className="avt-mini">
          {avatar ==="" ? (
            name[0]
          ) : (
            <img src={`${API_BASE}${avatar}`} alt="avatar" />
          )}
        </span>
      </div>
      <div className="info-recommend">
        <span style={{ fontSize: "1rem" }}>{name}</span>
        <span style={{ fontSize: "0.8rem", opacity: "0.5" }}>
          {followers>1000 ?   `${(followers / 1000).toFixed(1)}K người theo dõi` : `${followers} người theo dõi`}
        
        </span>
      </div>
      <button
        type="button"
        className=" btn-sm btn-follow"
        onClick={handleFollow}
      >
        {follow? "Bỏ theo dõi" : "Theo dõi"}
      </button>
    </div>
  );
}
export default Recommend;
