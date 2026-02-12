import { useFanficsStore } from "@/features/fanfics/fanfics.store";
import "@/styles/components/CategoryPanel.css";

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
    const selectedTagsId = useFanficsStore((s) => s.selectedTagsId);
    const setTags = useFanficsStore((s) => s.setTags);

    const handleSelect = (ids) => {
        setTags(ids);
        if (onSelect) onSelect();
    };

    return (
        <nav className="category-panel">
            <div className="category-panel_container">
                <button
                    className={`category-item ${selectedTagsId.length === 0 ? 'active' : ''}`}
                    onClick={() => handleSelect([])}
                >
                    Усі
                </button>
                {GENRES.map((tag) => (
                    <button
                        key={tag.id}
                        className={`category-item ${selectedTagsId.includes(tag.id) ? 'active' : ''}`}
                        onClick={() => handleSelect([tag.id])}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </nav>
    );
};