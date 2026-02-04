import "@/styles/components/FicCard.css";
import {
    relationshipIcons,
    statusIcons
} from "./ficIcons";
import { normalizeIcons } from "@/utils/normalize.js";


export const FicCard = ({ fanfic }) => {
    const { image_url, title, author, summary, tags, status, rating, warnings, relationship, pages } = fanfic;

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
                    <h3 className="fic-card_title">{title}</h3>
                    <p className="fic-card_author">
                        by <span>{author?.username || 'Unknown'}</span>
                    </p>
                </div>

                <div className="fic-card_stats">
                    <span className={`badge badge-rating-${rating}`}
                          title={`Рейтинг: ${rating}`}
                    >
                          {ratingIcon}
                    </span>

                    {RelationshipIcon && (
                        <span className={`badge badge-relationship-${relationship}`}
                              title={`Стосунки: ${relationship}`}
                        >
                          <RelationshipIcon size={16} />
                        </span>
                    )}

                    {StatusIcon && (
                        <span className={`badge badge-status-${status} tooltip`}
                              title={`Статус: ${status}`}
                        >
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
            </div>
        </article>
    );
};