from sqlalchemy import create_engine
import pandas as pd
DB_URL = "postgresql://postgres:winx1708@localhost:5432/drafts_db"

engine = create_engine('postgresql://postgres:winx1708@localhost:5432/drafts_db')

def load_data():

    query = """
            SELECT
                u.id as user_id,
                f.id as fanfic_id,
                (
                    CASE WHEN r.read_time > 0 THEN 1 ELSE 0 END
                        + CASE WHEN l.user_id IS NOT NULL THEN 2 ELSE 0 END
                        + CASE WHEN b.user_id IS NOT NULL THEN 3 ELSE 0 END
                        + CASE WHEN EXISTS (
                        SELECT 1
                        FROM comments c
                                 JOIN chapters ch ON ch.id = c.chapter_id
                        WHERE ch.fanfic_id = f.id
                          AND c.user_id = u.id
                    ) THEN 4 ELSE 0 END
                    ) as score
            FROM reading_history r
                     JOIN users u ON u.id = r.user_id
                     JOIN fanfics f ON f.id = r.fanfic_id
                     LEFT JOIN likes l
                               ON l.user_id = u.id AND l.fanfic_id = f.id
                     LEFT JOIN bookmarks b
                               ON b.user_id = u.id AND b.fanfic_id = f.id \
            """

    df = pd.read_sql(query, engine)
    df['score'] = df['score'] / df['score'].max()

    return df