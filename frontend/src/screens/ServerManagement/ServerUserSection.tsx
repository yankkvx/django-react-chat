import React, { useState, useEffect } from "react";
import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Button,
} from "@mui/material";
import useServerService from "../../services/ServerServices";
import { useParams } from "react-router";
import { Link } from "react-router";

const ServerUserSection = () => {
    const [server, setServer] = useState<any>(null);
    const { getServer, removeUserFromMembers } = useServerService();
    const { serverId: serverIdFromUrl } = useParams<{ serverId: string }>();
    const serverId = serverIdFromUrl ? Number(serverIdFromUrl) : null;

    useEffect(() => {
        const fetchServerData = async () => {
            try {
                const data = await getServer(serverId);
                setServer(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchServerData();
    }, [getServer, serverId]);

    const handleDeleteUser = async (memberId: number) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to remove this user from the server?"
        );
        if (!isConfirmed) return;

        try {
            await removeUserFromMembers(serverId, memberId);
            setServer((prevServer: any) => ({
                ...prevServer,
                member: prevServer.member.filter(
                    (id: number) => id !== memberId
                ),
            }));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Users
            </Typography>
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 380,
                    overflowY: "auto",
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>User Id</strong>
                            </TableCell>
                            <TableCell
                                sx={{ textAlign: "right", paddingRight: 4 }}
                            >
                                <strong>Action</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {server?.member?.map((memberId: number) => (
                            <TableRow key={memberId}>
                                <TableCell>
                                    <Link
                                        to={`/profile/${memberId}`}
                                    >{`ID ${memberId}`}</Link>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() =>
                                            handleDeleteUser(memberId)
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
    );
};

export default ServerUserSection;
