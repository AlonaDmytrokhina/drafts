import { RouterProvider } from "react-router-dom";
import { router } from "./providers/router";
import { useAuthStore } from "@/features/auth/auth.store";
import { useEffect } from "react";

export default function App() {
    const checkAuth = useAuthStore((s) => s.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return <RouterProvider router={router} />;
}
