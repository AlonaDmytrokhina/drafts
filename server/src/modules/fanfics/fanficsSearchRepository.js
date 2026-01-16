import "dotenv/config";
import { pool } from "../../config/db.js";

export const searchFanficsByNameOrAuthor = async (q) => {
    const query = `
        SELECT *
        FROM (
                 SELECT DISTINCT ON (id)
                     id,
                     title,
                     summary,
                     created_at,
                     updated_at,
                     priority
                 FROM (
                     SELECT
                     f.id,
                     f.title,
                     f.summary,
                     f.created_at,
                     f.updated_at,
                     1 AS priority
                     FROM fanfics f
                     WHERE f.title ILIKE '%' || $1 || '%'

                     UNION ALL

                     SELECT
                     f.id,
                     f.title,
                     f.summary,
                     f.created_at,
                     f.updated_at,
                     2 AS priority
                     FROM fanfics f
                     JOIN users u ON u.id = f.author_id
                     WHERE u.username ILIKE '%' || $1 || '%'
                     ) combined
                 ORDER BY id, priority, updated_at DESC
             ) ranked
        ORDER BY priority, updated_at DESC;
    `;

    const { rows } = await pool.query(query, [q]);
    return rows;
};


export const searchByTags = async (tagsByType) => {
    const conditions = [];
    const values = [];
    let i = 1;

    for (const [type, names] of Object.entries(tagsByType)) {
        for (const name of names) {
            conditions.push(`(t.type = $${i} AND t.name = $${i + 1})`);
            values.push(type, name);
            i += 2;
        }
    }

    const requiredCount = values.length / 2;

    const query = `
    SELECT f.*
    FROM fanfics f
    JOIN fanfics_tags ft ON ft.fanfic_id = f.id
    JOIN tags t ON t.id = ft.tag_id
    WHERE ${conditions.join(' OR ')}
    GROUP BY f.id
    HAVING COUNT(DISTINCT t.id) = $${i}
  `;

    values.push(requiredCount);

    const { rows } = await pool.query(query, values);
    return rows;
};

