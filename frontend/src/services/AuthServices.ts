import axios from "axios";
import { AuthServicesProps } from "../@types/authService";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MAIN_URL } from "../api-config";

export function useAuthService(): AuthServicesProps {
    const navigate = useNavigate();
    const getAuthenticatedValue = () => {
        const authenticated = localStorage.getItem("isAuthenticated");
        return authenticated !== null && authenticated === "true";
    };

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        getAuthenticatedValue
    );

    const getUserDetails = async () => {
        try {
            const userId = localStorage.getItem("user_id");
            const response = await axios.get(
                `${MAIN_URL}/user/?user_id=${userId}`,
                { withCredentials: true }
            );
            const userDetails = response.data;
            localStorage.setItem("userDetails", JSON.stringify(userDetails));
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
        } catch (err: any) {
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");
            return err;
        }
    };

    // Login function that send response to the backend and handles response
    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(
                `${MAIN_URL}/token/`,
                { username, password },
                { withCredentials: true }
            );
            const user_id = response.data.user_id;
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("user_id", user_id);
            setIsAuthenticated(true);
            await getUserDetails();

            const redirectPath = sessionStorage.getItem("redirectPath");
            if (redirectPath) {
                sessionStorage.removeItem("redirectPath");
                navigate(redirectPath);
            } else {
                navigate("/");
            }
        } catch (err: any) {
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");
            return err.response.status;
        }
    };

    const refreshAccessToken = async () => {
        try {
            await axios.post(
                `${MAIN_URL}/token/refresh/`,
                {},
                { withCredentials: true }
            );
        } catch (refreshAccessError) {
            return Promise.reject(refreshAccessError);
        }
    };

    const logout = async () => {
        localStorage.clear();
        localStorage.setItem("isAuthenticated", "false");
        setIsAuthenticated(false);
        try {
            await axios.post(`${MAIN_URL}/logout/`);
        } catch (err: any) {
            return err;
        }
        navigate("/login");
    };

    const signUp = async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${MAIN_URL}/sign-up/`,
                formData,
                { withCredentials: true }
            );
            const user_id = response.data.user_id;
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("user_id", user_id);
            setIsAuthenticated(true);
            await getUserDetails();
            const redirectPath = sessionStorage.getItem("redirectPath");
            if (redirectPath) {
                sessionStorage.removeItem("redirectPath");
                navigate(redirectPath);
            } else {
                navigate("/");
            }
        } catch (err: any) {
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");
            return err.response.status;
        }
    };

    return { login, isAuthenticated, logout, refreshAccessToken, signUp };
}
