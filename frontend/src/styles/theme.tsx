import { createTheme, responsiveFontSizes } from "@mui/material";

// Extending the MUI theme types to include custom properties.
declare module "@mui/material/styles" {
    interface Theme {
        header: {
            height: number;
        };
        leftPanel: {
            width: number;
            closed: number,
        };
    }
    interface ThemeOptions {
        header?: {
            height?: number;
        };
        leftPanel?: {
            width?: number;
            closed?: number,
        };
    }
}

// Creating a custom MUI theme.
let theme = createTheme({
    typography: {
        fontFamily: "Inter, sans-serif",
    },
    header: {
        height: 50,
    },
    leftPanel: {
        width: 240,
        closed: 70,
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
export default theme;
