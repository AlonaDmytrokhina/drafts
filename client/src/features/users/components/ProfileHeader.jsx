export default function ProfileHeader({ user, isMe }) {
    const defaultAvatar = "http://localhost:5000/uploads/images/testProfile.jpg";

    return (
        <div className="profile-header">
            <div className="avatar-container">
                <img
                    src={user.avatar_url || defaultAvatar}
                    alt={user.username}
                    className="profile-avatar"
                    onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                />

                {isMe ? (
                    <button className="btn-action button-yellow">
                        Редагувати профіль
                    </button>
                ) : (
                    <button className="btn-action button-outline">
                        Підписатися
                    </button>
                )}
            </div>

            <div className="profile-info">
                <h2>{user.username}</h2>
                {user.bio ? (
                    <p className="profile-bio">{user.bio}</p>
                ) : (
                    <p className="profile-bio" style={{fontStyle: 'italic'}}>Опис профілю відсутній</p>
                )}
            </div>
        </div>
    );
}