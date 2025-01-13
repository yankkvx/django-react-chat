import { useContext } from "react";
import { useTheme } from "@mui/material";
import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext } from "../context/DarkModeContext";

const ColorModeToggle = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    return (
        <>
            <IconButton
                onClick={colorMode.toggleColorMode}
                color="inherit"
                sx={{
                    backgroundColor: "transparent",
                    ":hover": {
                        backgroundColor: "transparent",
                    },
                }}
            >
                {theme.palette.mode === "dark" ? (
                    <LightModeIcon sx={{ fontSize: "1.5rem" }} />
                ) : (
                    <DarkModeIcon sx={{ fontSize: "1.5rem" }} />
                )}
            </IconButton>
        </>
    );
};
export default ColorModeToggle;
