import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const RightPanel = () => {
    const theme = useTheme();
    const rightBarcContent = [...Array(100)].map((_, i) => (
        <Typography key={i}>{i + 1}</Typography>
    ));
    return (
        <Box
            sx={{
                minWidth: `${theme.rightPanel.width}px`,
                height: `calc(100vh - ${theme.header.height}px)`,
                mt: `${theme.header.height}px`,
                borderRight: `1px solid ${theme.palette.divider}`,
                display: { xs: "none", sm: "block" },
                overflow: "auto",
            }}
        >
            {rightBarcContent}
        </Box>
    );
};

export default RightPanel;
