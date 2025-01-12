import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
} from "@mui/material";
import useCrud from "../hooks/useCrud";
import { useEffect } from "react";
import { Link } from "react-router";
import { useTheme } from "@mui/material/styles";

interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
}

const Categories = () => {
    const theme = useTheme();
    const { dataResponse, fetchData } = useCrud<Category>(
        [],
        "server/category"
    );

    useEffect(() => {
        fetchData();
    }, []);

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
                <Typography sx={{ display: "block" }}>
                    Explore Categories
                </Typography>
            </Box>
            <List sx={{ py: 0 }}>
                {dataResponse.map((item) => (
                    <ListItem
                        key={item.id}
                        disablePadding
                        sx={{ display: "block" }}
                        dense={true}
                    >
                        <Link
                            to={`/explore/${item.name}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <ListItemButton sx={{ minHeight: 48 }}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        justifyContent: "center",
                                    }}
                                >
                                    <ListItemAvatar sx={{ minWidth: "50px" }}>
                                        <img
                                            alt={item.name}
                                            style={{
                                                width: "25px",
                                                height: "25px",
                                                display: "block",
                                                margin: "auto",
                                            }}
                                            src={
                                                item.icon
                                                    ? `http://127.0.0.1:8000${item.icon}`
                                                    : undefined
                                            }
                                        ></img>
                                    </ListItemAvatar>
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="body1"
                                            textAlign="start"
                                            paddingLeft={1}
                                        >
                                            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default Categories;
