import { useParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/auth.store";
import { getUserByUsername } from "@/features/users/api";
import { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";

export default function ProfilePage() {
    const { username } = useParams();
    const authUser = useAuthStore((s) => s.user);
    const authLoading = useAuthStore((s) => s.loading);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isMe = !!authUser && (!username || username === authUser.username);

    useEffect(() => {
        if (authLoading) return;

        if (isMe) {
            setUser(authUser);
            setLoading(false);
            return;
        }

        getUserByUsername(username)
            .then(r => setUser(r.data))
            .catch(() => setError("Користувача не знайдено"))
            .finally(() => setLoading(false));
    }, [username, isMe, authUser, authLoading]); // додали authLoading у залежності


    if (loading) return <div>Завантаження профілю...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return null;

    return (
        <div className="profile-page">
            <ProfileHeader user={user} isMe={isMe} />
            {/* <ProfileTabs userId={user.id} /> */}
        </div>
    );
}