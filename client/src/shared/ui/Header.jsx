import "@/styles/components/Header.css";
import { Search, Menu } from "lucide-react";

export default function Header() {
    return (
        <header className="header">
            <div className="header_left">
                {/*<span className="logo"><span>D</span>rafts</span>*/}
                <Menu size={32} className="icon"/>
                <button className="header_btn">Категорії</button>
            </div>

            <div className="header_center">
                <div className="search_box">
                    <input type="text" placeholder="Пошук..." />
                </div>
                <Search size={24} className="icon"/>
            </div>

            <div className="header_right">
                <button className="header_btn">Зареєстуватися</button>
                <button className="header_btn">Увійти</button>
                {/*<div className="avatar">A</div>*/}
            </div>
        </header>
    );
}
