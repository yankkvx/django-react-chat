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

    const deleteServer = async (serverId: number) => {
        try {
            const response = await axios.delete(
                `${MAIN_URL}/servers/${serverId}/delete/`,
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

    const removeUserFromMembers = async (
        serverId: number,
        userIdToRemove: number
    ) => {
        try {
            const response = await axios.delete(
                `${MAIN_URL}/servers/${serverId}/user/${userIdToRemove}/`,
                { withCredentials: true }
            );
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    const getPublicProfile = useCallback(
        async (userId: number): Promise<any> => {
            try {
                const response = await axios.get(
                    `${MAIN_URL}/users/${userId}/`,
                    {
                        withCredentials: true,
                    }
                );
                return response;
            } catch (err: any) {
                return err.response.status;
            }
        },
        []
    );

    return {
        getServer,
        createServer,
        editServer,
        deleteServer,
        getCategories,
        createCategory,
        createChannel,
        deleteChannel,
        removeUserFromMembers,
        getPublicProfile,
    };
};

export default useServerService;
