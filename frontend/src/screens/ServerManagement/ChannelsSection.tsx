import React from "react";
import {
    Grid,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Typography,
} from "@mui/material";
import useServerService from "../../services/ServerServices";
import { useFormik } from "formik";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

const ChannelsSection = () => {
    const { getServer, createChannel, deleteChannel } = useServerService();
    const { serverId: serverIdFromUrl } = useParams<{ serverId: string }>();
    const serverId = serverIdFromUrl ? Number(serverIdFromUrl) : null;
    const [channels, setChannels] = useState<
        { id: number; name: string; topic: string }[]
    >([]);

    const formik = useFormik({
        initialValues: {
            name: "",
            topic: "",
        },
        validate: (values) => {
            const errors: Partial<typeof values> = {};
            if (!values.name) {
                errors.name = "This field is required";
            } else if (!values.topic) {
                errors.topic = "This field is required";
            }
            return errors;
        },
        onSubmit: async (values) => {
            if (!serverId) {
                return;
            }
            const { name, topic } = values;
            const formData = new FormData();
            formData.append("name", name);
            formData.append("topic", topic);
            formData.append("server", String(serverId));
            try {
                const newChannel = await createChannel(formData);
                setChannels((prevChannels) => [
                    ...prevChannels,
                    {
                        id: newChannel.id,
                        name: newChannel.name,
                        topic: newChannel.topic,
                    },
                ]);
            } catch (error) {
                throw error;
            }
        },
    });

    useEffect(() => {
        if (!serverId) return;
        const fetchChannels = async () => {
            try {
                const serverData = await getServer(serverId);
                setChannels(serverData.server_channel);
            } catch (error) {
                console.error("Failed to load channels", error);
            }
        };
        fetchChannels();
    }, [serverId, getServer]);

    const handleDeleteChannel = async (channelId: number) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this channel?"
        );
        if (!isConfirmed) return;
        try {
            await deleteChannel(channelId);
            setChannels(channels.filter((channel) => channel.id !== channelId));
        } catch (error) {
            throw error;
        }
    };

    return (
        <>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Channels
                </Typography>
                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2 }}
                    component="form"
                    onSubmit={formik.handleSubmit}
                >
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Channel Name"
                            id="name"
                            type="text"
                            variant="outlined"
                            fullWidth
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={
                                !!formik.touched.name && !!formik.errors.name
                            }
                            helperText={
                                formik.touched.name && formik.errors.name
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Topic Name"
                            id="topic"
                            type="text"
                            variant="outlined"
                            fullWidth
                            value={formik.values.topic}
                            onChange={formik.handleChange}
                            error={
                                !!formik.touched.topic && !!formik.errors.topic
                            }
                            helperText={
                                formik.touched.topic && formik.errors.topic
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Add Channel
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <strong>Channel Name</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Topic</strong>
                                </TableCell>
                                <TableCell align="right">
                                    <strong>Actions</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {channels.map((channel) => (
                                <TableRow key={channel.id}>
                                    <TableCell>{channel.name}</TableCell>
                                    <TableCell>{channel.topic}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() =>
                                                handleDeleteChannel(channel.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};

export default ChannelsSection;
