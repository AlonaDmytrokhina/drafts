import "@/styles/components/CreateFic.css";

export default function CreationFields({formData, updateField, addTag, removeTag, toggleWarning}) {

    return (
                <section className="form-section">
                    <h3>Теги та класифікація</h3>

                    <div className="form-group">
                        <label>Рейтинг</label>
                        <select
                            value={formData.rating}
                            onChange={(e) => updateField("rating", e.target.value)}
                        >
                            <option value="General">Будь-яка аудиторія</option>
                            <option value="Teen">Підлітки та дорослі</option>
                            <option value="Mature">Доросла аудиторія</option>
                            <option value="Explicit">Чутливий контент</option>
                        </select>
                    </div>

                    <div className="form-group radio-group">
                        <label>Категорії</label>
                        {[
                            { id: "gen", value: "Gen", label: "Без стосунків" },
                            { id: "f/m", value: "F/M", label: "Гет" },
                            { id: "m/m", value: "M/M", label: "Слеш" },
                            { id: "f/f", value: "F/F", label: "Фемслеш" },
                            { id: "multi", value: "Multi", label: "Різні стосунки" },
                            { id: "other", value: "Other", label: "Інше" }
                        ].map((opt) => (
                            <label key={opt.id} className="radio-label">
                                <input
                                    type="radio"
                                    name="relationship"
                                    value={opt.value}
                                    checked={formData.relationship === opt.value}
                                    onChange={(e) => updateField("relationship", e.target.value)}
                                />
                                <span className="radio-custom"></span>
                                {opt.label}
                            </label>
                        ))}
                    </div>

                    <div className="form-group radio-group">
                        <label>Попередження</label>
                        {[
                            { id: "violence", value: "Violence", label: "Жорстокість" },
                            { id: "char_death", value: "Character Death", label: "Смерть персонажа" },
                        ].map((opt) => (
                            <label key={opt.id} className="radio-label">
                                <input
                                    type="checkbox"
                                    name="warnings"
                                    value={opt.value}
                                    checked={formData.warnings.split(", ").includes(opt.value)}
                                    onChange={() => toggleWarning(opt.value)}
                                />
                                <span className="radio-custom"></span>
                                {opt.label}
                            </label>
                        ))}
                    </div>

                    <div className="form-group">
                        <label>Фандом</label>
                        <input
                            placeholder="Введіть назву та натисніть Enter"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    e.preventDefault();
                                    addTag("Fandom", e.target.value.trim());
                                    e.target.value = "";
                                }
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Персонажі</label>
                        <input
                            placeholder="Введіть ім'я та натисніть Enter"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    e.preventDefault();
                                    addTag("Character", e.target.value.trim());
                                    e.target.value = "";
                                }
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Стосунки</label>
                        <input
                            placeholder="Введіть імена та натисніть Enter"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    e.preventDefault();
                                    addTag("Relationship", e.target.value.trim());
                                    e.target.value = "";
                                }
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Додаткові теги</label>
                        <input
                            placeholder="Введіть та натисніть Enter"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    e.preventDefault();
                                    addTag("Additional", e.target.value.trim());
                                    e.target.value = "";
                                }
                            }}
                        />
                    </div>
                    <div className="tag-list">
                        {formData.tags.map(tag => (
                            <span key={tag.name} className="tag-item" onClick={() => removeTag(tag.name)}>
                                <small>{tag.type}:</small> {tag.name} ×
                            </span>
                        ))}
                    </div>
                </section>

    );
}