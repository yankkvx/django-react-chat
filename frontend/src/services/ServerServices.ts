import axios from "axios";
import { MAIN_URL } from "../api-config";
import { useCallback } from "react";

const useServerService = () => {
    const getServer = useCallback(async (serverId: number) => {
        try {
            const response = await axios.get(
                `${MAIN_URL}/servers/${serverId}/`
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

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

    const editServer = async (serverId: number, formData: FormData) => {
        try {
            const response = await axios.put(
                `${MAIN_URL}/servers/${serverId}/edit/`,
                formData,
                { withCredentials: true }
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

    const createChannel = async (formData: FormData) => {
        try {
            const response = await axios.post(
                `${MAIN_URL}/servers/channel/`,
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

    const deleteChannel = async (serverId: number) => {
        try {
            const response = await axios.delete(
                `${MAIN_URL}/servers/channel/${serverId}/delete/`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        getServer,
        createServer,
        editServer,
        getCategories,
        createCategory,
        createChannel,
        deleteChannel,
    };
};

export default useServerService;
