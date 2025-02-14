import useWebSocket from "react-use-websocket";
import { useState } from "react";
import { useAuthService } from "./AuthServices";
import useCrud from "../hooks/useCrud";
import { Server } from "../@types/server";

interface Message {
    sender: string;
    content: string;
    timestamp: string;
}

const useChatService = (serverId?: string, channelId?: string) => {
    const [newMessage, setNewMessage] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const { refreshAccessToken, logout } = useAuthService();
    const { fetchData } = useCrud<Server>(
        [],
        `messages/?channel_id=${channelId}`
    );
    const socketUrl = channelId
        ? `ws://127.0.0.1:8000/${serverId}/${channelId}`
        : null;
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const maxConnections = 5;

    const { sendJsonMessage } = useWebSocket(socketUrl, {
        onOpen: async () => {
            try {
                const data = await fetchData();
                setNewMessage([]);
                setNewMessage(Array.isArray(data) ? data : []);
                console.log("Connected");
            } catch (error) {
                console.log(error);
            }
        },
        onClose: (event: CloseEvent) => {
            if (event.code === 4001) {
                console.log("Authentication error");
                refreshAccessToken().catch((error) => {
                    if (error.response && error.response.status === 401) {
                        logout();
                    }
                });
            }
            console.log("Connection closed");
            setReconnectAttempt((prevReconnect) => prevReconnect + 1);
        },
        shouldReconnect: (closeEvent) => {
            if (closeEvent.code == 4001 && reconnectAttempt >= maxConnections) {
                setReconnectAttempt(0);
                return false;
            }
            return true;
        },
        reconnectInterval: 2000,
        onError: () => {
            console.log("Error");
        },
        onMessage: (msg) => {
            const data = JSON.parse(msg.data);
            setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
            setMessage("");
        },
    });
    return { newMessage, message, setMessage, sendJsonMessage };
};

export default useChatService;
