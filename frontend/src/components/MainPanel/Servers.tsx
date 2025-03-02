import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Avatar,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Container,
} from "@mui/material";
import { useParams, Link } from "react-router";
import { useEffect } from "react";
import useCrud from "../../hooks/useCrud";
import { MAIN_URL, MEDIA_URL } from "../../api-config";

interface Server {
    id: number;
    name: string;
    description: string;
    image: string;
    owner: string;
    category: string;
    member: number;
}

const Servers = () => {
    const { categoryName } = useParams();
    const url = categoryName
        ? `server/select/?category=${categoryName}`
        : "server/select";

    const { dataResponse, fetchData } = useCrud<Server>([], url);

    useEffect(() => {
        fetchData();
    }, [categoryName]);

    return (
        <Container maxWidth="xl">
            <Box sx={{ pt: 6 }}>
                <Typography
                    variant="h3"
                    noWrap
                    component="h1"
                    sx={{
                        display: {
                            sm: "block",
                            fontWeight: 700,
                            letterSpacing: "-2px",
                            textTransform: "capitalize",
                        },
                        textAlign: { xs: "center", sm: "left" },
                    }}
                >
                    {categoryName ? categoryName : "Popular Channels"}
                </Typography>
            </Box>
            <Box>
                <Typography
                    variant="h6"
                    noWrap
                    component="h2"
                    color="textSecondary"
                    sx={{
                        display: {
                            sm: "block",
                            fontWeight: 700,
                            letterSpacing: "-1px",
                        },
                        textAlign: { xs: "center", sm: "left" },
                    }}
                >
                    {categoryName
                        ? `Explore the channels that are talking about  ${
                              categoryName.charAt(0).toUpperCase() +
                              categoryName.slice(1)
                          }`
                        : "Check out some of our most popular channels"}
                </Typography>
            </Box>
            <Box>
                <Typography
                    variant="h6"
                    sx={{
                        pt: 6,
                        pb: 1,
                        fontWeight: 700,
                        letterSpacing: "-1px",
                        textAlign: { xs: "center", sm: "left" },
                    }}
                >
                    Recommended channels
                </Typography>
            </Box>
            <Box
                sx={{
                    pt: 3,
                    maxHeight: "calc(100vh - 200px)",
                    overflowY: "auto",
                    paddingBottom: "10vh",
                }}
            >
                <Grid container spacing={{ xs: 0, sm: 2 }}>
                    {dataResponse.map((item) => (
                        <Grid item key={item.id} xs={12} sm={6} md={6} lg={3}>
                            <Card
                                sx={{
                                    heigh: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    boxShadow: "none",
                                    backgroundImage: "none",
                                    borderRadius: 0,
                                    padding: 2,
                                }}
                            >
                                <Link
                                    to={`/server/${item.id}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={
                                            item.image
                                                ? `${MEDIA_URL}${item.image}`
                                                : ""
                                        }
                                        alt={item.name}
                                        sx={{
                                            display: {
                                                xs: "none",
                                                sm: "block",
                                            },
                                            aspectRatio: "16/9",
                                            objectFit: "cover",
                                            width: "100%",
                                        }}
                                    />
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            p: 0,
                                            "&:last-child": {
                                                paddingBottom: 0,
                                            },
                                        }}
                                    >
                                        <List>
                                            <ListItem disablePadding>
                                                <ListItemIcon
                                                    sx={{ minWidth: 0 }}
                                                >
                                                    <ListItemAvatar
                                                        sx={{
                                                            minWidth: "50px",
                                                        }}
                                                    >
                                                        <Avatar
                                                            alt="Server"
                                                            src={
                                                                item.image
                                                                    ? `${MEDIA_URL}${item.image}`
                                                                    : undefined
                                                            }
                                                        ></Avatar>
                                                    </ListItemAvatar>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="body2"
                                                            textAlign="start"
                                                            sx={{
                                                                fontWeight: 700,
                                                                textOverflow:
                                                                    "ellipsis",
                                                                overflow:
                                                                    "hidden",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {item.category}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Link>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Servers;
