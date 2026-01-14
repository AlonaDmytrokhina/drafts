import "dotenv/config";
import { pool } from "../../config/db.js";

export const createComment = async ({content, chapterId, userId}) => {
    const query = `
        INSERT INTO comments (
            user_id, content, chapter_id
        )
        VALUES ($1,$2,$3)
        RETURNING *
    `

    const { rows } = await pool.query(query,
        [
            userId,
            content,
            chapterId,
        ]
    );

    return rows[0];
}

export const getCommentsByChapter = async (chapterId) => {
    const query = `
        SELECT c.*, u.username
        FROM comments c
                 JOIN users u ON u.id = c.user_id
        WHERE c.chapter_id = $1
        ORDER BY c.created_at;
    `;

    const { rows } = await pool.query(query,
        [
            chapterId,
        ]
    );

    return rows;
}

export const getCommentById = async (commentId) => {
    const { rows } = await pool.query(
        'SELECT * FROM comments WHERE id = $1',
        [commentId]
    );
    return rows[0] || null;
};

export const getCommentsByFanfic = async (fanficId) => {
    const query = `
        SELECT c.*, ch.id AS chapter_id
        FROM comments c
                 JOIN chapters ch ON ch.id = c.chapter_id
        WHERE ch.fanfic_id = $1
        ORDER BY c.created_at;
    `;

    const { rows } = await pool.query(query,
        [
            fanficId,
        ]
    );

    return rows;
}

export const deleteCommentById = async (commentId) => {
    const query = `
    DELETE FROM comments WHERE id = $1
    `;
    const { deletion } = await pool.query(query, [commentId]);
    return deletion;
}