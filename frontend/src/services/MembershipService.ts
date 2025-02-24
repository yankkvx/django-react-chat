import { useCallback, useState } from "react";
import jwtHandler from "../utils/JwtHandler";
import { MAIN_URL } from "../api-config";
import { Server } from "../@types/server";

interface UseServer {
    joinServer: (serverId: number) => Promise<void>;
    leaveServer: (serverId: number) => Promise<void>;
    isMember: (serverId: number) => Promise<boolean>;
    isUserMember: boolean;
    error: Error | null;
    isLoading: boolean;
    getUserServers: () => Promise<Server[]>;
    deleteUserServer: (serveId: number) => Promise<void>;
}

const useMembershipService = (): UseServer => {
    const jwtAxios = jwtHandler();
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [isUserMember, setUserMember] = useState(false);

    const joinServer = async (serverId: number): Promise<void> => {
        setLoading(true);
        try {
            await jwtAxios.post(
                `${MAIN_URL}/server/${serverId}/membership/`,
                {},
                { withCredentials: true }
            );
            setLoading(false);
            setUserMember(true);
        } catch (error: any) {
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    const leaveServer = async (serverId: number): Promise<void> => {
        setLoading(true);
        try {
            await jwtAxios.delete(
                `${MAIN_URL}/server/${serverId}/membership/remove_member/`,
                { withCredentials: true }
            );
            setLoading(false);
            setUserMember(false);
        } catch (error: any) {
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    const isMember = async (serverId: number): Promise<any> => {
        setLoading(true);
        try {
            const response = await jwtAxios.get(
                `${MAIN_URL}/server/${serverId}/membership/is_member/`,
                { withCredentials: true }
            );
            setLoading(false);
            setUserMember(response.data.is_member);
        } catch (error: any) {
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    const getUserServers = useCallback(async (): Promise<Server[]> => {
        try {
            const response = await jwtAxios.get(`${MAIN_URL}/servers/user/`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }, []);

    const deleteUserServer = async (serveId: number): Promise<any> => {
        try {
            const response = await jwtAxios.delete(
                `${MAIN_URL}/servers/${serveId}/delete/`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        joinServer,
        leaveServer,
        isMember,
        isUserMember,
        error,
        isLoading,
        getUserServers,
        deleteUserServer,
    };
};

export default useMembershipService;
