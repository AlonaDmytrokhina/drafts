import "dotenv/config";
import { pool } from "../../config/db.js";

export const createFanficTag = async (fanficId, tagId) => {
    const query =
        `
            INSERT INTO fanfics_tags (fanfic_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            RETURNING *
        `;

    const { rows } = await pool.query(query, [fanficId, tagId]);
    return rows[0] || null;
}


export const deleteFanficTag = async (fanficId, tagId) => {
    const query =
        `
            DELETE FROM fanfics_tags 
            WHERE fanfic_id = $1 AND tag_id = $2
            RETURNING *
        `;

    const { rows } = await pool.query(query, [fanficId, tagId]);
    return rows[0] || null;
}