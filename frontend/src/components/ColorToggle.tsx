import { CssBaseline, useMediaQuery } from "@mui/material";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import createMuiTheme from "../styles/theme";
import { ThemeProvider } from "@emotion/react";
import { ColorModeContext } from "../context/DarkModeContext";

interface ColorProps {
    children: ReactNode;
}

const ColorToggle: React.FC<ColorProps> = ({ children }) => {
    // Detects if the user prefers dark mode based on system settings.
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    // Retrieve stored color mode from localStorage.
    const storedMode = localStorage.getItem("colorMode") as "light" | "dark";
    const initialMode: "light" | "dark" =
        storedMode || prefersDarkMode ? "dark" : "light";

    const [mode, setMode] = useState<"light" | "dark">(initialMode);

    const toggleColorMode = React.useCallback(() => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    }, []);

    // Save the current mode to localStorage whenever it changes.
    useEffect(() => {
        localStorage.setItem("colorMode", mode);
    }, [mode]);

    // Memoize the color mode toggle function to avoid unnecessary renders.
    const colorMode = useMemo(() => ({ toggleColorMode }), [toggleColorMode]);

    const theme = React.useMemo(() => createMuiTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default ColorToggle;
