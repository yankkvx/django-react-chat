import React, { createContext, useContext } from "react";
import { AuthServicesProps } from "../@types/authService";
import { useAuthService } from "../services/AuthServices";

const AuthServicesContext = createContext<AuthServicesProps | null>(null);

//
export function AuthServiceProvider(props: React.PropsWithChildren) {
    const authServices = useAuthService();
    return (
        <AuthServicesContext.Provider value={authServices}>
            {props.children}
        </AuthServicesContext.Provider>
    );
}

export function useAuthServiceContext(): AuthServicesProps {
    const context = useContext(AuthServicesContext);

    if (context === null) {
        throw new Error("You have to use the AuthServiceProvider");
    }
    return context;
}

export default AuthServiceProvider;
