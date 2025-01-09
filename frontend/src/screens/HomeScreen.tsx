import { Box, CssBaseline } from "@mui/material";
import Header from "../components/Header";
import LeftPanel from "../layouts/LeftPanel";
import RightPanel from "../layouts/RightPanel";

const HomeScreen: React.FC = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Header />
            <LeftPanel></LeftPanel>
            <RightPanel></RightPanel>
        </Box>
    );
};

export default HomeScreen;
