import axiosClient from "../api/axiosClient";
export const getNotification= async ()=>{
    const response=await axiosClient.get(`/notifications`);
    return response.data.data;
}
export const markAllAsRead= async ()=>{
    const response=await axiosClient.put(`/notifications/read-all`);
    return response.data;
}
export const markAsRead= async (id)=>{
    const response=await axiosClient.put(`/notifications/${id}/read`);
    return response.data;
}