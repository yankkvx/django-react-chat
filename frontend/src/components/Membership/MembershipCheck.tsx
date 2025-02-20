import { useParams } from "react-router";
import { useMembershipServicesContext } from "../../context/MembershipContext";
import { useEffect } from "react";

interface MembershipCheckProps {
    children: any;
}

const MembershipCheck: React.FC<MembershipCheckProps> = ({ children }) => {
    const { serverId } = useParams();
    const { isMember } = useMembershipServicesContext();

    useEffect(() => {
        const checkMembership = async () => {
            try {
                await isMember(Number(serverId));
            } catch (error) {
                console.log(error);
            }
        };
        checkMembership();
    }, [serverId]);

    return <>{children}</>;
};

export default MembershipCheck;
