import { Box, CssBaseline } from "@mui/material";
import Header from "../components/Header";
import LeftPanel from "../layouts/LeftPanel";
import RightPanel from "../layouts/RightPanel";
import MainPanel from "../layouts/MainPanel";
import TopServers from "../components/LeftPanel/TopServers";
import Categories from "../components/RightPanel/Categories";
import Servers from "../components/MainPanel/Servers";

const ExploreScreen = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Header />
            <LeftPanel>
                <TopServers open={false} />
            </LeftPanel>
            <RightPanel>
                <Categories />
            </RightPanel>
            <MainPanel>
                <Servers />
            </MainPanel>
        </Box>
    );
};

export default ExploreScreen;
