import { useParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/auth.store";
import { useUserStore } from "@/features/users/users.store";
import { getUserByUsername } from "@/features/users/api";
import { getMe } from "@/features/auth/api";
import { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";

export default function ProfilePage() {
    const { username } = useParams();
    const authUser = useAuthStore((s) => s.user);

    /**
     * Якщо:
     * 1) username немає → /profile
     * 2) username === authUser.username → мій профіль
     */
    const isMe = !username || username === authUser?.username;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = isMe
                    ? await getMe()
                    : await getUserByUsername(username);

                setUser(response.data);
            } catch (err) {
                setError("Користувача не знайдено");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [username, isMe]);

    if (loading) return <div>Завантаження профілю...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return null;

    return (
        <div className="profile-page">
            <ProfileHeader user={user} isMe={isMe} />

            {/* Тут далі */}
            {/* <ProfileTabs userId={user.id} /> */}
            {/* fanfics / likes / bookmarks */}
        </div>
    );
}
