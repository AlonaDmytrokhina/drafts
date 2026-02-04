import "../../../styles/components/FanficList.css";
import { useEffect, useState } from "react";
import { getFanfics } from "../api";
import { FicCard } from "../fanficCard/FicCard";

export default function FanficList() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getFanfics()
            .then(res => setList(res.data))
            .catch(() => setError("Failed to load fanfics"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="fanfic-list">
            {list.map(fanfic => (
                <FicCard key={fanfic.id} fanfic={fanfic} />
            ))}
        </section>
    );
}
