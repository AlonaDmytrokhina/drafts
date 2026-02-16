import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "@/styles/components/Header.css";
import { Search, Menu, User, LogOut, Feather, Sparkles, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";
import { CategoryPanel} from "@/shared/ui/CategoryPanel";

export default function Header() {
    const navigate = useNavigate();

    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const isLoggedIn = !!user;
    const [searchQuery, setSearchQuery] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleSearch = (e) => {
        if ((e.key === "Enter" || e.type === "click") && searchQuery.trim()) {
            navigate(`/fanfics?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const closePanel = () => setIsCategoryOpen(false);

    return (
        <>
            <header className="header">
                <div className="header_left">
                    <Menu size={32} className="icon" />
                    <button
                        className={`header_btn ${isCategoryOpen ? 'active' : ''}`}
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    >
                        Категорії
                        <ChevronDown size={16} className={isCategoryOpen ? 'rotate' : ''} />
                    </button>
                </div>

                <div className="header_center">
                    <div className="search_box">
                        <input
                            type="text"
                            placeholder="Пошук..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <Search
                        size={28}
                        className="icon"
                        onClick={handleSearch}
                    />
                </div>

                <div className="header_right">
                    {isLoggedIn ? (
                        <>
                            <Feather size={24} className="icon" />

                            <Sparkles size={24} className="icon" />

                            <div
                                className="avatar"
                                onClick={() => navigate(`/profile/${user.username}`)}
                            >
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.username} />
                                ) : (
                                    <User size={24} className="icon" />
                                )}
                            </div>

                            <LogOut
                                size={24}
                                className="icon"
                                onClick={handleLogout}
                                title="Вийти"
                            />
                        </>
                    ) : (
                        <>
                            <button
                                className="header_btn"
                                onClick={() => navigate("/register")}
                            >
                                Зареєстуватися
                            </button>

                            <button
                                className="header_btn primary"
                                onClick={() => navigate("/login")}
                            >
                                Увійти
                            </button>
                        </>
                    )}
                </div>
            </header>

            {isCategoryOpen && <div className="overlay" onClick={closePanel} />}

            <div className={`category-dropdown ${isCategoryOpen ? 'open' : ''}`}>
                <CategoryPanel onSelect={closePanel} />
            </div>
        </>
    );
}
