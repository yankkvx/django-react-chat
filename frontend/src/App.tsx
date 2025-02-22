import { Routes, Route, BrowserRouter } from "react-router";
import HomeScreen from "./screens/HomeScreen";
import ExploreScreen from "./screens/ExploreScreen";
import ColorToggle from "./components/ColorToggle";
import ServerScreen from "./screens/ServerScreen";
import LoginScreen from "./screens/LoginScreen";
import AuthServiceProvider from "./context/AuthContext";
import ProtectedRoute from "./services/ProtectedRoutes";
import SignUpScreen from "./screens/SignUpScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import MembershipServiceProvider from "./context/MembershipContext";
import MembershipCheck from "./components/Membership/MembershipCheck";

const App = () => {
    return (
        <BrowserRouter>
            <AuthServiceProvider>
                <ColorToggle>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route
                            path="/explore/:categoryName"
                            element={<ExploreScreen />}
                        />
                        <Route
                            path="/server/:serverId/:channelId?"
                            element={
                                <ProtectedRoute>
                                    <MembershipServiceProvider>
                                        <MembershipCheck>
                                            <ServerScreen />
                                        </MembershipCheck>
                                    </MembershipServiceProvider>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<LoginScreen />} />
                        <Route path="/sign-up" element={<SignUpScreen />} />
                        <Route
                            path="/edit-profile"
                            element={
                                <ProtectedRoute>
                                    <EditProfileScreen />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </ColorToggle>
            </AuthServiceProvider>
        </BrowserRouter>
    );
};

export default App;
