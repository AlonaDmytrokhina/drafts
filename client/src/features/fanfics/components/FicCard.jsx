import {Heart, Bookmark, Feather} from "lucide-react";
import "@/styles/components/FicCard.css";
import "@/styles/components/Actions.css";
import { useAuthStore } from "@/features/auth/auth.store";
import { relationshipIcons, statusIcons } from "@/utils/ficIcons";
import { normalizeIcons } from "@/utils/normalize.js";
import {Link, useNavigate} from "react-router-dom";

export const FicCard = ({ fanfic, onLike, onBookmark }) => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isLoggedIn = !!user;
    const isMe = isLoggedIn && user.id === fanfic.author.id;

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!isLoggedIn) return;
        await onLike(fanfic.id);
    };

    const handleBookmark = async (e) => {
        e.stopPropagation();
        if (!isLoggedIn) return;
        await onBookmark(fanfic.id);
    };

    const ratingIcon = fanfic.rating?.charAt(0).toUpperCase() || '?';
    const RelationshipIcon = relationshipIcons[normalizeIcons(fanfic.relationship)];
    const StatusIcon = statusIcons[normalizeIcons(fanfic.status)];

    return (
        <article className="fic-card">
            <div className="fic-card_image">
                <img
                    src={`http://localhost:5000${fanfic.image_url}` || "http://localhost:5000/uploads/images/test.avif"}
                    alt={fanfic.title}
                    onError={(e) => {
                        e.currentTarget.src = "http://localhost:5000/uploads/images/test.avif";
                    }}
                    onClick={() => navigate(`/fanfics/${fanfic.id}`)}
                />
            </div>

            <div className="fic-card_content">
                <div className="fic-card_header" onClick={() => navigate(`/fanfics/${fanfic.id}`)}>
                    <h3 className="fic-card_title">{fanfic.title}</h3>
                    <p className="fic-card_author" onClick={(e) => e.stopPropagation()}>
                        by <span onClick={() => navigate(`/profile/${fanfic.author?.username}`)}>
                            {fanfic.author?.username || 'Unknown'}
                        </span>
                    </p>
                </div>

                <div className="fic-card_stats">
                    <span className={`badge badge-rating-${fanfic.rating}`} title={`Рейтинг: ${fanfic.rating}`}>
                          {ratingIcon}
                    </span>

                    {RelationshipIcon && (
                        <span className={`badge badge-relationship-${fanfic.relationship}`} title={`Стосунки: ${fanfic.relationship}`}>
                          <RelationshipIcon size={16} />
                        </span>
                    )}

                    {StatusIcon && (
                        <span className={`badge badge-status-${fanfic.status} tooltip`} title={`Статус: ${fanfic.status}`}>
                          <StatusIcon size={16} />
                        </span>
                    )}
                </div>

                {!!fanfic.tags?.length && (
                    <div className="fic-card_tags">
                        {fanfic.tags.map(tag => (
                            <span key={tag.id} className="fic-card_tag">#{tag.name}</span>
                        ))}
                    </div>
                )}

                {fanfic.summary && <p className="fic-card_summary">{fanfic.summary}</p>}

                <div className="fic-card_footer">
                    <span className="warnings-text">{fanfic.warnings}</span>
                </div>

                <div className="fic-card_actions">
                    <button
                        disabled={!isLoggedIn}
                        onClick={handleLike}
                        className={`action-btn btn-like ${fanfic.isLiked ? "active" : ""}`}
                        title={!isLoggedIn ? "Увійдіть, щоб ставити лайки" : "Лайк"}
                    >
                        <Heart
                            size={25}
                            fill={fanfic.isLiked ? "currentColor" : "none"}
                        />
                    </button>

                    <button
                        disabled={!isLoggedIn}
                        onClick={handleBookmark}
                        className={`action-btn btn-bookmark ${fanfic.isBookmarked ? "active" : ""}`}
                        title={!isLoggedIn ? "Увійдіть, щоб зберігати фанфіки" : "Зберегти"}
                    >
                        <Bookmark
                            size={25}
                            fill={fanfic.isBookmarked ? "currentColor" : "none"}
                        />
                    </button>

                    {isMe &&
                        <Link
                            key={fanfic.id}
                            to={`/fanfics/${fanfic.id}/chapters/new`}
                            disabled={!isLoggedIn}
                        >
                            <button
                                className={`action-btn btn-feather`}
                                title={"Новий розділ"}
                            >
                                <Feather
                                    size={25}
                                />
                            </button>
                        </Link>
                    }
                </div>
            </div>
        </article>
    );
};