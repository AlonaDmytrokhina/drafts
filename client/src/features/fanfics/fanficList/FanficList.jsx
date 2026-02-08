import "../../../styles/components/FanficList.css";
import { useEffect } from "react";
import { FicCard } from "../fanficCard/FicCard";
import { useFanficsStore } from "../fanfics.store";

export default function FanficList() {
    const { list, loading, error, fetchFanfics } = useFanficsStore();

    useEffect(() => {
        fetchFanfics();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="fanfic-list">
            {list.map((fanfic) => (
                <FicCard key={fanfic.id} fanfic={fanfic} />
            ))}
        </section>
    );
}
