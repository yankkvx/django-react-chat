import { createTheme, responsiveFontSizes } from "@mui/material";

// Extending the MUI theme types to include custom properties.
declare module "@mui/material/styles" {
    interface Theme {
        header: {
            height: number;
        };
    }
    interface ThemeOptions {
        header?: {
            height?: number;
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
