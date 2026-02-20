import "dotenv/config";
import { pool } from "../../config/db.js";

export const createTag = async ({name, type, relationship = null}) => {

    const query =
        `
            INSERT INTO tags (name, type, relationship_type)
            values ($1, $2, $3)
            RETURNING *
        `;

    const { rows } = await pool.query(query, [name, type, relationship]);
    return rows[0];
}

export const findOrCreateTag = async (client, { name, type = 'general', relationship = null }) => {
    const query = `
        INSERT INTO tags (name, type, relationship_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (name, type)
            DO UPDATE SET
            relationship_type = EXCLUDED.relationship_type
        RETURNING *;
    `;
    const { rows } = await client.query(query, [name, type, relationship]);
    return rows[0];
};

export const findTagByNameAndType = async (name, type) => {
    const res = await pool.query(
        `SELECT * FROM tags WHERE name=$1 AND type=$2`,
        [name, type]
    );
    return res.rows[0] || null;
};

export const findTagById = async (tagId) => {
    const res = await pool.query(
        `SELECT * FROM tags WHERE id=$1`,
        [tagId]
    );
    return res.rows[0] || null;
};
