import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactNode } from "react";

type RightPanelProps = {
    children: ReactNode;
};

const RightPanel = ({ children }: RightPanelProps) => {
    const theme = useTheme();

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
            {children}
        </Box>
    );
};

export default RightPanel;
