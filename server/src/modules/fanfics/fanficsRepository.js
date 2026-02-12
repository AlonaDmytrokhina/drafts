import "dotenv/config";
import { pool } from "../../config/db.js";
import { BASE_FANFICS_QUERY } from "./fanficsSql.js";


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

export const getFanficsForList = async () => {
    const query = `
        SELECT
            f.id,
            f.title,
            f.summary,
            f.image_url,
            f.words_count,
            f.rating,
            f.status,
            f.updated_at,
            f.warnings,
            f.pages,
            f.relationship,
            json_build_object(
                    'id', u.id,
                    'username', u.username
            ) AS author,
            COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                        'id', t.id,
                        'name', t.name,
                        'type', t.type,
                        'relationship_type', t.relationship_type
                    )
                ) FILTER (WHERE t.id IS NOT NULL),
                    '[]'
            ) AS tags
        FROM fanfics f
                 JOIN users u ON u.id = f.author_id
                 LEFT JOIN fanfics_tags ft ON ft.fanfic_id = f.id
                 LEFT JOIN tags t ON t.id = ft.tag_id
        GROUP BY f.id, u.id
        ORDER BY f.updated_at DESC;
    `;

    const { rows } = await pool.query(query);


    return rows;
};

export const getFanficById = async (id) => {
    const query = `
        SELECT
            f.id,
            f.title,
            f.summary,
            f.image_url,
            f.words_count,
            f.rating,
            f.status,
            f.updated_at,
            f.warnings,
            f.pages,
            f.relationship,
            json_build_object(
                    'id', u.id,
                    'username', u.username
            ) AS author,
            COALESCE(
                    json_agg(
                            json_build_object('id', t.id, 'name', t.name, 'type', t.type, 'relationship_type', t.relationship_type)
                    ) FILTER (WHERE t.id IS NOT NULL),
                    '[]'
            ) AS tags
        FROM fanfics f
                 JOIN users u ON u.id = f.author_id
                 LEFT JOIN fanfics_tags ft ON ft.fanfic_id = f.id
                 LEFT JOIN tags t ON t.id = ft.tag_id
        WHERE f.id = $1
        GROUP BY f.id, u.id;
    `;
    const { rows } = await pool.query(
        query,
        [id]
    );
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

export const findFanfics = async ({ userId, search, limit = 20, offset = 0 }) => {
    const values = [];
    const conditions = [];

    let userIdPlaceholder = "NULL";
    if (userId) {
        values.push(userId);
        userIdPlaceholder = `$${values.length}`;
    }

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`(f.title ILIKE $${values.length} OR u.username ILIKE $${values.length})`);
    }

    const query = `
        WITH fanfic_tags AS (
            SELECT ft.fanfic_id, json_agg(jsonb_build_object('id', t.id, 'name', t.name, 'type', t.type)) AS tags
            FROM fanfics_tags ft
                     JOIN tags t ON t.id = ft.tag_id
            GROUP BY ft.fanfic_id
        )
        SELECT
            f.id,
            f.title,
            f.summary,
            f.image_url,
            f.words_count,
            f.rating,
            f.status,
            f.updated_at,
            f.warnings,
            f.pages,
            f.relationship,
            f.author_id,
            json_build_object('id', u.id, 'username', u.username) AS author,
            COALESCE(ft.tags, '[]') AS tags,
            EXISTS(SELECT 1 FROM likes WHERE fanfic_id = f.id AND user_id = ${userIdPlaceholder}) AS "isLiked",
            EXISTS(SELECT 1 FROM bookmarks WHERE fanfic_id = f.id AND user_id = ${userIdPlaceholder}) AS "isBookmarked",
            COUNT(*) OVER() AS total_count
        FROM fanfics f
                 JOIN users u ON u.id = f.author_id
                 LEFT JOIN fanfic_tags ft ON ft.fanfic_id = f.id
            ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
        ORDER BY f.updated_at DESC
            LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

    values.push(limit, offset);
    const { rows } = await pool.query(query, values);

    return {
        items: rows,
        totalCount: rows.length > 0 ? parseInt(rows[0].total_count) : 0
    };
};


