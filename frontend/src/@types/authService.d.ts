export interface AuthServicesProps {
    login: (username: string, password: string) => any;
    isAuthenticated: boolean;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
    signUp: (formData: FormData) => any;
    editUser: (formData: FormData) => any;
    getUserDetails: () => Promise<{ username: string; email: string; profile_image: string | null }>;
}
