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
            const response = await axios.get(
                `${MAIN_URL}/users/user-management/`,
                { withCredentials: true }
            );
            const userDetails = response.data;
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");

            return {
                username: userDetails.username,
                email: userDetails.email,
                profile_image: userDetails.profile_image || null,
            };
        } catch (err: any) {
            setIsAuthenticated(false);
            return Promise.reject(err);
        }
    };

    // Login function that send response to the backend and handles response
    const login = async (username: string, password: string) => {
        try {
            await axios.post(
                `${MAIN_URL}/token/`,
                { username, password },
                { withCredentials: true }
            );
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
            await axios.post(
                `${MAIN_URL}/sign-up/`,
                formData,
                { withCredentials: true }
            );

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

            return err.response.status;
        }
    };

    const editUser = async (formData: FormData) => {
        try {
            await axios.put(`${MAIN_URL}/users/user-management/`, formData, {
                withCredentials: true,
            });
            getUserDetails();
            setIsAuthenticated(true);
        } catch (err: any) {
            return err.response.status;
        }
    };

    return {
        login,
        isAuthenticated,
        logout,
        refreshAccessToken,
        signUp,
        editUser,
        getUserDetails
    };
}
