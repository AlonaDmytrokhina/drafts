import { useState } from "react";
import { updateMe } from "@/features/users/api";
import { useAuthStore } from "@/features/auth/auth.store";
import "@/styles/components/EditProfileModal.css";
import "@/styles/components/CreateFic.css";

export default function EditProfileModal({ user, isOpen, onClose }) {
    const updateUser = useAuthStore((s) => s.updateUser);

    const [bio, setBio] = useState(user.bio || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("bio", bio);

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const res = await updateMe(formData);

            updateUser(res.data);
            onClose();
        } catch {
            alert("Помилка оновлення");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <h3>Редагування профілю</h3>

                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Опис профілю"
                />

                <div className="form-group">
                    <label className="file-upload-label">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatarFile(e.target.files[0])}
                            hidden
                        />
                        <div className="upload-placeholder">
                            {avatarFile
                                ? `Вибрано: ${avatarFile.name}`
                                : "Натисніть, щоб вибрати аватар"}
                        </div>
                    </label>
                </div>

                <div className="modal-buttons">
                    <button onClick={handleSave} disabled={loading} className="button-yellow">
                        {loading ? "Збереження..." : "Зберегти"}
                    </button>
                    <button onClick={onClose} className="button-yellow">Скасувати</button>
                </div>
            </div>
        </div>
    );
}