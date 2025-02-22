import {
    AppBar,
    Box,
    Drawer,
    Toolbar,
    Link,
    Typography,
    IconButton,
    MenuItem,
    Menu,
    Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";
import Categories from "./RightPanel/Categories";
import ColorModeToggle from "./ColorModeToggle";
import PersonIcon from "@mui/icons-material/Person";
import { Link as LinkRouter } from "react-router";
import { useAuthService } from "../services/AuthServices";
import { MEDIA_URL } from "../api-config";

const Header = () => {
    const theme = useTheme();
    // State to control the sidevar visibility.
    const [sideBar, setSideBar] = useState(false);
    const { isAuthenticated, logout, getUserDetails } = useAuthService();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const toggleButton = () => setSideBar((prevState) => !prevState);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const categoriesList = () => (
        <Box
            sx={{ paddingTop: `${theme.header.height}px`, minWidth: 200 }}
            role="presentation"
            onClick={toggleButton}
        >
            <Categories />
        </Box>
    );

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        setAnchorEl(null);
    };

    useEffect(() => {
        if (isAuthenticated) {
            getUserDetails().then((userDetails) => {
                setProfileImage(userDetails.profile_image || null);
                setUsername(userDetails.username);
            });
        }
    }, [isAuthenticated, getUserDetails]);

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
                    {categoriesList()}
                </Drawer>
                <Link
                    href="/"
                    underline="none"
                    color="inherit"
                    sx={{
                        color: theme.palette.text.primary,
                    }}
                >
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
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ColorModeToggle />
                    {isAuthenticated ? (
                        <>
                            <IconButton onClick={handleMenuClick}>
                                {profileImage ? (
                                    <Avatar
                                        src={`${MEDIA_URL}${profileImage}`}
                                        sx={{ width: 30, height: 30 }}
                                    />
                                ) : (
                                    <Avatar sx={{ width: 30, height: 30 }}>
                                        {username?.charAt(0)}
                                    </Avatar>
                                )}
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                            >
                                <MenuItem
                                    component={LinkRouter}
                                    to="/edit-profile"
                                    sx={{
                                        fontSize: "0.875rem",
                                        padding: "1px 10px",
                                    }}
                                >
                                    Profile
                                </MenuItem>

                                <MenuItem
                                    onClick={handleLogout}
                                    sx={{
                                        fontSize: "0.875rem",
                                        padding: "1px 10px",
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <IconButton component={LinkRouter} to="/login">
                            <PersonIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
