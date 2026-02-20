import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Bookmark, Feather } from "lucide-react";
import "@/styles/components/FicPage.css";
import "@/styles/components/Actions.css";
import {useAuthStore} from "@/features/auth/auth.store";
import {useFanficPageStore} from "@/features/fanfics/fanficPage.store";

export default function FanficPage() {
    const { id } = useParams();
    const { currentFic, loading, error, fetchFanficById, clearCurrentFic, toggleLike, toggleBookmark } = useFanficPageStore();
    const user = useAuthStore((s) => s.user);
    const isLoggedIn = !!user;

    useEffect(() => {
        fetchFanficById(id);
        return () => clearCurrentFic();
    }, [id]);

    if (loading) return <div className="loader">Завантаження...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!currentFic) return null;

    const isMe = isLoggedIn && user.id === currentFic.author.id;

    const handleLike = async () => {
        if (!isLoggedIn) return;
        await toggleLike(currentFic.id);
    };

    const handleBookmark = async () => {
        if (!isLoggedIn) return;
        await toggleBookmark(currentFic.id);
    };

    return (
        <div className="fic-page-container">
            <header className="fic-page_header">
                <div className="fic-page_image">
                    <img
                        src={`http://localhost:5000${currentFic.image_url}` || "http://localhost:5000/uploads/images/test.avif"}
                        alt={currentFic.title}
                        onError={(e) => {
                            e.currentTarget.src = "http://localhost:5000/uploads/images/test.avif";
                        }}
                    />
                </div>

                <div className="fic-page_main-info">
                    <h1 className="fic-page_title">{currentFic.title}</h1>
                    <p className="fic-page_author">
                        Автор: <Link to={`/profile/${currentFic.author.username}`}>{currentFic.author.username}</Link>
                    </p>

                    <div className="fic-card_actions">
                        <button
                            disabled={!isLoggedIn}
                            onClick={handleLike}
                            className={`action-btn btn-like ${currentFic.isLiked ? "active" : ""}`}
                            title={!isLoggedIn ? "Увійдіть, щоб ставити лайки" : "Лайк"}
                        >
                            <Heart
                                size={30}
                                fill={currentFic.isLiked ? "currentColor" : "none"}
                            />
                        </button>

                        <button
                            disabled={!isLoggedIn}
                            onClick={handleBookmark}
                            className={`action-btn btn-bookmark ${currentFic.isBookmarked ? "active" : ""}`}
                            title={!isLoggedIn ? "Увійдіть, щоб зберігати фанфіки" : "Зберегти"}
                        >
                            <Bookmark
                                size={30}
                                fill={currentFic.isBookmarked ? "currentColor" : "none"}
                            />
                        </button>

                        {isMe &&
                            <Link
                                key={currentFic.id}
                                to={`/fanfics/${id}/chapters/new`}
                                disabled={!isLoggedIn}
                            >
                                <button
                                    className={`action-btn btn-feather`}
                                    title={"Новий розділ"}
                                >
                                    <Feather
                                        size={30}
                                    />
                                </button>
                            </Link>
                        }
                    </div>
                </div>
            </header>

            <section className="fic-page_metadata">
                <div className="meta-grid">
                    <span><strong>Рейтинг:</strong> {currentFic.rating}</span>
                    <span><strong>Статус:</strong> {currentFic.status}</span>
                    <span><strong>Слів:</strong> {currentFic.words_count}</span>
                    <span><strong>Оновлено:</strong> {new Date(currentFic.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="fic-page_tags">
                    {currentFic.tags?.map(tag => (
                        <span key={tag.id} className="tag-badge">#{tag.name}</span>
                    ))}
                </div>
            </section>

            <section className="fic-page_summary">
                <h2>Опис</h2>
                <p>{currentFic.summary}</p>
            </section>

            <section className="fic-page_chapters">
                <h2>Зміст ({currentFic.chapters?.length || 0})</h2>
                <div className="chapters-list">
                    {currentFic.chapters?.map((chapter) => (
                        <Link
                            key={chapter.id}
                            to={`/fanfics/${id}/chapters/${chapter.id}`}
                            className="chapter-item"
                        >
                            <span className="chapter-number">{chapter.position}.</span>
                            <span className="chapter-title">{chapter.title}</span>
                            <span className="chapter-date">{new Date(chapter.created_at).toLocaleDateString()}</span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}