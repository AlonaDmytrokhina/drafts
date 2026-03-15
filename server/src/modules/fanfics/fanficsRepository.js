import "dotenv/config";
import { pool } from "../../config/db.js";
import fs from "fs";
import path from "path";

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
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const { rows } = await client.query(
            "SELECT image_url FROM fanfics WHERE id = $1",
            [id]
        );

        if (!rows.length) {
            throw new Error("Фанфік не знайдено");
        }

        const coverUrl = rows[0].image_url;

        if (coverUrl) {
            const filePath = path.join(process.cwd(), coverUrl);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await client.query(
            "DELETE FROM fanfics WHERE id = $1",
            [id]
        );

        await client.query("COMMIT");

        return true;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};


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




export const findFanfics =
    async ({userId, search, tags, rating, status, relationship,
               limit = 20, offset = 0, sort = 'random'
    }) => {
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

        const addFanficFilter = (field, value) => {
            if (value) {
                values.push(value);
                conditions.push(`v.${field} = $${values.length}`);
            }
        };

        addFanficFilter('rating', rating);
        addFanficFilter('status', status);
        addFanficFilter('relationship', relationship);

    const sortMapping = {
        'newest': 'v.updated_at DESC',
        'random': 'md5(v.id::text || \'seed_string\')',
        'oldest': 'v.updated_at ASC'
    };
    const orderBy = sortMapping[sort] || sortMapping['newest'];

    const whereClause = conditions.length ? conditions.join(" AND ") : "";
    const sql = getBaseFanficQuery(whereClause, values.length, orderBy);
    values.push(limit, offset);

    const { rows } = await pool.query(sql, values);

    return paginatedRes(rows);
};




const FANFIC_STATS_JOIN = `
LEFT JOIN (
    SELECT fanfic_id, COUNT(*) AS likes_count
    FROM likes
    GROUP BY fanfic_id
) l ON l.fanfic_id = v.id

LEFT JOIN (
    SELECT fanfic_id, COUNT(*) AS bookmarks_count
    FROM bookmarks
    GROUP BY fanfic_id
) b ON b.fanfic_id = v.id
`;


const USER_INTERACTIONS_JOIN = `
LEFT JOIN likes l_user
    ON l_user.fanfic_id = v.id
    AND l_user.user_id = $1

LEFT JOIN bookmarks b_user
    ON b_user.fanfic_id = v.id
    AND b_user.user_id = $1
`;


export const findFanficsByIds = async ({ userId, ids = [], limit = 20, offset = 0 }) => {

    if (!ids.length) {
        return { items: [], totalCount: 0 };
    }

    const query = `
        SELECT
            v.*,
            COALESCE(l.likes_count,0) AS likes_count,
            COALESCE(b.bookmarks_count,0) AS bookmarks_count,
            (l_user.user_id IS NOT NULL) AS "isLiked",
            (b_user.user_id IS NOT NULL) AS "isBookmarked",
            COUNT(*) OVER() AS total_count

        FROM v_fanfic_details v
            ${FANFIC_STATS_JOIN}
            ${USER_INTERACTIONS_JOIN}

        WHERE v.id = ANY($2::int[])
          AND l_user.user_id IS NULL
          AND b_user.user_id IS NULL

        ORDER BY array_position($2::int[], v.id)

            LIMIT $3 OFFSET $4
    `;

    const { rows } = await pool.query(query, [userId, ids, limit, offset]);

    return paginatedRes(rows);
};


export const getPopularForUser = async ({ userId, limit = 20, offset = 0 }) => {
    const query = `
        SELECT
            v.*,
            COALESCE(l.likes_count,0) AS likes_count,
            COALESCE(b.bookmarks_count,0) AS bookmarks_count,
            COUNT(*) OVER() AS total_count

        FROM v_fanfic_details v
            ${FANFIC_STATS_JOIN}

        WHERE NOT EXISTS (
            SELECT 1 FROM likes
            WHERE fanfic_id = v.id
          AND user_id = $1
            )
          AND NOT EXISTS (
            SELECT 1 FROM bookmarks
            WHERE fanfic_id = v.id
          AND user_id = $1
            )

        ORDER BY (COALESCE(l.likes_count,0) + COALESCE(b.bookmarks_count,0) * 2) DESC

            LIMIT $2 OFFSET $3
    `;

    const { rows } = await pool.query(query, [userId, limit, offset]);

    return paginatedRes(rows);
};


export const getPopular = async ({ limit = 20, offset = 0 }) => {
    const query = `
        SELECT
            v.*,
            COALESCE(l.likes_count,0) AS likes_count,
            COALESCE(b.bookmarks_count,0) AS bookmarks_count,
            COUNT(*) OVER() AS total_count

        FROM v_fanfic_details v
            ${FANFIC_STATS_JOIN}

        ORDER BY (COALESCE(l.likes_count,0) + COALESCE(b.bookmarks_count,0) * 2) DESC

            LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(query, [limit, offset]);

    return paginatedRes(rows);
};



const paginatedRes = (rows) => ({
    items: rows,
    totalCount: rows.length ? Number(rows[0].total_count) : 0
});
