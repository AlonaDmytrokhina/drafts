import { useFanficsStore } from "@/features/fanfics/fanfics.store";
import "@/styles/components/CategoryPanel.css";
import { useNavigate, useLocation } from "react-router-dom";


const GENRES = [
    { id: 1, name: 'Romance' },
    { id: 2, name: 'Fantasy' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Horror' },
    { id: 1, name: 'Romance' },
    { id: 2, name: 'Fantasy' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Horror' },
    { id: 1, name: 'Romance' },
    { id: 2, name: 'Fantasy' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Horror' }
];

export const CategoryPanel = ({ onSelect }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const selectedTagsId = useFanficsStore((s) => s.selectedTagsId);
    const setTags = useFanficsStore((s) => s.setTags);
    const resetFanfics = useFanficsStore((s) => s.resetFanfics);

    const isFanficPath = () => {
        return currentPath === '/fanfics';
    }

    const handleSelect = (ids) => {
        if(!isFanficPath()){
            navigate('/fanfics');
        }
        setTags(ids);
        if (onSelect) onSelect();
    };

    return (
        <nav className="category-panel">
            <div className="category-panel_container">
                <button
                    className={`category-item ${selectedTagsId.length === 0 && isFanficPath() ? 'active' : ''}`}
                    onClick={() => handleSelect([])}
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