import "dotenv/config";
import { pool } from "../../config/db.js";

export const createTag = async ({name, type}) => {
    const query =
        `
            INSERT INTO tags (name, type)
            values ($1, $2)
            RETURNING *
        `;

    const { rows } = await pool.query(query, [name, type]);
    return rows[0];
}

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
