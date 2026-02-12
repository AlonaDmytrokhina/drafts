import "dotenv/config";
import { pool } from "../../config/db.js";

export const updateUser = async ({ fields, values, index, id }) => {
  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, username, email, bio, avatar_url 
    `;

  values.push(id);
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteUserById = async (id) => {
  const query = `
    DELETE FROM users WHERE id = $1
    `;
  const { deletion } = await pool.query(query, [id]);
  return deletion;
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

export const allUserLikes = async (id) => {
    const query = `
        SELECT * FROM likes WHERE user_id = $1
    `

    const { rows } = await pool.query(query, [id]);
    return rows;
}

export const allUserBookmarks = async (id) => {
    const query = `
        SELECT * FROM bookmarks WHERE user_id = $1
    `

    const { rows } = await pool.query(query, [id]);
    return rows;
}


export const allUserWorks = async (id) => {
    const query = `
        SELECT * FROM fanfics WHERE author_id = $1
    `

    const { rows } = await pool.query(query, [id]);
    return rows;
}

