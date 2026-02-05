import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/components/Header.css";
import { Search, Menu, User, LogOut, Bell } from "lucide-react"; // Додали іконки

export default function Header() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <header className="header">
            <div className="header_left">
                <Menu size={32} className="icon" />
                <button className="header_btn">Категорії</button>
            </div>

            <div className="header_center">
                <div className="search_box">
                    <input type="text" placeholder="Пошук..." />
                </div>
                <Search size={28} className="icon" />
            </div>

            <div className="header_right">
                {isLoggedIn ? (
                    <>
                        <button className="header_btn">Створити</button>
                        <Bell size={24} className="icon" />
                        <div className="avatar" onClick={() => navigate("/profile")}>
                            <User size={24} className="icon"/>
                        </div>
                        <LogOut size={24} className="icon" onClick={handleLogout} title="Вийти" />
                    </>
                ) : (
                    <>
                        <button className="header_btn" onClick={() => navigate("/register")}>
                            Зареєстуватися
                        </button>
                        <button className="header_btn primary" onClick={() => navigate("/login")}>
                            Увійти
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}