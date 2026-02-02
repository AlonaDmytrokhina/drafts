export const FicCard = ({ fanfic }) => {
    const { title, author, summary, tags, status } = fanfic;

    return (
        <article className="fic-card">
            <h3 className="fic-card__title">{title}</h3>

            <p className="author">
                by <span>{author.username}</span>
            </p>

            {summary && <p className="summary">{summary}</p>}

            {!!tags?.length && (
                <div className="tags">
                    {tags.map(tag => (
                        <span key={tag.id} className="tag">
              #{tag.name}
            </span>
                    ))}
                </div>
            )}

            <button className="button-green">
                test
            </button>
            <footer className="meta">
        <span className={`status status-${status}`}>
          {status}
        </span>
            </footer>
        </article>
    );
};
