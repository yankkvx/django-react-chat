import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    Typography,
} from "@mui/material";
import { Link, useParams } from "react-router";
import { useTheme } from "@mui/material/styles";
import { Server } from "../../@types/server";

interface ServerChannelsProps {
    data: Server[];
}

const ServerChannels = (props: ServerChannelsProps) => {
    const { data } = props;
    const theme = useTheme();
    const serverName =
        data && data[0] && data[0].name != null ? data[0].name : "Channels";
    // const serverId = data && data[0] && data[0].id != null ? data[0].id : "Channels";
    const {serverId} = useParams()

    return (
        <>
            <Box
                sx={{
                    height: 50,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    position: "sticky",
                    top: "0",
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Typography sx={{ display: "block" }}>{serverName}</Typography>
            </Box>
            <List sx={{ py: 0 }}>
                {data.flatMap((obj) =>
                    obj.server_channel.map((item) => (
                        <ListItem
                            key={item.id}
                            disablePadding
                            sx={{ display: "block" }}
                            dense={true}
                        >
                            <Link
                                to={`/server/${serverId}/${item.id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <ListItemButton sx={{ minHeight: 48 }}>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body1"
                                                textAlign="start"
                                                paddingLeft={1}
                                            >
                                                {item.name
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    item.name.slice(1)}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))
                )}
            </List>
        </>
    );
};

export default ServerChannels;
