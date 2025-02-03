import { Box } from "@mui/material";
import { styled } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";

interface ScrollChatProps {
    children: React.ReactNode;
}

const ScrollContainer = styled(Box)(({ theme }) => ({
    height: `calc(100vh - 190px)`,
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#888",
        borderRadius: "10px",
        minHeight: "50px",
        height: "80px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#555",
    },
    "&::-webkit-scrollbar-track": {
        // backgroundColor: "#f0f0f0",
    },
    "&::-webkit-scrollbar-corner": {
        backgroundColor: "transparent",
    },
}));

const ScrollChat = ({ children }: ScrollChatProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToEnd = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToEnd();
    }, [scrollToEnd, children]);

    return <ScrollContainer ref={scrollRef}>{children}</ScrollContainer>;
};
export default ScrollChat;
