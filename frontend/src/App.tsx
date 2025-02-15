import { Routes, Route, BrowserRouter } from "react-router";
import HomeScreen from "./screens/HomeScreen";
import ExploreScreen from "./screens/ExploreScreen";
import ColorToggle from "./components/ColorToggle";
import ServerScreen from "./screens/ServerScreen";
import LoginScreen from "./screens/LoginScreen";
import AuthServiceProvider from "./context/AuthContext";
import TestLogin from "./screens/TestLogin";
import ProtectedRoute from "./services/ProtectedRoutes";

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
                                    <ServerScreen />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<LoginScreen />} />
                        <Route
                            path="/logintest"
                            element={
                                <ProtectedRoute>
                                    <TestLogin />
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
