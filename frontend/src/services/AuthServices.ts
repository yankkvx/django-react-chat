import axios from "axios";
import { AuthServicesProps } from "../@types/authService";
import { useState } from "react";

export function useAuthService(): AuthServicesProps {
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
                `http://127.0.0.1:8000/api/user/?user_id=${userId}`,
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
                "http://127.0.0.1:8000/api/token/",
                { username, password },
                { withCredentials: true }
            );
            const user_id = response.data.user_id;
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("user_id", user_id);
            setIsAuthenticated(true);
            await getUserDetails();
        } catch (err: any) {
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");
            return err;
        }
    };

    const logout = () => {
        localStorage.clear();
        localStorage.setItem("isAuthenticated", "false");
        setIsAuthenticated(false);
    };

    return { login, isAuthenticated, logout };
}
