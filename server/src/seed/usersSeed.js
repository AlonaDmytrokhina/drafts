import { faker } from '@faker-js/faker';
import { Pool } from "pg";

const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'drafts_db',
    password: "winx1708",
    port: process.env.PG_PORT || 5432,
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

async function createUser() {

    const username = faker.internet.username();
    const email = faker.internet.email().toLowerCase();
    const HASH = '$2b$10$aVqklRivkznuI/hy6ElL6OFhPUnwx0mZF.29AaXkGOMkT9lsFAJIK';

    const res = await pool.query(`
        INSERT INTO users (email, password_hash, username)
        VALUES ($1, $2, $3)
        RETURNING id
    `, [
        email,
        HASH,
        username
    ]);

    return res.rows[0].id;
}

export async function generateUserInteractions(preferredClusters = []) {

    const userId = await createUser();
    console.log("Created user:", userId);

    const MIN_INTERACTIONS = 60;
    const MAX_INTERACTIONS = 120;

    const totalInteractions =
        Math.floor(Math.random() * (MAX_INTERACTIONS - MIN_INTERACTIONS)) + MIN_INTERACTIONS;

    console.log("totalInteractions:", totalInteractions);

    let fanfics = [];

    const perCluster = Math.floor(totalInteractions / preferredClusters.length);

    for (const cluster of preferredClusters) {

        const fanficsRes = await pool.query(
            `SELECT id FROM fanfics WHERE cluster=$1`,
            [cluster]
        );

        const sampled = faker.helpers.arrayElements(
            fanficsRes.rows,
            Math.min(perCluster, fanficsRes.rows.length)
        );

        fanfics.push(...sampled);
    }

    if (fanfics.length === 0) {
        console.log("No fanfics found for clusters:", preferredClusters);
        return;
    }

    const selected = faker.helpers.shuffle(fanfics);

    for (let fanfic of selected) {

        await pool.query(`
            INSERT INTO reading_history
            (user_id, fanfic_id, read_time, last_read_at)
            VALUES ($1,$2,$3,NOW())
        `,[userId, fanfic.id, getRandomInt(60, 2000)]);

        if (Math.random() < 0.4) {
            await pool.query(`
                INSERT INTO likes (user_id, fanfic_id)
                VALUES ($1,$2)
                ON CONFLICT DO NOTHING
            `,[userId, fanfic.id]);
        }

        if (Math.random() < 0.15) {
            await pool.query(`
                INSERT INTO bookmarks (user_id, fanfic_id)
                VALUES ($1,$2)
                ON CONFLICT DO NOTHING
            `,[userId, fanfic.id]);
        }

        if (Math.random() < 0.07) {

            const chapterRes = await pool.query(
                `SELECT id
                 FROM chapters
                 WHERE fanfic_id=$1
                 ORDER BY RANDOM()
                 LIMIT 1`,
                [fanfic.id]
            );

            if (chapterRes.rows.length > 0) {

                const chapter = chapterRes.rows[0];

                await pool.query(`
                    INSERT INTO comments (user_id, content, chapter_id)
                    VALUES ($1,$2,$3)
                `,[
                    userId,
                    faker.lorem.sentence(),
                    chapter.id
                ]);
            }
        }
    }

    console.log("Generated interactions:", selected.length);
    return userId;
}

await generateUserInteractions(['NARUTO', 'HP', 'ALTA']);
await generateUserInteractions(['NARUTO','HP','UNDERTALE']);
await generateUserInteractions(['ROMANCE','ALTA']);
await generateUserInteractions(['UNDERTALE', 'ALTA']);
await generateUserInteractions(['ALTA','UNDERTALE']);