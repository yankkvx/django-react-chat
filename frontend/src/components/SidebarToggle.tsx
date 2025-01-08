import React from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

type Props = {
    open: boolean;
    handleOpen: () => void;
    handleClose: () => void;
};

const SidebarToggle: React.FC<Props> = ({ open, handleOpen, handleClose }) => {
    return (
        <Box
            sx={{
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <IconButton onClick={open ? handleClose : handleOpen}>
                {open ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
        </Box>
    );
};

export default SidebarToggle;
