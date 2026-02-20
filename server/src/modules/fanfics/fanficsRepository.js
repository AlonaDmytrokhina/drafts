import "dotenv/config";
import { pool } from "../../config/db.js";
import { createTag } from "../tags/tagsRepository.js";
import { createChapter} from "../chapters/chaptersRepository.js";

// export const createFanfic = async ({
//     title,
//     summary,
//     language,
//     image_url,
//     words_count,
//     rating,
//     status,
//     warnings,
//     author_id,
// }) => {
//
//     const query =
//         `
//             INSERT INTO fanfics (
//               title,
//               summary,
//               language,
//               image_url,
//               words_count,
//               rating,
//               status,
//               warnings,
//               author_id
//             )
//             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
//             RETURNING *
//         `;
//
//     const { rows } = await pool.query(query,
//         [
//             title,
//             summary,
//             language,
//             image_url,
//             words_count,
//             rating,
//             status,
//             warnings,
//             author_id,
//         ]
//     );
//
//     return rows[0];
// };

export const createFanfic = async (client, data) => {
    const query = `
        INSERT INTO fanfics (title, summary, language, image_url, words_count, rating, status, warnings, author_id, relationship)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;
    const values = [
        data.title, data.summary, data.language, data.image_url,
        data.words_count, data.rating, data.status, data.warnings, data.author_id, data.relationship
    ];
    const { rows } = await client.query(query, values);
    return rows[0];
};

export const linkTagToFic = async (client, fanficId, tagId) => {
    await client.query(
        `INSERT INTO fanfics_tags (fanfic_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [fanficId, tagId]
    );
};


export const getFanficById = async (id, currentUserId = null) => {
    const query = `
        SELECT
            v.*,
            EXISTS(SELECT 1 FROM likes WHERE fanfic_id = v.id AND user_id = $2) AS "isLiked",
            EXISTS(SELECT 1 FROM bookmarks WHERE fanfic_id = v.id AND user_id = $2) AS "isBookmarked",
            COALESCE(
                    (SELECT json_agg(jsonb_build_object(
                            'id', ch.id,
                            'title', ch.title,
                            'position', ch.position,
                            'created_at', ch.created_at
                                     ) ORDER BY ch.position ASC)
                     FROM chapters ch
                     WHERE ch.fanfic_id = v.id),
                    '[]'
            ) AS chapters
        FROM v_fanfic_details v
        WHERE v.id = $1;
    `;

    const { rows } = await pool.query(query, [id, currentUserId]);
    return rows[0] || null;
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


export const getBaseFanficQuery = (whereClause, currentValuesCount, orderBy = 'v.updated_at DESC') => {
    const limitIdx = currentValuesCount + 1;
    const offsetIdx = currentValuesCount + 2;

    return `
        SELECT 
            v.*,
            EXISTS(SELECT 1 FROM likes WHERE fanfic_id = v.id AND user_id = $1) AS "isLiked",
            EXISTS(SELECT 1 FROM bookmarks WHERE fanfic_id = v.id AND user_id = $1) AS "isBookmarked",
            COUNT(*) OVER() AS total_count
        FROM v_fanfic_details v
        ${whereClause ? `WHERE ${whereClause}` : ''}
        ORDER BY ${orderBy}
        LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;
};



export const findFanfics = async ({ userId, search, tags, limit = 20, offset = 0 }) => {
    const values = [userId];
    const conditions = [];

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`(v.title ILIKE $${values.length} OR v.author->>'username' ILIKE $${values.length})`);
    }

    if (tags) {
        const tagsArray = Array.isArray(tags) ? tags : [tags];
        if (tagsArray.length > 0) {
            values.push(tagsArray);
            conditions.push(`EXISTS (
                SELECT 1 FROM fanfics_tags ft_filter 
                WHERE ft_filter.fanfic_id = v.id 
                AND ft_filter.tag_id = ANY($${values.length}::int[])
            )`);
        }
    }

    const whereClause = conditions.length ? conditions.join(" AND ") : "";
    const sql = getBaseFanficQuery(whereClause, values.length);
    values.push(limit, offset);

    const { rows } = await pool.query(sql, values);

    return {
        items: rows,
        totalCount: rows.length > 0 ? parseInt(rows[0].total_count) : 0
    };
};


