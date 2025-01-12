import { Box, CssBaseline } from "@mui/material";
import Header from "../components/Header";
import LeftPanel from "../layouts/LeftPanel";
import RightPanel from "../layouts/RightPanel";
import MainPanel from "../layouts/MainPanel";
import TopServers from "../components/TopServers";
import Categories from "../components/Categories";
import Servers from "../components/Servers";

const HomeScreen: React.FC = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Header />
            <LeftPanel>
                <TopServers open={false}/>
            </LeftPanel>
            <RightPanel>
                <Categories />
            </RightPanel>
            <MainPanel><Servers /></MainPanel>
        </Box>
    );
};

export default HomeScreen;
