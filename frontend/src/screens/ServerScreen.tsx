import { Box, CssBaseline } from "@mui/material";
import Header from "../components/Header";
import LeftPanel from "../layouts/LeftPanel";
import RightPanel from "../layouts/RightPanel";
import MainPanel from "../layouts/MainPanel";
import ChatInterface from "../components/MainPanel/ChatInterface";
import ServerChannels from "../components/RightPanel/ServerChannels";
import CurrentServer from "../components/LeftPanel/CurrentServer";
import { useNavigate, useParams } from "react-router";
import useCrud from "../hooks/useCrud";
import { Server } from "../@types/server.d";
import { useEffect } from "react";

const ServerScreen: React.FC = () => {
    const navigate = useNavigate();
    const { serverId, channelId } = useParams();
    const validServerId = serverId && /^\d+$/.test(serverId);

    const { dataResponse, error, fetchData } = useCrud<Server>(
        [],
        validServerId ? `server/select/?server_id=${serverId}` : ""
    );

    useEffect(() => {
        if (validServerId) {
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (!validServerId) {
            navigate("/");
        }
        if (error !== null) {
            if (["400", "404", "500"].includes(error.message)) {
                navigate("/");
            }
        }
    }, [error, navigate]);

    const isChannel = (): Boolean => {
        if (!channelId) {
            return true;
        }

        return dataResponse.some((server) =>
            server.server_channel.some(
                (channel) => channel.id === parseInt(channelId)
            )
        );
    };

    useEffect(() => {
        if (!isChannel()) {
            navigate(`/server/${serverId}`);
        }
    }, [isChannel, channelId]);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Header />
            <LeftPanel>
                <CurrentServer open={false} data={dataResponse} />
            </LeftPanel>
            <RightPanel>
                <ServerChannels data={dataResponse} />
            </RightPanel>
            <MainPanel>
                <ChatInterface data={dataResponse} />
            </MainPanel>
        </Box>
    );
};

export default ServerScreen;
