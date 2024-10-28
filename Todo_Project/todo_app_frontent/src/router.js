import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./components/auth/Login";
import Home from "./components/homeListing";
import TodosList from "./components/todoListing";





const router = createBrowserRouter([
    { path: '', element: <App/> },
    { path: 'register', element:<Register/>},
    { path: 'home', element:<Home/>},
    { path: 'projects/:projectId', element: <TodosList /> },
]);

export default router;