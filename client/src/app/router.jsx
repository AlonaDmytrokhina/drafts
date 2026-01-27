import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/Login";
import FanficList from "../features/fanfics/FanficList";
import FanficPage from "../features/fanfics/FanficPage";

export const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/", element: <FanficList /> },
    { path: "/fanfics", element: <FanficList /> },
    { path: "/fanfics/:id", element: <FanficPage /> },
]);
