import axiosClient from "../api/axiosClient";
export const register = async (username, email, password) => {
    const response = await axiosClient.post("/auth/register", {
        username,
        email,
        password
    })
    return response.data;
}
export const login = async (email, password) => {
    const response = await axiosClient.post("/auth/login", {
        email,
        password
    })
    return response.data;
}
export const logout = async () => {
    const response = await axiosClient.post("/auth/logout")
    return response.data;
}
export const requestPasswordReset = async (email) => {
    const response = await axiosClient.post("/auth/forgot-password", {
        email
    })
    return response.data;
}
export const resetPassword = async (token, password) => {
    const response = await axiosClient.post("/auth/reset-password", {
        password,
        token,
    })
    return response.data;
}
export const verifyEmail = async (token) => {
    const response = await axiosClient.get(`/auth/verify?token=${token}`);
    return response.data;
}
export const resendVerificationEmail = async (email) => {
    const response = await axiosClient.post("/auth/resend-verification", { email });
    return response.data;
}