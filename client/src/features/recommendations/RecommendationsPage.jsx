import "@/styles/components/FanficList.css";
import { useEffect } from "react";
import { FicCard } from "@/features/fanfics/components/FicCard";

import { useRecommendationsStore } from "@/features/recommendations/recommendations.store";
import { useFanficsStore } from "@/features/fanfics/fanfics.store";
import { useAuthStore } from "@/features/auth/auth.store";


export default function RecommendationsPage() {
    const {
        recommendations,
        loading,
        error,
        fetchRecommendations,
        updateRecommendations
    } = useRecommendationsStore();

    const toggleLike = useFanficsStore((s) => s.toggleLike);
    const toggleBookmark = useFanficsStore((s) => s.toggleBookmark);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const handleLike = (id) => {
        toggleLike(id, updateRecommendations);
    };

    const handleBookmark = (id) => {
        toggleBookmark(id, updateRecommendations);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="FancList">
            <section className="fanfic-list">
                {recommendations.map((fanfic) => (
                    <FicCard
                        key={fanfic.id}
                        fanfic={fanfic}
                        onLike={handleLike}
                        onBookmark={handleBookmark}
                    />
                ))}
            </section>
        </div>
    );
}