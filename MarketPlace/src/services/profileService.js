import axiosClient from "../api/axiosClient";
export const getProfile = async () => {
  const response = await axiosClient.get(`/users/profile`);
  return response.data;
};
export const updateProfile = async (formdata) => {
  const response = await axiosClient.put(`/users/profile`, formdata);
  return response.data;
};
