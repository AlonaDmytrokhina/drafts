import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/Login";
import FanficList from "../features/fanfics/fanficList/FanficList";
import FanficPage from "../features/fanfics/fanficPage/FanficPage";
import Layout from "@/shared//ui/Layout";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <FanficList /> },
            { path: "/fanfics", element: <FanficList /> },
            { path: "/fanfics/:id", element: <FanficPage /> },
            { path: "/login", element: <Login /> },
        ],
    },
]);
