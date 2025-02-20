import { useMembershipServicesContext } from "../../context/MembershipContext";
import { useParams } from "react-router";
import { Button, CircularProgress, Alert } from "@mui/material";

const MembershipButton = () => {
    const { serverId } = useParams();
    const { joinServer, leaveServer, isUserMember, error, isLoading } =
        useMembershipServicesContext();

    const handleJoinServer = async () => {
        try {
            await joinServer(Number(serverId));
        } catch (error) {
            console.log(error);
        }
    };

    const handleLeaveServer = async () => {
        try {
            await leaveServer(Number(serverId));
        } catch (error) {}
    };

    if (isLoading) {
        return <CircularProgress size={24} />;
    }

    if (error) {
        return <Alert severity="error">{error.message}</Alert>;
    }

    return (
        <Button
            variant="outlined"
            color="inherit"
            onClick={isUserMember ? handleLeaveServer : handleJoinServer}
            sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                borderColor: "inherit",
                color: "inherit",
                "&:hover": {
                    borderColor: isUserMember ? "red" : "green",
                    backgroundColor: isUserMember
                        ? "rgba(244, 67, 54, 0.1)"
                        : "rgba(76, 175, 80, 0.1)",
                    color: isUserMember ? "red" : "green",
                },
            }}
        >
            {isUserMember ? "Leave" : "Join"}
        </Button>
    );
};

export default MembershipButton;
