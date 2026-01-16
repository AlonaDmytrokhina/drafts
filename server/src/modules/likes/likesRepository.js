import "dotenv/config";
import { pool } from "../../config/db.js";

export const createLike = async (fanficId, userId) => {
    const query = `
        INSERT INTO likes (fanfic_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (fanfic_id, user_id) DO NOTHING
        RETURNING *
    `;

    const { rows } = await pool.query(query, [fanficId, userId]);
    return rows[0] ?? null;
};

export const deleteLike = async (fanficId, userId) => {
    const query = `
        DELETE FROM likes WHERE fanfic_id = $1 AND user_id = $2
    `;

    const { rows } = await pool.query(query, [fanficId, userId]);
    return rows[0];
};

export const isFanficLikedByUser = async (fanficId, userId) => {
    const query = `
        SELECT EXISTS (
            SELECT 1
            FROM likes
            WHERE fanfic_id = $1 AND user_id = $2
        ) AS liked
    `;

    const { rows } = await pool.query(query, [fanficId, userId]);
    return rows[0].liked;
};


