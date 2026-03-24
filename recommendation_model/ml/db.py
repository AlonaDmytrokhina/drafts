from sqlalchemy import create_engine
import pandas as pd

engine = create_engine('postgresql://postgres:<user_name>@localhost:5432/<database_name>')

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


def get_users_cluster(user_id):
    query = """
            SELECT id, preference_cluster
            FROM users
            WHERE id = %s \
            """

    df = pd.read_sql(query, engine, params=(user_id,))
    return df


def load_test(ids):

    ids = [int(i) for i in ids]

    query = """
            SELECT id, cluster
            FROM fanfics
            WHERE id = ANY(%s) \
            """

    df = pd.read_sql(query, engine, params=(ids,))
    return df