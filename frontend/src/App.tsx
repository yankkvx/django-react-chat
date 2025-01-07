import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import HomeScreen from "./screens/HomeScreen";
import theme from "./styles/theme";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<HomeScreen />} />
        </Route>
    )
);

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
};

export default App;
