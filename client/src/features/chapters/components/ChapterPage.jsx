import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, List } from "lucide-react"; // Іконки для зручності
import { useChapterPageStore } from "@/features/chapters/chapters.store";
import "@/styles/components/ChapterPage.css";

export default function ChapterPage() {
    const { fanficId, chapterId } = useParams();
    const {
        currentChapter, error, loading,
        fetchChapterById, clearCurrentChapter,
        getPrevChapterId, getNextChapterId
    } = useChapterPageStore();

    useEffect(() => {
        fetchChapterById(fanficId, chapterId);
        window.scrollTo(0, 0);
        return () => clearCurrentChapter();
    }, [fanficId, chapterId]);

    if (loading) return <div className="loader">Завантаження...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!currentChapter) return null;

    const prevChapterId = getPrevChapterId();
    const nextChapterId = getNextChapterId();

    return (
        <div className="chapter-page-container">
            <nav className="chapter-nav">
                <Link to={`/fanfics/${fanficId}`} className="nav-back" title="До змісту">
                    <List size={30} />
                </Link>

                <div className="nav-controls">
                    <Link
                        to={prevChapterId ? `/fanfics/${fanficId}/chapters/${prevChapterId}` : "#"}
                        className={`nav-btn-ch ${!prevChapterId ? "disabled" : ""}`}
                    >
                        <ChevronLeft size={20} /> Попередній
                    </Link>

                    <Link
                        to={nextChapterId ? `/fanfics/${fanficId}/chapters/${nextChapterId}` : "#"}
                        className={`nav-btn-ch ${!nextChapterId ? "disabled" : ""}`}
                    >
                        Наступний <ChevronRight size={20} />
                    </Link>
                </div>
            </nav>

            <header className="chapter-header">
                <h1 className="chapter-title">{currentChapter.title}</h1>
                <div className="chapter-meta">
                    <span>Розділ {currentChapter.position}</span>
                    <span className="separator">•</span>
                    <span>{new Date(currentChapter.created_at).toLocaleDateString()}</span>
                </div>
            </header>

            <article className="chapter-content">
                {currentChapter.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </article>

            <footer className="chapter-footer">
                <div className="nav-controls full-width">
                    <Link
                        to={prevChapterId ? `/fanfics/${fanficId}/chapters/${prevChapterId}` : "#"}
                        className={`nav-btn-ch wide ${!prevChapterId ? "disabled" : ""}`}
                    >
                        <ChevronLeft size={20} /> Назад
                    </Link>

                    <Link
                        to={nextChapterId ? `/fanfics/${fanficId}/chapters/${nextChapterId}` : "#"}
                        className={`nav-btn-ch wide ${!nextChapterId ? "disabled" : ""}`}
                    >
                        Далі <ChevronRight size={20} />
                    </Link>
                </div>
            </footer>
        </div>
    );
}