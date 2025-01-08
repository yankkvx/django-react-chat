import { Box, CssBaseline } from "@mui/material";
import Header from "../components/Header";
import LeftPanel from "../layouts/LeftPanel";

const HomeScreen: React.FC = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Header />
            <LeftPanel></LeftPanel>
            HomeScren
        </Box>
    );
};

export default HomeScreen;
