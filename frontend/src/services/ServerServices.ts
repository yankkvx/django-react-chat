import axios from "axios";
import { MAIN_URL } from "../api-config";
import { useCallback } from "react";

const useServerService = () => {
    const createServer = async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${MAIN_URL}/servers/management/`,
                formData,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const getCategories = useCallback(async () => {
        try {
            const response = await axios.get(`${MAIN_URL}/servers/category/`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    const createCategory = async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${MAIN_URL}/servers/category/`,
                formData,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { createServer, getCategories, createCategory };
};

export default useServerService;
