import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "@/styles/components/Filters.css";

export const FanficFilters = ({ availableTags = [] }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

    useEffect(() => {
        setSearchValue(searchParams.get("q") || "");
    }, [searchParams]);

    const updateFilter = (name, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (!value || value === "all") {
            newParams.delete(name);
        } else {
            newParams.set(name, value);
        }

        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    return (
        <aside className="filters-sidebar">
            <div className="filter-group">
                <label>Рейтинг</label>
                <select
                    value={searchParams.get("rating") || "all"}
                    onChange={(e) => updateFilter("rating", e.target.value)}
                >
                    <option value="all">Усі</option>
                    <option value="General">Підходить для всіх</option>
                    <option value="Teen">Підлітки та дорослі</option>
                    <option value="Mature">Доросла аудиторія</option>
                    <option value="Expli">Чутливий контент</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Статус</label>
                <select
                    value={searchParams.get("status") || "all"}
                    onChange={(e) => updateFilter("status", e.target.value)}
                >
                    <option value="all">Усі</option>
                    <option value="Ongoing">У процесі</option>
                    <option value="Completed">Завершено</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Стосунки</label>
                <select
                    value={searchParams.get("relationship") || "all"}
                    onChange={(e) => updateFilter("relationship", e.target.value)}
                >
                    <option value="all">Усі</option>
                    {
                        [
                            { id: "gen", value: "Gen", label: "Без стосунків" },
                            { id: "f/m", value: "F/M", label: "Гет" },
                            { id: "m/m", value: "M/M", label: "Слеш" },
                            { id: "f/f", value: "F/F", label: "Фемслеш" },
                            { id: "multi", value: "Multi", label: "Різні стосунки" },
                            { id: "other", value: "Other", label: "Інше" }
                        ].map((opt) => (
                            <option value={opt.value}>{opt.label}</option>
                        ))
                    }
                </select>
            </div>

            <button
                className="button-orange"
                onClick={() => {
                    setSearchParams({});
                    setSearchValue("");
                }}
            >
                Скинути все
            </button>
        </aside>
    );
};