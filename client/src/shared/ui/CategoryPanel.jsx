import { useFanficsStore } from "@/features/fanfics/fanfics.store";
import "@/styles/components/CategoryPanel.css";
import {useNavigate, useLocation, useSearchParams} from "react-router-dom";


const GENRES = [
    { id: 76, name: 'Наруто' },
    { id: 54, name: 'Драма' },
    { id: 117, name: 'Флаф' },
    { id: 52, name: 'Ангст' },
    { id: 86, name: 'Undertale' },
    { id: 71, name: 'Подорож у часі' },
    { id: 93, name: 'AU' },
    { id: 107, name: 'Оріджинал' },
    { id: 96, name: 'Аватар Аанг' },
    { id: 20, name: 'Щасливий фінал' },
    { id: 61, name: 'Гаррі Поттер' },
    { id: 74, name: 'Магія' }
];

export const CategoryPanel = ({ onSelect }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const selectedTagsId = useFanficsStore((s) => s.selectedTagsId);
    const setTags = useFanficsStore((s) => s.setTags);
    const resetFanfics = useFanficsStore((s) => s.resetFanfics);

    const [searchParams, setSearchParams] = useSearchParams();
    const isFanficPath = () => {
        return currentPath === '/fanfics';
    }

    const selectedTagsFromUrl = searchParams.getAll("tag").map(Number);

    const handleSelect = (id) => {
        const newParams = new URLSearchParams(searchParams);

        if (id === null) {
            newParams.delete("tag");
        } else {
            newParams.delete("tag");
            newParams.set("tag", id);
        }

        newParams.set("page", "1");

        if (!isFanficPath()) {
            navigate(`/fanfics?${newParams.toString()}`);
        } else {
            setSearchParams(newParams);
        }

        if (onSelect) onSelect();
    };

    return (
        <nav className="category-panel">
            <div className="category-panel_container">
                <button
                    className={`category-item ${selectedTagsId.length === 0 && isFanficPath() ? 'active' : ''}`}
                    onClick={() => handleSelect(null)}
                >
                    Усі
                </button>
                {GENRES.map((tag) => (
                    <button
                        key={tag.id}
                        className={`category-item ${selectedTagsId.includes(tag.id) && isFanficPath() ? 'active' : ''}`}
                        onClick={() => handleSelect([tag.id])}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </nav>
    );
};