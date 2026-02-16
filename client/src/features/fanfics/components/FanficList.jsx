import "../../../styles/components/FanficList.css";
import { useEffect } from "react";
import { FicCard } from "./FicCard";
import { useFanficsStore } from "../fanfics.store";
import {useAuthStore} from "@/features/auth/auth.store";
import {useSearchParams} from "react-router-dom";
import {Pagination} from "@/shared/ui/Pagination";

export default function FanficList() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const { list, loading, error, fetchFanfics, currentPage, totalPages, setSearch, resetFanfics } = useFanficsStore();

    useEffect(() => {
        setSearch(query);
        fetchFanfics(1);
        return () => resetFanfics();
    }, [query, setSearch, fetchFanfics, resetFanfics]);

    const toggleLike = useFanficsStore((s) => s.toggleLike);
    const toggleBookmark = useFanficsStore((s) => s.toggleBookmark);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="FancList">
            <section className="fanfic-list">
                {list.map((fanfic) => (
                    <FicCard key={fanfic.id} fanfic={fanfic} onLike={toggleLike} onBookmark={toggleBookmark} />
                ))}
            </section>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchFanfics(page)}
                loading={loading}
            />
        </div>

    );
}
