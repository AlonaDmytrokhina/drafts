export default function ProfileHeader({ user, isMe }) {
    return (
        <div className="profile-header">
            <img src={user.avatar_url || "http://localhost:5000/uploads/images/testProfile.jpg"}
                 alt={user.username}
                 onError={(e) => {
                     e.currentTarget.src = "http://localhost:5000/uploads/images/testProfile.jpg";
                 }}
            />

            <div className="profile-info">
                <h2>{user.username}</h2>

                {user.bio && <p className="profile-bio">{user.bio}</p>}

                <div className="profile-actions">
                    {isMe ? (
                        <button className="button-yellow">
                            Редагувати профіль
                        </button>
                    ) : (
                        <button className="button-outline">
                            Підписатися
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
