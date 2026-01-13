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
