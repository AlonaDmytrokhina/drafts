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

