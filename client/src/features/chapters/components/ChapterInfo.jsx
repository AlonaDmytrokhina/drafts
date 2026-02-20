import "@/styles/components/CreateFic.css";

export default function ChapterInfo({formData, updateField}) {

    return (
        <section className="form-section">
            <div className="form-group">
                <label>Назва нового розділу</label>
                <input
                    required
                    type="text"
                    value={formData.chapterTitle}
                    onChange={(e) => updateField("chapterTitle", e.target.value)}
                />

                <label>Текст нового розділу</label>
                <textarea
                    required
                    className="content-editor"
                    placeholder="Ваша історія починається тут..."
                    value={formData.content}
                    onChange={(e) => updateField("content", e.target.value)}
                />
            </div>
        </section>
    );
}