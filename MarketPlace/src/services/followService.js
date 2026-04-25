import axiosClient from "../api/axiosClient";
export const followUser = async (userId)=>{
    const response = await axiosClient.post(`/follow/${userId}/follow`);
    return response.data;
}
export const checkFollowing = async (userId)=>{
    const response = await axiosClient.get(`/follow/${userId}/check-follow`);
    return response.data;
} 
export const unfollowUser=async (userId)=>{
    const response = await axiosClient.delete(`/follow/${userId}/unfollow`);
    return response.data;
}
export const getFollowingList=async ()=>{
    const response = await axiosClient.get(`/follow/me/following`);
    return response.data;
}
export const getFollowingCount=async ()=>{
    const response = await axiosClient.get(`/follow/me/following-count`);
    return response.data;
}
export const getFollowersCount = async (userId)=>{
    const response = await axiosClient.get(`/follow/${userId}/followers-count`);
    return response.data;
}