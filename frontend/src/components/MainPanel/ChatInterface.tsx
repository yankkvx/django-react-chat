import { useState } from "react";
import { useParams } from "react-router";
import useWebSocket from "react-use-websocket";
import useCrud from "../../hooks/useCrud";
import { Server } from "../../@types/server";
import { Box, Typography } from "@mui/material";

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
    const { fetchData } = useCrud<Server>(
        [],
        `messages/?channel_id=${channelId}`
    );

    const socketUrl = channelId
        ? `ws://127.0.0.1:8000/${serverId}/${channelId}`
        : null;

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
        onClose: () => {
            console.log("Connection closed");
        },
        onError: () => {
            console.log("Error");
        },
        onMessage: (msg) => {
            const data = JSON.parse(msg.data);
            setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
        },
    });

    return (
        <>
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
                <div>
                    {newMessage.map((msg: Message, index: number) => {
                        return (
                            <div key={index}>
                                <p>{msg.sender}</p>
                                <p>{msg.content}</p>
                            </div>
                        );
                    })}
                    <form>
                        <label>Enter message: </label>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </form>
                    <button
                        onClick={() => {
                            sendJsonMessage({ type: "message", message });
                        }}
                    >
                        Send message
                    </button>
                </div>
            )}
        </>
    );
};

export default ChatInterface;
