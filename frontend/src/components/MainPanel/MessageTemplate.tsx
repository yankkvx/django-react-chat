import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    TextField,
    useTheme,
} from "@mui/material";
import { Link } from "react-router";
import SendIcon from "@mui/icons-material/Send";
import ScrollChat from "./ScrollChat";
import { MEDIA_URL } from "../../api-config";

interface Message {
    sender: string;
    sender_id: number;
    content: string;
    timestamp: string;
    profile_image: string;
}

interface MessageTemplateProps {
    newMessage: Message[];
    setMessage: (value: string) => void;
    message: string;
    sendJsonMessage: (msg: object) => void;
}

interface sendMessageData {
    type: string;
    message: string;
    [key: string]: any;
}

const MessageTemplate = ({
    newMessage,
    setMessage,
    message,
    sendJsonMessage,
}: MessageTemplateProps) => {
    const theme = useTheme();

    const submitButton = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.trim()) {
            sendJsonMessage({
                type: "message",
                message,
            } as sendMessageData);
        }
    };

    const enterSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && message.trim()) {
            e.preventDefault();
            sendJsonMessage({
                type: "message",
                message,
            } as sendMessageData);
        }
    };

    function formatTimeStamp(timestamp: string) {
        const date = new Date(Date.parse(timestamp));
        const formatDate = new Intl.DateTimeFormat("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        })
            .format(date)
            .replace(/\//g, ".");
        return `${formatDate}`;
    }

    const getProfileImage = (msg: Message) => {
        return msg.profile_image
            ? `${MEDIA_URL}${msg.profile_image}`
            : "/default-avatar.png";
    };

    const handleSendClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (message.trim()) {
            sendJsonMessage({
                type: "message",
                message,
            } as sendMessageData);
        }
    };

    return (
        <>
            <Box
                sx={{ overflow: "hidden", p: 0, height: `calc(100vh - 100px)` }}
            >
                <ScrollChat>
                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                        {newMessage.map((msg: Message, index: number) => {
                            const manyMessagesFromOneUser =
                                index === 0 ||
                                newMessage[index - 1].sender != msg.sender;
                            return (
                                <ListItem key={index} alignItems="flex-start">
                                    {manyMessagesFromOneUser ? (
                                        <ListItemAvatar>
                                            <Link
                                                to={`/profile/${msg.sender_id}`}
                                            >
                                                <Avatar
                                                    alt=""
                                                    src={getProfileImage(msg)}
                                                />
                                            </Link>
                                        </ListItemAvatar>
                                    ) : (
                                        <Box
                                            sx={{
                                                width: 40,
                                                minWidth: 40,
                                                mr: 2,
                                            }}
                                        />
                                    )}

                                    <ListItemText
                                        primaryTypographyProps={{
                                            fontSize: "12px",
                                            variant: "body2",
                                        }}
                                        primary={
                                            manyMessagesFromOneUser ? (
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    color="text.primary"
                                                    sx={{
                                                        display: "inline",
                                                        position: "relative",
                                                        top: "-6px",
                                                    }}
                                                >
                                                    {msg.sender}
                                                </Typography>
                                            ) : null
                                        }
                                        secondary={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    width: "100%",
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    style={{
                                                        overflow: "visible",
                                                        whiteSpace: "normal",
                                                        textOverflow: "clip",
                                                    }}
                                                    sx={{
                                                        lineHeight: 1.4,
                                                        fontWeight: 400,
                                                        letterSpacing: "-0.2px",
                                                        flexGrow: 1,
                                                    }}
                                                    component="span"
                                                    color="text.secondary"
                                                >
                                                    {msg.content}{" "}
                                                </Typography>
                                                <Typography
                                                    style={{
                                                        fontSize: "10px",
                                                        color: "#888",
                                                        textAlign: "right",
                                                        minWidth: "60px",
                                                    }}
                                                >
                                                    {formatTimeStamp(
                                                        msg.timestamp
                                                    )}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </ScrollChat>
            </Box>
            <Box sx={{ position: "sticky", bottom: 0, width: "100%" }}>
                <form
                    style={{
                        bottom: 0,
                        right: 0,
                        padding: "1rem",
                        backgroundColor: theme.palette.background.default,
                        zIndex: 1,
                    }}
                    onSubmit={submitButton}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={3}
                            sx={{ flexGrow: 1 }}
                            value={message}
                            onKeyDown={enterSend}
                            onChange={(e) => setMessage(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            ml: 1,
                                        }}
                                        onClick={handleSendClick}
                                    >
                                        <SendIcon />
                                    </Box>
                                ),
                            }}
                        />
                    </Box>
                </form>
            </Box>
        </>
    );
};

export default MessageTemplate;
