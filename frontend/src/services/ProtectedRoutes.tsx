import { Navigate, replace, useNavigate } from "react-router";
import { useAuthServiceContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthServiceContext();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
