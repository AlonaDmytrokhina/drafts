import { useCreateFicStore } from "@/features/fanfics/createFanfic.store";
import { useNavigate } from "react-router-dom";
import "@/styles/components/CreateFic.css";
import CreationFields from "@/features/fanfics/components/CreationFields";
import FicInfo from "@/features/fanfics/components/FicInfo";
import ChapterInfo from "@/features/chapters/components/ChapterInfo";

export default function CreateFanficPage() {
    const { formData, updateField, addTag, removeTag, submitFic, loading, error, toggleWarning, coverFile, setCoverFile, reset} = useCreateFicStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await submitFic();
        if (result) {
            reset();
            navigate(`/fanfics/${result.id}`);
        }
    };

    return (
        <div className="create-fic-container">
            <header className="create-fic_header">
                <h1>Опублікувати нову роботу</h1>
            </header>

            <form onSubmit={handleSubmit} className="create-fic_form">

                <CreationFields formData={formData}  addTag={addTag} updateField={updateField} removeTag={removeTag} toggleWarning={toggleWarning} />

                <FicInfo formData={formData} updateField={updateField} coverFile={coverFile} setCoverFile={setCoverFile}/>

                <ChapterInfo formData={formData} updateField={updateField} />

                {error && <div className="error-msg">{error}</div>}

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Публікація..." : "Опублікувати"}
                    </button>
                    {/*<button type="button" className="btn-secondary">Чернетка</button>*/}
                </div>
            </form>
        </div>
    );
}