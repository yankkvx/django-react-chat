import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router";

const jwtHandler = (): AxiosInstance => {
    const navigate = useNavigate();
    const jwtAxios = axios.create({ baseURL: "http://127.0.0.1:8000" });

    jwtAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const request = error.config;
            if (error.response?.status === 403) {
                navigate("/login");
            }
            return Promise.reject(error);
        }
    );
    return jwtAxios;
};

export default jwtHandler;
