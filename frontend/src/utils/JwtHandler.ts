import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router";
import { useAuthService } from "../services/AuthServices";
import { MAIN_URL } from "../api-config";

// Enable sending cookies with every request globally
axios.defaults.withCredentials = true;
// Function to create an axios instance with JWT handling logic
const jwtHandler = (): AxiosInstance => {
    const jwtAxios = axios.create({ baseURL: "http://127.0.0.1:8000" });
    const navigate = useNavigate();
    const { logout } = useAuthService();

    // Intercepting the response for token expiration or invalidation
    jwtAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const request = error.config;
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                try {
                    // Request a new access token using the refresh token
                    const response = await axios.post(
                        `${MAIN_URL}/token/refresh/`
                    );
                    if (response.status == 200) {
                        // restart the original request with a new token
                        return jwtAxios(request);
                    }
                } catch (refreshError) {
                    // if the update failed call logout
                    logout();
                    const goLogin = () => navigate("/login");
                    goLogin();
                    return Promise.reject(error);
                }
            }
        }
    );
    return jwtAxios;
};

export default jwtHandler;
