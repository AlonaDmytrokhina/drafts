import { deleteMe } from "@/features/users/api";
import { useAuthStore } from "@/features/auth/auth.store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import EditProfileModal from "@/features/users/components/EditProfileModal";

export default function ProfileHeader({ user, isMe }) {
    const defaultAvatar = "http://localhost:5000/uploads/images/testProfile.jpg";

    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const handleDelete = () => {
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleteOpen(false);
        const success = await deleteMe();
        if (success) {
            logout();
            navigate("/");
        } else {
            alert("Помилка видалення");
        }
    };

    return (
        <div className="profile-header">
            <div className="avatar-container">
                <img
                    src={"http://localhost:5000"+user.avatar_url || defaultAvatar}
                    alt={user.username}
                    className="profile-avatar"
                    onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                />

                <div className="profile-buttons">
                    {isMe ? (
                        <button
                            className="btn-action button-yellow"
                            onClick={() => setIsUpdateOpen(true)}
                        >
                            Редагувати
                        </button>
                    ) : (
                        <button className="btn-action button-yellow">
                            Підписатися
                        </button>
                    )}

                    {isMe && (
                        <button
                            className="btn-action button-orange"
                            onClick={handleDelete}
                        >
                            Видалити
                        </button>
                    )}
                </div>
            </div>

            <div className="profile-info">
                <h2>{user.username}</h2>
                {user.bio ? (
                    <p className="profile-bio">{user.bio}</p>
                ) : (
                    <p className="profile-bio" style={{ fontStyle: "italic" }}>
                        Опис профілю відсутній
                    </p>
                )}
            </div>

            <ConfirmModal
                isOpen={isDeleteOpen}
                message="Ви впевнені, що хочете видалити профіль?"
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteOpen(false)}
            />

            <EditProfileModal
                user={user}
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
            />
        </div>
    );
}