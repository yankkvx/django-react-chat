export interface AuthServicesProps {
    login: (username: string, password: string) => any;
    isAuthenticated: boolean;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
}
