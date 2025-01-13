import { createTheme, responsiveFontSizes } from "@mui/material";

// Extending the MUI theme types to include custom properties.
declare module "@mui/material/styles" {
    interface Theme {
        header: {
            height: number;
        };
        leftPanel: {
            width: number;
            closed: number;
        };
        rightPanel: {
            width: number;
            closed: number;
        };
    }
    interface ThemeOptions {
        header?: {
            height?: number;
        };
        leftPanel?: {
            width?: number;
            closed?: number;
        };
        rightPanel?: {
            width?: number;
            closed?: number;
        };
    }
}

// Creating a custom MUI theme.
export const createMuiTheme = (mode: "light" | "dark") => {
    let theme = createTheme({
        typography: {
            fontFamily: "Inter, sans-serif",
            body1: {
                fontWeight: 500,
                letterSpacing: "-0.5",
            },
            body2: {
                fontWeight: 500,
                fontSize: "16px",
                letterSpacing: "-0.5",
            },
        },
        header: {
            height: 50,
        },
        leftPanel: {
            width: 240,
            closed: 70,
        },
        rightPanel: {
            width: 240,
        },
        palette: {
            mode,
        },
        components: {
            MuiAppBar: {
                defaultProps: {
                    color: "default",
                    elevation: 0,
                },
            },
        },
    });
    theme = responsiveFontSizes(theme);
    return theme;
};

export default createMuiTheme;
