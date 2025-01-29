import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Avatar,
} from "@mui/material";
import { memo } from "react";
import { Link } from "react-router";

interface ServerChannelsProps {
    data: Server[];
}

type Props = {
    open: boolean;
};

const CurrentServer: React.FC<Props & ServerChannelsProps> = memo(
    ({ open, data }) => {
        return (
            <>
                <Box
                    sx={{
                        height: 50,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        flex: "1 1 100%",
                    }}
                >
                    <Typography sx={{ display: open ? "block" : "none" }}>
                        Server
                    </Typography>
                </Box>
                <List>
                    {data.map((item) => (
                        <ListItem
                            key={item.id}
                            disablePadding
                            sx={{ display: "block" }}
                            dense={true}
                        >
                            <Link
                                to={`/server/${item.id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <ListItemButton sx={{ minHeight: 0 }}>
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ListItemAvatar
                                            sx={{ minWidth: "50px" }}
                                        >
                                            <Avatar
                                                alt={item.name}
                                                src={
                                                    item.image
                                                        ? `http://127.0.0.1:8000${item.image}`
                                                        : undefined
                                                }
                                            ></Avatar>
                                        </ListItemAvatar>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    lineHeight: 1.2,
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {item.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 500,
                                                    lineHeight: 1.2,
                                                    color: "textSecondary",
                                                }}
                                            >
                                                {item.description}
                                            </Typography>
                                        }
                                        sx={{ opacity: open ? 1 : 0 }}
                                        primaryTypographyProps={{
                                            sx: {
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </>
        );
    }
);

export default CurrentServer;
