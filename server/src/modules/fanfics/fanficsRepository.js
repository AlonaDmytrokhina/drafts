import "dotenv/config";
import { pool } from "../../config/db.js";


export const createFanfic = async ({
    title,
    summary,
    language,
    image_url,
    words_count,
    rating,
    status,
    warnings,
    author_id,
}) => {

    const query =
        `
            INSERT INTO fanfics (
              title,
              summary,
              language,
              image_url,
              words_count,
              rating,
              status,
              warnings,
              author_id
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *
        `;

    const { rows } = await pool.query(query,
        [
            title,
            summary,
            language,
            image_url,
            words_count,
            rating,
            status,
            warnings,
            author_id,
        ]
    );

    return rows[0];
};

export const getAllFanfics = async () => {
    const query =
        `
            SELECT * FROM fanfics
            ORDER BY updated_at DESC;

        `
    const {rows} = await pool.query(query);
    return rows;
}

export const getFanficById = async (id) => {
    const { rows } = await pool.query(
        'SELECT * FROM fanfics WHERE id = $1',
        [id]
    );
    return rows[0] || null;
}

export const searchFanfics = async (q) => {
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

export const patchFanfic = async ({fields, values, index, fanficId}) => {
    const query = `
        UPDATE fanfics
        SET ${fields.join(", ")},
            updated_at = NOW()
        WHERE id=$${index}
        RETURNING id, title, summary, image_url, words_count, rating, status, warnings, updated_at, pages
    `;
    values.push(fanficId);
    const { rows } = await pool.query(query, values);

    if (!rows.length) {
        throw new Error('Fanfic not updated');
    }

    return rows[0];
}

export const deleteFanficById = async (id) => {
    const query = `
    DELETE FROM fanfics WHERE id = $1
    `;
    const { deletion } = await pool.query(query, [id]);
    return deletion;
}
