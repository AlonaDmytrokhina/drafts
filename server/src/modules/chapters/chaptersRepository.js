import "dotenv/config";
import { pool } from "../../config/db.js";

export const createChapter = async ({
    title,
    content,
    fanfic_id,
}) => {
    const query = `
        INSERT INTO chapters (fanfic_id, title, content, position)
        SELECT
            $1,
            $2,
            $3,
            COALESCE(MAX(position), 0) + 1
        FROM chapters
        WHERE fanfic_id = $1
        RETURNING *;
    `;

    const values = [fanfic_id, title, content];
    const { rows } = await pool.query(query, values);

    return rows[0];
};


export const getAllChapters = async (fanficId) => {
    const query =
        `
            SELECT *
            FROM chapters
            WHERE fanfic_id = $1
            ORDER BY position ASC;
        `;

    const { rows } = await pool.query(query, [fanficId]);

    return rows;
};

export const getChapterById = async (chapterId) => {
    const query =
        `
            SELECT *
            FROM chapters
            WHERE id = $1;
        `;

    const { rows } = await pool.query(query, [chapterId]);

    return rows[0];
};

export const deleteChapterById = async (chapterId) => {
    const query = `
    DELETE FROM chapters WHERE id = $1
    `;
    const { deletion } = await pool.query(query, [chapterId]);
    return deletion;
}

export const deleteLastChapter = async (fanficId) => {
    const query = `
    DELETE FROM chapters
    WHERE id = (
      SELECT id
      FROM chapters
      WHERE fanfic_id = $1
      ORDER BY position DESC
      LIMIT 1
    )
    RETURNING *;
  `;

    const { rows } = await pool.query(query, [fanficId]);
    return rows[0] || null;
};
