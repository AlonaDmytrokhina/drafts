import "@/styles/components/FanficList.css";
import { useEffect } from "react";
import { FicCard } from "./FicCard";
import { useFanficsStore } from "../fanfics.store";
import {useAuthStore} from "@/features/auth/auth.store";
import {useSearchParams} from "react-router-dom";
import {Pagination} from "@/shared/ui/Pagination";
import {FanficFilters} from "@/features/fanfics/components/FanficFilters";

export default function FanficList() {
    const [searchParams] = useSearchParams();

    const { list, loading, error, fetchFanfics, currentPage, totalPages, setSearch, resetFanfics, setTags } = useFanficsStore();

    useEffect(() => {
        const query = searchParams.get("q") || "";
        const tags = searchParams.getAll("tag").map(Number);
        const rating = searchParams.get("rating") || "";
        const status = searchParams.get("status") || "";
        const relationship = searchParams.get("relationship") || "";
        const page = Number(searchParams.get("page")) || 1;

        useFanficsStore.setState({
            search: query,
            selectedTagsId: tags,
            filters: { rating, status, relationship }
        });

        fetchFanfics(page);
        return () => resetFanfics();

    }, [searchParams, fetchFanfics, resetFanfics]);

    const toggleLike = useFanficsStore((s) => s.toggleLike);
    const toggleBookmark = useFanficsStore((s) => s.toggleBookmark);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="FancList">

            <FanficFilters/>

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
