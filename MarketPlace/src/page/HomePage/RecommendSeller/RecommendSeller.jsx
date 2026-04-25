import React,{useEffect, useState} from "react";
import Recommend from "./Recommend";
import { getFollowingList } from "../../../services/followService";
function RecommendSeller(props) {
  const [listSeller, setList]=useState([]);
  const [loading,setLoading]=useState(true);
  async function getSellerList() {
    try{
      const data=await getFollowingList();
      setList(data.following);
    }
    catch(err){
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
    getSellerList()
  },[]);
  if (loading) return <div>Loading...</div>
 return <div className="filter-container">
    <span className="title-filter" style={{marginBottom:"20px",fontWeight:"500"}}>Người bán đang theo dõi</span>
     {listSeller.length>0 ? (listSeller.map((seller,index)=><Recommend key={index} avatar={seller.avatar_url} name={seller.username} id={seller.id} />)) : <div style={{fontSize:"15px",opacity:"0.6"}}>Hãy theo dõi những người bán hàng để có những đề xuất tốt hơn</div>}
 </div>
}

export default RecommendSeller; 