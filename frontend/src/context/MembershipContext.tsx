import React, { createContext, useContext } from "react";
import useMembershipService from "../services/MembershipService";

interface UseServer {
    joinServer: (serverId: number) => Promise<void>;
    leaveServer: (serverId: number) => Promise<void>;
    isMember: (serverId: number) => Promise<boolean>;
    isUserMember: boolean;
    error: Error | null;
    isLoading: boolean;
}

const MembershipServicesContext = createContext<UseServer | null>(null);

export function MembershipServiceProvider(props: React.PropsWithChildren) {
    const membershipServices = useMembershipService();
    return (
        <MembershipServicesContext.Provider value={membershipServices}>
            {props.children}
        </MembershipServicesContext.Provider>
    );
}

export function useMembershipServicesContext(): UseServer {
    const context = useContext(MembershipServicesContext);

    if (context === null) {
        throw new Error("You have to use the MembershipServiceProvider");
    }
    return context;
}

export default MembershipServiceProvider;
