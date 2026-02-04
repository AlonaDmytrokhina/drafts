import { Outlet } from "react-router-dom";
import Header from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";

export default function Layout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
