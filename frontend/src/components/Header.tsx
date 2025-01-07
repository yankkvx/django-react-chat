import {
    AppBar,
    Box,
    Drawer,
    Toolbar,
    Link,
    Typography,
    IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const Header = () => {
    const theme = useTheme();
    // State to control the sidevar visibility.
    const [sideBar, setSideBar] = useState(false);
    const toggleButton = () => setSideBar((prevState) => !prevState);

    // Generate mock content for the sidebar.
    const drawerContent = [...Array(100)].map((_, i) => (
        <Typography key={i}>{i + 1}</Typography>
    ));

    return (
        <AppBar
            sx={{
                zIndex: theme.zIndex.drawer + 2,
                backgroundColor: theme.palette.background.default,
                borderBottom: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Toolbar
                variant="dense"
                sx={{
                    height: theme.header?.height,
                    minHeight: theme.header?.height,
                }}
            >
                <Box sx={{ display: { xs: "block", sm: "none" } }}>
                    <IconButton
                        color="inherit"
                        aria-label="open draw"
                        edge="start"
                        sx={{ mr: 0.3 }}
                        onClick={toggleButton}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Drawer anchor="left" open={sideBar} onClose={toggleButton}>
                    {drawerContent}
                </Drawer>
                <Link href="/" underline="none" color="inherit">
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            display: {
                                fontWeight: 800,
                                letterSpacing: "-0.5px",
                            },
                        }}
                    >
                        FlowTalk
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
