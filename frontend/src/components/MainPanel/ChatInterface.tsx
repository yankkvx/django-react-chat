import { useState } from "react";
import { useParams } from "react-router";
import useWebSocket from "react-use-websocket";
import useCrud from "../../hooks/useCrud";
import { Server } from "../../@types/server";
import { Box, Typography } from "@mui/material";
import ChannelInterface from "./ChannelInterface";
import MessageTemplate from "./MessageTemplate";
import { useAuthService } from "../../services/AuthServices";

interface Message {
    sender: string;
    content: string;
    timestamp: string;
}

interface ServerChannelProps {
    data: Server[];
}

const ChatInterface = (props: ServerChannelProps) => {
    const [newMessage, setNewMessage] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const { serverId, channelId } = useParams();
    const { data } = props;
    const serverName = data?.[0]?.name ?? "Server";
    const serverDescription = data?.[0]?.description ?? "";
    const serverImage = data?.[0]?.image ?? "";
    const serverImageUrl = serverImage
        ? `http://127.0.0.1:8000${serverImage}`
        : "";
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
                setReconnectAttempt(0)
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

    return (
        <>
            <ChannelInterface data={data} />
            {channelId == undefined ? (
                <Box
                    sx={{
                        overflow: "hidden",
                        p: 2,
                        height: `calc(80vh)`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {serverImageUrl ? (
                        <Box
                            component="img"
                            sx={{
                                height: {
                                    xs: 175,
                                    sm: 200,
                                    md: 250,
                                    lg: 300,
                                    xl: 350,
                                },
                                width: {
                                    xs: 175,
                                    sm: 200,
                                    md: 250,
                                    lg: 300,
                                    xl: 350,
                                },
                                objectFit: "cover",
                            }}
                            src={serverImageUrl}
                            alt=""
                        />
                    ) : null}

                    <Box sx={{ textAlign: "center", p: { xs: 1 } }}>
                        <Typography
                            variant="h3"
                            letterSpacing={2}
                            sx={{ px: 2, maxWidth: "600" }}
                        >
                            Welcome to{" "}
                            <Typography
                                variant="h3"
                                component="span"
                                sx={{
                                    fontWeight: "medium",
                                }}
                            >
                                {serverName}
                            </Typography>
                        </Typography>
                        <Typography>{serverDescription}</Typography>
                    </Box>
                </Box>
            ) : (
                <MessageTemplate
                    newMessage={newMessage}
                    setMessage={setMessage}
                    message={message}
                    sendJsonMessage={sendJsonMessage}
                />
            )}
        </>
    );
};

export default ChatInterface;
