import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MainPanel = () => {
    const theme = useTheme();

    const mainContent = [...Array(100)].map((_, i) => (
        <Typography key={i}>{i + 1}</Typography>
    ));

    return (
        <Box
            sx={{
                flexGrow: 1,
                mt: `${theme.header.height}px`,
                height: `calc(100vh - ${theme.header.height}px)`,
                overflow: "hidden",
            }}
        >
            {mainContent}
        </Box>
    );
};

export default MainPanel;
