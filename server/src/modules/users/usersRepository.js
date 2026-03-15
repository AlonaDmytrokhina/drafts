import "dotenv/config";
import { pool } from "../../config/db.js";
import * as  fanficsRepository from "../fanfics/fanficsRepository.js";
import fs from "fs";
import path from "path";


export const updateUser = async ({ fields, values, index, id }) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const isAvatarUpdated = fields.some(f => f.startsWith("avatar_url"));

        if (isAvatarUpdated) {
            await deleteAvatar(client, id);
        }

        const query = `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING id, username, email, bio, avatar_url
        `;

        values.push(id);

        const { rows } = await client.query(query, values);

        await client.query("COMMIT");

        return rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};


export const deleteUserById = async (id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await deleteAvatar(client, id);

        await client.query(
            "DELETE FROM users WHERE id = $1",
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


const deleteAvatar = async (client, userId) => {
    const { rows } = await client.query(
        "SELECT avatar_url FROM users WHERE id = $1",
        [userId]
    );

    if (!rows.length) {
        throw new Error("Користувач не знайдений");
    }

    const avatarUrl = rows[0].avatar_url;

    if (avatarUrl && !avatarUrl.includes("testProfile.jpg")) {
        const filePath = path.join(process.cwd(), avatarUrl);

        await fs.promises.unlink(filePath).catch(() => {});
    }
};

export const getUserById = async (id) => {
    const query = `
      SELECT * FROM users WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

export const getUserByUsername = async (username) => {
    const query = `
      SELECT * FROM users WHERE username = $1
    `;

    const { rows } = await pool.query(query, [username]);
    return rows[0];
}


export const allUserWorks = async (authorId, currentUserId = null, limit = 10, offset = 0) => {
    const values = [currentUserId, authorId];
    const where = `v.author_id = $2`;
    const query = fanficsRepository.getBaseFanficQuery(where, values.length);
    values.push(limit, offset);

    const { rows } = await pool.query(query, values);
    return rows;
};


export const getUserBookmarks = async (currentUserId = null, limit = 10, offset = 0) => {
    const values = [currentUserId, currentUserId];
    const where = `EXISTS (
        SELECT 1 FROM bookmarks b 
        WHERE b.fanfic_id = v.id AND b.user_id = $2
    )`;
    const query = fanficsRepository.getBaseFanficQuery(where, values.length);

    values.push(limit, offset);

    const { rows } = await pool.query(query, values);
    return rows;
};

