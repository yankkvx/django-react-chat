import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactNode } from "react";

type MainProps = {
    children: ReactNode;
};

const MainPanel = ({children}: MainProps) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                flexGrow: 1,
                mt: `${theme.header.height}px`,
                height: `calc(100vh - ${theme.header.height}px)`,
                overflow: "hidden",
            }}
        >
            {children}
        </Box>
    );
};

export default MainPanel;
