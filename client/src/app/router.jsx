import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/Login";
import FanficList from "../features/fanfics/components/FanficList";
import FanficPage from "../features/fanfics/components/FanficPage";
import ChapterPage from "@/features/chapters/components/ChapterPage";
import Layout from "@/shared//ui/Layout";
import WelcomePage from "../features/welcome/WelcomePage";
import Register from "../features/auth/Register";
import ProfilePage from "@/features/users/components/ProfilePage";
import CreateFanficPage from "@/features/fanfics/components/CreateFanficPage";
import AddChapterPage from "@/features/chapters/components/AddChapterPage";

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
            { path: "/profile/:username", element: <ProfilePage />},
            { path: "/fanfics/:fanficId/chapters/:chapterId", element: <ChapterPage /> },
            { path: "/fanfics/:fanficId/chapters/new", element: <AddChapterPage /> },
            { path: "/fanfics/new", element: <CreateFanficPage /> },
        ],
    },
]);
