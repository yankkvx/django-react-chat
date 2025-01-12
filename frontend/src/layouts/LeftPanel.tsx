import { Box, useMediaQuery, Drawer as MuiDrawer, styled } from "@mui/material";
import React, { useEffect, useState, ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import SidebarToggle from "../components/SidebarToggle";

type Props = {
    children: ReactNode;
};

type ChildProps = {
    open: boolean;
};

type ChildElement = React.ReactElement<ChildProps>;

const LeftPanel: React.FC<Props> = ({ children }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery("(max-width: 599px)");
    const [open, setOpen] = useState(isSmallScreen);

    useEffect(() => {
        setOpen(!isSmallScreen);
    }, [isSmallScreen]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const openMixin = () => ({
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflow: "hidden",
    });

    const closeMixin = () => ({
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflow: "hidden",
        width: theme.leftPanel.closed,
    });

    // Styled component.
    const Drawer = styled(
        MuiDrawer,
        {}
    )<{ open: boolean }>(({ theme, open }) => ({
        width: theme.leftPanel.width,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            ...openMixin(),
            "& .MuiDrawer-paper": openMixin(),
        }),
        ...(!open && {
            ...closeMixin(),
            "& .MuiDrawer-paper": closeMixin(),
        }),
    }));

    return (
        <Drawer
            open={open}
            variant={isSmallScreen ? "temporary" : "permanent"}
            PaperProps={{
                sx: {
                    mt: `${theme.header.height}px`,
                    height: `calc(100vh - ${theme.header.height}px)`,
                    width: `${theme.leftPanel.width}px`,
                },
            }}
        >
            <Box>
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        p: 0,
                        width: open ? "auto" : "100%",
                        height: "100%",
                        overflowY: "auto",
                    }}
                >
                    <SidebarToggle
                        open={open}
                        handleClose={handleClose}
                        handleOpen={handleOpen}
                    />
                </Box>
                {React.Children.map(children, (child) =>
                    React.isValidElement(child)
                        ? React.cloneElement(child as ChildElement, { open })
                        : child
                )}
            </Box>
        </Drawer>
    );
};

export default LeftPanel;
