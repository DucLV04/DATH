import axiosClient from "../api/axiosClient";
export const getOrderHistory= async ()=>{
    const response =await axiosClient.get("/orders");
    return response.data.data;
}
export const placeOrder=async (infoOrder,selectedItems=[]) =>{
    const response=await axiosClient.post("/orders",{
        phone: infoOrder.phone || "",
        address: infoOrder.address || "",
        paymentMethod: infoOrder.paymentMethod || "COD",
        note: infoOrder.note || "",
        selectedItems
    })
    return response.data;
}