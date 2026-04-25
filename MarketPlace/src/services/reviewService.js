import axiosClient from "../api/axiosClient";
export const reviewProduct = async (id, page = 1, limit = 10) => {
  const response = await axiosClient.get(`/reviews/${id}`, {
    params: { page, limit }
  });
  return response.data.data;
};
export const submitReview = async (productId, orderItemId, comment, rating)=>{
  console.log(productId, orderItemId, comment, rating);
  const response =await axiosClient.post(`/reviews`,{
    productId,
    orderItemId,
    comment,
    rating
  })
  return response.data
}
export const postReplyReview = async (reviewId, comment) => {
  const response = await axiosClient.post(`/reviews/${reviewId}/reply`, {
    comment
  }
  );
  return response.data;
}