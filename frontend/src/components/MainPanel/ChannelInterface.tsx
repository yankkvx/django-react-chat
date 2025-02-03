import {
    Box,
    ListItemAvatar,
    Typography,
    IconButton,
    Drawer,
    useTheme,
    Avatar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Server } from "../../@types/server";
import { useParams } from "react-router";
import { useState } from "react";
import ServerChannels from "../RightPanel/ServerChannels";
import { Link } from "react-router";

interface ServerChannelProps {
    data: Server[];
}

const ChannelInterface = (props: ServerChannelProps) => {
    const { data } = props;
    const theme = useTheme();
    const { serverId, channelId } = useParams();
    const [sideBar, setSideBar] = useState(false);
    const channelName =
        data
            ?.find((server) => server.id === Number(serverId))
            ?.server_channel?.find(
                (channel) => channel.id === Number(channelId)
            )?.name || "Home";
    const serverImage = data?.[0]?.image ?? "";
    const serverImageUrl = serverImage
        ? `http://127.0.0.1:8000${serverImage}`
        : "";
    const toggleButton = () => setSideBar((prevState) => !prevState);
    const channelsList = () => (
        <Box
            sx={{ paddingTop: `${theme.header.height}px`, minWidth: 200 }}
            role="presentation"
            onClick={toggleButton}
        >
            <ServerChannels data={data} />
        </Box>
    );

    return (
        <>
            <Box
                sx={{
                    height: 50,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    position: "sticky",
                    top: "0",
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Box sx={{ display: { xs: "block", sm: "none" } }}>
                    <Link to={`/server/${serverId}`}>
                        <ListItemAvatar sx={{ minWidth: "40px" }}>
                            <Avatar
                                src={serverImageUrl}
                                alt="Channel Image"
                                sx={{ width: "30px", height: "30px" }}
                            />
                        </ListItemAvatar>
                    </Link>
                </Box>
                <Typography sx={{ display: "block" }}>{channelName}</Typography>
                <Box sx={{ flexGrow: 1 }}></Box>
                <Box sx={{ display: { xs: "block", sm: "none" } }}>
                    <IconButton edge="end" onClick={toggleButton}>
                        <MoreVertIcon />
                    </IconButton>
                    <Drawer anchor="left" open={sideBar} onClose={toggleButton}>
                        {channelsList()}
                    </Drawer>
                </Box>
            </Box>
        </>
    );
};

export default ChannelInterface;
