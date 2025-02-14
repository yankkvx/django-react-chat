import { useParams } from "react-router";
import { Server } from "../../@types/server";
import { Box, Typography } from "@mui/material";
import ChannelInterface from "./ChannelInterface";
import MessageTemplate from "./MessageTemplate";
import useChatService from "../../services/ChatServices";

interface ServerChannelProps {
    data: Server[];
}

const ChatInterface = (props: ServerChannelProps) => {
    const { serverId, channelId } = useParams();
    const { data } = props;
    const serverName = data?.[0]?.name ?? "Server";
    const serverDescription = data?.[0]?.description ?? "";
    const serverImage = data?.[0]?.image ?? "";
    const serverImageUrl = serverImage
        ? `http://127.0.0.1:8000${serverImage}`
        : "";
    const { newMessage, message, setMessage, sendJsonMessage } = useChatService(
        serverId,
        channelId
    );

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
