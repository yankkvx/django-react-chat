import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useParams, Link } from "react-router";
import {
    Container,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Box,
    CircularProgress,
} from "@mui/material";
import useServerService from "../services/ServerServices";
import { MEDIA_URL } from "../api-config";
import { Server } from "../@types/server";

interface UserProfile {
    id: number;
    email: string;
    username: string;
    profile_image: string;
    last_login: string | null;
    date_joined: string;
    user_servers: Server[];
}

const ProfileScreen: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const { getPublicProfile } = useServerService();

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await getPublicProfile(Number(userId));
            setProfile(res?.data || null);
        };

        fetchProfile();
    }, [userId, getPublicProfile]);

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
                <Card sx={{ display: "flex", p: 2, mb: 4 }}>
                    <Avatar
                        src={`${MEDIA_URL}/${profile?.profile_image}`}
                        alt={profile?.username}
                        sx={{ width: 100, height: 100, mr: 2 }}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="h4">
                            {profile?.username}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {profile?.email}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Date joined:{" "}
                            {profile?.date_joined
                                ? new Intl.DateTimeFormat("en-US", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                  })
                                      .format(new Date(profile.date_joined))
                                      .replace(/\//g, ".")
                                : ""}
                        </Typography>
                    </Box>
                </Card>
                <Typography variant="h5" gutterBottom>
                    Servers
                </Typography>
                <Grid container spacing={3}>
                    {profile?.user_servers &&
                    profile.user_servers.length > 0 ? (
                        profile.user_servers.map((server) => (
                            <Grid item xs={12} sm={6} md={4} key={server.id}>
                                <Box>
                                    <Link
                                        to={`/server/${server.id}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={`${MEDIA_URL}/${server.image}`}
                                                alt={server.name}
                                            />
                                            <CardContent>
                                                <Typography variant="h6">
                                                    {server.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                >
                                                    {server.description ||
                                                        "No description available."}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                >
                                                    Category: {server.category}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: "150px",
                            }}
                        >
                            <Typography variant="body1" align="center">
                                This user is not a member of any servers.
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Container>
        </>
    );
};

export default ProfileScreen;
