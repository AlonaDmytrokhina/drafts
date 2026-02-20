import "@/styles/components/CreateFic.css";

export default function FicInfo({ formData, updateField, coverFile, setCoverFile }) {

    return (
        <div>
            <section className="form-section">
                <h3>Основна інформація</h3>
                <div className="form-group">
                    <label>Назва</label>
                    <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Опис (Summary)</label>
                    <textarea
                        rows="5"
                        value={formData.summary}
                        onChange={(e) => updateField("summary", e.target.value)}
                    />
                </div>
            </section>

            <section className="form-section">
                <h3>Обкладинка</h3>
                <div className="form-group">
                    <label className="file-upload-label">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverFile(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                        <div className="upload-placeholder">
                            {coverFile ? `Вибрано: ${coverFile.name}` : "Натисніть, щоб вибрати обкладинку"}
                        </div>
                    </label>
                    {coverFile && (
                        <button type="button" onClick={() => setCoverFile(null)} className="btn-remove-file">
                            Видалити файл
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}