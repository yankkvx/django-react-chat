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
            const accessToken = localStorage.getItem("access_token");
            if (!userId || !accessToken) {
                console.error("user_id or access_token is not in localStorage");
                return;
            }
            const response = await axios.get(
                `http://127.0.0.1:8000/api/user/?user_id=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
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

    const getUserIdToken = (access: string) => {
        const tokenParts = access.split(".");
        const encodedPayload = tokenParts[1];
        const decodedPayload = atob(encodedPayload);
        const payloadData = JSON.parse(decodedPayload);
        return payloadData.user_id;
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                { username, password }
            );

            const { access, refresh } = response.data;

            if (!access || !refresh) {
                throw new Error("Failed to receive tokens");
            }

            // Save tokens to the local storage
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            const userId = getUserIdToken(access);
            if (userId) {
                localStorage.setItem("user_id", userId);
                localStorage.setItem("isAuthenticated", "true");
                setIsAuthenticated(true);
                await getUserDetails();
            }
        } catch (err: any) {
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");
            return err;
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("userDetails");
        localStorage.removeItem("user_id");
        localStorage.setItem("isAuthenticated", "false");
        setIsAuthenticated(false);
    };

    return { login, isAuthenticated, logout };
}
