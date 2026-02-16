import { useEffect, useState } from "react";
import { useUserStore } from "../users.store";
import {FicCard} from "@/features/fanfics/components/FicCard";
import {Pagination} from "@/shared/ui/Pagination";
import "@/styles/components/FanficList.css";
import {useFanficsStore} from "@/features/fanfics/fanfics.store";
import "@/styles/components/Profile.css";

export default function ProfileTabs({ username, isMe }) {
    const [activeTab, setActiveTab] = useState("my");

    const list = useUserStore((s) => s.list);
    const setList = useUserStore((s) => s.setList);
    const loading = useUserStore((s) => s.loading);
    const error = useUserStore((s) => s.error);
    const currentPage = useUserStore((s) => s.currentPage);
    const totalPages = useUserStore((s) => s.totalPages);
    const fetchUserContent = useUserStore((s) => s.fetchUserContent);
    const resetUserContent = useUserStore((s) => s.resetUserContent);

    const { toggleLike, toggleBookmark } = useFanficsStore();


    useEffect(() => {
        resetUserContent();
        fetchUserContent(username, activeTab, 1);

        return () => resetUserContent();
    }, [username, activeTab, fetchUserContent, resetUserContent]);

    const handlePageChange = (newPage) => {
        fetchUserContent(username, activeTab, newPage);
        window.scrollTo(0, 0);
    };

    const handleLike = (id) => {
        toggleLike(id, (targetId, updater) => {
            setList(list.map(f => f.id === targetId ? updater(f) : f));
        });
    };

    const handleBookmark = (id) => {
        toggleBookmark(id, (targetId, updater) => {
            setList(list.map(f => f.id === targetId ? updater(f) : f));
        });
    };


    return (
        <div className="profile-tabs">
            <div className="tabs-nav">
                <button
                    className={`tab-btn ${activeTab === "my" ? "active" : ""}`}
                    onClick={() => setActiveTab("my")}
                >
                    {(isMe && ("Мої роботи")) || ("Роботи автора")}
                </button>

                {isMe && (
                    <button
                        className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
                        onClick={() => setActiveTab("saved")}
                    >
                        Збережені
                    </button>
                )}
            </div>

            <div className="tabs-content">
                {loading && <div className="loader">Завантаження...</div>}

                {error && <div className="error-msg">{error}</div>}

                {!loading && list.length === 0 && (
                    <div className="empty-msg">Тут поки порожньо...</div>
                )}

                <div className="fanfics-list">
                    {!loading && list.map(fic => (
                        <FicCard key={fic.id} fanfic={fic} onLike={handleLike} onBookmark={handleBookmark}/>
                    ))}
                </div>

                {!loading && list.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
}