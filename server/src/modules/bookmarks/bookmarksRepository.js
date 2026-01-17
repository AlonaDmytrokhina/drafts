import "dotenv/config";
import { pool } from "../../config/db.js";

export const createBookmark = async (fanficId, userId) => {
    const query = `
        INSERT INTO bookmarks (fanfic_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (fanfic_id, user_id) DO NOTHING
        RETURNING *
    `;

    const { rows } = await pool.query(query, [fanficId, userId]);
    return rows[0] ?? null;
};

export const deleteBookmark = async (fanficId, userId) => {
    const query = `
        DELETE FROM bookmarks WHERE fanfic_id = $1 AND user_id = $2
    `;

    const { rows } = await pool.query(query, [fanficId, userId]);
    return rows[0];
};

export const isFanficBookmarkedByUser = async (fanficId, userId) => {
    const query = `
        SELECT EXISTS (
            SELECT 1
            FROM bookmarks
            WHERE fanfic_id = $1 AND user_id = $2
        ) AS bookmarked
    `;

    const { rows } = await pool.query(query, [fanficId, userId]);
    return rows[0].liked;
};

export const getUserBookmarks = async (userId) => {
    const query = `
        SELECT
            f.*
        FROM bookmarks b
                 JOIN fanfics f ON f.id = b.fanfic_id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    return rows;
};

