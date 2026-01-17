import "dotenv/config";
import { pool } from "../../config/db.js";


export const insertReadingEvent = async ({
                                             userId,
                                             fanficId,
                                             chapterId,
                                             readTime
                                         }) => {
    const query = `
        INSERT INTO reading_history
            (user_id, fanfic_id, chapter_id, read_time)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, fanfic_id)
            DO UPDATE SET
                          read_time = reading_history.read_time + EXCLUDED.read_time,
                          chapter_id = EXCLUDED.chapter_id,
                          last_read_at = NOW();
    `;

    await pool.query(query, [
        userId,
        fanficId,
        chapterId,
        readTime
    ]);
};


