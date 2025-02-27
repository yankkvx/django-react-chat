import { Container, Grid, Typography } from "@mui/material";
import ChannelsSection from "./ChannelsSection";
import ServerSection from "./ServerSection";
import Header from "../../components/Header";

const ServerManagementScreen = () => {
    return (
        <>
            <Header />
            <Container sx={{ mt: 10 }}>
                <Typography
                    variant="h4"
                    sx={{ mb: 4, fontWeight: "bold" }}
                    textAlign="center"
                >
                    Server Management
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <ServerSection />
                        <ChannelsSection />
                    </Grid>
                    <Grid item xs={12} md={6}></Grid>
                </Grid>
            </Container>
        </>
    );
};

export default ServerManagementScreen;
