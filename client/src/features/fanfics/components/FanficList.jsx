import "../../../styles/components/FanficList.css";
import { useEffect } from "react";
import { FicCard } from "./FicCard";
import { useFanficsStore } from "../fanfics.store";
import {useAuthStore} from "@/features/auth/auth.store";

export default function FanficList() {
    const { list, loading, error, fetchFanfics, currentPage, totalPages } = useFanficsStore();

    useEffect(() => {
        fetchFanfics(currentPage);
    }, [fetchFanfics]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="FancList">
            <section className="fanfic-list">
                {list.map((fanfic) => (
                    <FicCard key={fanfic.id} fanfic={fanfic} />
                ))}
            </section>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="button-orange"
                        disabled={currentPage === 1 || loading}
                        onClick={() => fetchFanfics(currentPage - 1)}
                    >
                        Назад
                    </button>

                    <span className="page-info">
                        Сторінка <strong>{currentPage}</strong> з {totalPages}
                    </span>

                    <button
                        className="button-orange"
                        disabled={currentPage === totalPages || loading}
                        onClick={() => fetchFanfics(currentPage + 1)}
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>

    );
}
