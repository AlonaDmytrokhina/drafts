import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/Login";
import FanficList from "../features/fanfics/fanficList/FanficList";
import FanficPage from "../features/fanfics/fanficPage/FanficPage";
import Layout from "@/shared//ui/Layout";
import WelcomePage from "../features/welcome/WelcomePage";
import Register from "../features/auth/Register";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage />,
    },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    {
        element: <Layout />,
        children: [
            { path: "/fanfics", element: <FanficList /> },
            { path: "/fanfics/:id", element: <FanficPage /> },
        ],
    },
]);
