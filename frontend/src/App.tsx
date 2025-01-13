import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router";
import HomeScreen from "./screens/HomeScreen";
import ExploreScreen from "./screens/ExploreScreen";
import ColorToggle from "./components/ColorToggle";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/explore/:categoryName/" element={<ExploreScreen />} />
        </Route>
    )
);

const App = () => {
    return (
        <ColorToggle>
            <RouterProvider router={router} />
        </ColorToggle>
    );
};

export default App;
