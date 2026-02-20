import { useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateChapterStore } from "@/features/chapters/createChapter.store";
import ChapterInfo from "@/features/chapters/components/ChapterInfo";

export default function AddChapterPage() {
    const { fanficId } = useParams();
    const navigate = useNavigate();

    const { chapterData, updateField, submitChapter, loading, error, reset } = useCreateChapterStore();

    useEffect(() => {
        reset();
    }, [fanficId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await submitChapter(fanficId);
        if (result) {

            navigate(`/fanfics/${fanficId}/chapters/${result.data.id}`);
        }
    };

    return (
        <div className="create-fic-container">
            <header className="create-fic_header">
                <h1>Додати новий розділ</h1>
            </header>

            <form onSubmit={handleSubmit} className="create-fic_form">
                <ChapterInfo formData={chapterData} updateField={updateField}/>

                {error && <div className="error-msg">{error}</div>}

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Збереження..." : "Опублікувати розділ"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-secondary"
                    >
                        Скасувати
                    </button>
                </div>
            </form>
        </div>
    );
}