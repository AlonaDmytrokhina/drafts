import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCreateFicStore } from "@/features/fanfics/createFanfic.store";

export default function EditFanficPage() {
    const { id } = useParams();
    const { formData, updateField, loadFicData, submitUpdate } = useCreateFicStore();

    useEffect(() => {
        const fetchFic = async () => {
            const response = await fetch(`/api/fanfics/${id}`);
            const data = await response.json();
            loadFicData(data);
        };
        fetchFic();
    }, [id]);

    return (
        <div className="create-fic-container">
            <h1>Редагування: {formData.title}</h1>
            <form onSubmit={}>

                <section className="form-section">
                    <h3>Основна інформація</h3>
                    <input
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                    />
                    <textarea
                        value={formData.summary}
                        onChange={(e) => updateField("summary", e.target.value)}
                    />
                </section>
                <button type="submit" className="btn-primary">Зберегти зміни</button>
            </form>
        </div>
    );
}