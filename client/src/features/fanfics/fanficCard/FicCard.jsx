import { Heart, Bookmark } from "lucide-react";
import "@/styles/components/FicCard.css";
import { useFanficsStore } from "../fanfics.store";
import { useAuthStore } from "@/features/auth/auth.store";
import {
    relationshipIcons,
    statusIcons
} from "./ficIcons";
import { normalizeIcons } from "@/utils/normalize.js";
import { useNavigate } from "react-router-dom";

export const FicCard = ({ fanfic }) => {
    const navigate = useNavigate();

    const user = useAuthStore((s) => s.user);
    const isLoggedIn = !!user;

    const toggleLike = useFanficsStore((s) => s.toggleLike);
    const toggleBookmark = useFanficsStore((s) => s.toggleBookmark);

    const {
        id,
        image_url,
        title,
        author,
        summary,
        tags,
        status,
        rating,
        warnings,
        relationship,
        isLiked,
        isBookmarked,
    } = fanfic;

    const ratingIcon = rating.charAt(0).toUpperCase();
    const RelationshipIcon = relationshipIcons[normalizeIcons(relationship)];
    const StatusIcon = statusIcons[normalizeIcons(status)];

    return (
        <article className="fic-card">
            <div className="fic-card_image">
                <img src={image_url || "http://localhost:5000/uploads/images/test.avif"}
                     alt={title}
                     onError={(e) => {
                         e.currentTarget.src = "http://localhost:5000/uploads/images/test.avif";
                     }}
                />
            </div>

            <div className="fic-card_content">
                <div className="fic-card_header">
                    <h3 className="fic-card_title" onClick={() => navigate(`/fanfics/${id}`)}>{title}</h3>
                    <p className="fic-card_author">
                        by <span onClick={() => navigate(`/users/${author.username}`)}>{author?.username || 'Unknown'}</span>
                    </p>
                </div>

                <div className="fic-card_stats">
                    <span className={`badge badge-rating-${rating}`} title={`Рейтинг: ${rating}`}>
                          {ratingIcon}
                    </span>

                    {RelationshipIcon && (
                        <span className={`badge badge-relationship-${relationship}`} title={`Стосунки: ${relationship}`}>
                          <RelationshipIcon size={16} />
                        </span>
                    )}

                    {StatusIcon && (
                        <span className={`badge badge-status-${status} tooltip`} title={`Статус: ${status}`}>
                          <StatusIcon size={16} />
                        </span>
                    )}
                </div>

                {!!tags?.length && (
                    <div className="fic-card_tags">
                        {tags.map(tag => (
                            <span key={tag.id} className="fic-card_tag">#{tag.name}</span>
                        ))}
                    </div>
                )}

                {summary && <p className="fic-card_summary">{summary}</p>}

                <div className="fic-card_footer">
                    <span className="warnings-text">{warnings}</span>
                </div>


                <div className="fic-card_actions">
                    <button
                        disabled={!isLoggedIn}
                        className={`action-btn btn-like ${isLiked ? "active" : ""}`}
                        onClick={() => {
                            console.log(isLiked);
                            toggleLike(id);
                        }}
                        title={!isLoggedIn ? "Увійдіть, щоб ставити лайки" : "Лайк"}
                    >
                        <Heart size={25} />
                    </button>

                    <button
                        disabled={!isLoggedIn}
                        className={`action-btn btn-bookmark ${isBookmarked ? "active" : ""}`}
                        onClick={() => toggleBookmark(id)}
                        title={!isLoggedIn ? "Увійдіть, щоб зберігати фанфіки" : "Зберегти"}
                    >
                        <Bookmark size={25} />
                    </button>
                </div>
            </div>
        </article>
    );
};