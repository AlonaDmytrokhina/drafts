import { faker } from '@faker-js/faker';
import {Pool} from "pg";
import bcrypt from 'bcrypt';
const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'drafts_db',
    password: "winx1708",
    port: process.env.PG_PORT || 5432,
});

faker.seed(12345);

const hash = await bcrypt.hash('123456', 10);
console.log(hash);

const FANFIC_CLUSTERS = [
    'HP',
    'NARUTO',
    'UNDERTALE',
    'ATLA',
    'ROMANCE'
];

const USER_TYPES = [
    { cluster: 'HP', count: 300 },
    { cluster: 'NARUTO', count: 250 },
    { cluster: 'UNDERTALE', count: 250 },
    { cluster: 'ATLA', count: 250 },
    { cluster: 'ROMANCE', count: 250 },
    { cluster: 'MIXED', count: 200 }
];

const FANFICS_PER_CLUSTER = 400;

const MIN_INTERACTIONS = 60;
const MAX_INTERACTIONS = 120;

const PREFERRED_RATIO = 0.8;


function randomInt(min, max) {
    return faker.number.int({ min, max });
}

function randomSample(array, count) {
    return faker.helpers.arrayElements(array, count);
}

const TAGS_CONFIG = {
    HP: {
        fandom: ['Harry Potter'],
        characters: ['Harry Potter', 'Hermione Granger', 'Draco Malfoy', 'Severus Snape', 'Luna Lovegood'],
        relationships: ['Harry/Draco', 'Hermione/Ron', 'Snape/Lily'],
        additional: ['Hogwarts AU', 'Time Travel', 'Angst', 'Slow Burn', 'Magic']
    },
    NARUTO: {
        fandom: ['Naruto'],
        characters: ['Naruto Uzumaki', 'Sasuke Uchiha', 'Sakura Haruno', 'Kakashi Hatake'],
        relationships: ['Naruto/Sasuke', 'Sasuke/Sakura'],
        additional: ['Shinobi Life', 'Angst', 'Training Arc', 'Redemption']
    },
    UNDERTALE: {
        fandom: ['Undertale'],
        characters: ['Sans', 'Papyrus', 'Frisk', 'Chara'],
        relationships: ['Sans/Reader', 'Frisk/Chara'],
        additional: ['Alternate Universe', 'Genocide Route', 'Pacifist Route']
    },
    ATLA: {
        fandom: ['Avatar: The Last Airbender'],
        characters: ['Aang', 'Zuko', 'Katara', 'Azula', 'Toph'],
        relationships: ['Zuko/Katara', 'Aang/Katara'],
        additional: ['Fire Nation', 'Redemption', 'War Trauma']
    },
    ROMANCE: {
        fandom: ['Original Work'],
        characters: ['OC Female', 'OC Male'],
        relationships: ['F/M', 'F/F', 'M/M'],
        additional: ['Coffee Shop AU', 'Fake Dating', 'Friends to Lovers', 'Slow Burn']
    }
};

const GLOBAL_ADDITIONAL_TAGS = [
    'Fluff',
    'Hurt/Comfort',
    'Drama',
    'Happy Ending',
    'Alternate Universe',
    'One Shot'
];

const setImageUrl = (cluster) => {
    if (cluster === 'HP') return "/uploads/covers/cover-hp.jpg";
    if (cluster === 'NARUTO') return "/uploads/covers/cover-naruto.jpg";
    if (cluster === 'UNDERTALE') return "/uploads/covers/cover-undertale.jpg";
    if (cluster === 'ATLA') return "/uploads/covers/cover-atla.jpg";
    if (cluster === 'ROMANCE') return "/uploads/covers/cover-romance.jpg";
}


async function cleanDB() {
    console.log('Cleaning tables...');
    await pool.query('TRUNCATE reading_history, likes, bookmarks, comments, fanfics, users RESTART IDENTITY CASCADE');
}


async function seedUsers() {
    console.log('Seeding users...');

    const HASH = '$2b$10$aVqklRivkznuI/hy6ElL6OFhPUnwx0mZF.29AaXkGOMkT9lsFAJIK';
    for (let type of USER_TYPES) {
        for (let i = 0; i < type.count; i++) {
            await pool.query(`
        INSERT INTO users
        (username, email, password_hash, preference_cluster)
        VALUES ($1,$2,$3,$4)
      `, [
                faker.internet.username(),
                faker.internet.email(),
                HASH,
                type.cluster
            ]);
        }
    }
}


async function seedTags() {
    console.log('Seeding tags...');

    for (let cluster of Object.keys(TAGS_CONFIG)) {
        const config = TAGS_CONFIG[cluster];

        // FANDOM
        for (let name of config.fandom) {
            await pool.query(`
                INSERT INTO tags (name, type)
                VALUES ($1,'Fandom')
                ON CONFLICT DO NOTHING
            `, [name]);
        }

        // CHARACTERS
        for (let name of config.characters) {
            await pool.query(`
                INSERT INTO tags (name, type)
                VALUES ($1,'Character')
                ON CONFLICT DO NOTHING
            `, [name]);
        }

        // RELATIONSHIPS
        for (let name of config.relationships) {
            await pool.query(`
                INSERT INTO tags (name, type)
                VALUES ($1,'Relationship')
                ON CONFLICT DO NOTHING
            `, [name]);
        }

        // ADDITIONAL
        for (let name of config.additional) {
            await pool.query(`
                INSERT INTO tags (name, type)
                VALUES ($1,'Additional')
                ON CONFLICT DO NOTHING
            `, [name]);
        }
    }

    // GLOBAL
    for (let name of GLOBAL_ADDITIONAL_TAGS) {
        await pool.query(`
            INSERT INTO tags (name, type)
            VALUES ($1,'Additional')
            ON CONFLICT DO NOTHING
        `, [name]);
    }
}



async function seedFanfics() {
    console.log('Seeding fanfics...');

    const users = await pool.query('SELECT id FROM users LIMIT 50');
    const authorIds = users.rows.map(u => u.id);

    for (let cluster of FANFIC_CLUSTERS) {
        const image_url = setImageUrl(cluster);
        for (let i = 0; i < FANFICS_PER_CLUSTER; i++) {
            await pool.query(`
        INSERT INTO fanfics
        (title, summary, language, image_url, words_count, rating, status, warnings, author_id, relationship, cluster)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `, [
                faker.lorem.words(4),
                faker.lorem.paragraph(),
                Math.random() < 0.8 ? 'ua' : 'en',
                image_url,
                randomInt(2000, 120000),
                faker.helpers.arrayElement(['General','Teen','Mature','Explicit']),
                'Completed',
                'No Warnings',
                faker.helpers.arrayElement(authorIds),
                faker.helpers.arrayElement(['Gen','M/M','F/M','F/F','Multi','Other']),
                cluster
            ]);
        }
    }
}


async function assignTagsToFanfics() {
    console.log('Assigning tags to fanfics...');

    const fanfics = await pool.query(`SELECT id, cluster FROM fanfics`);
    const tags = await pool.query(`SELECT id, name, type FROM tags`);

    const tagsByType = {
        Fandom: tags.rows.filter(t => t.type === 'Fandom'),
        Character: tags.rows.filter(t => t.type === 'Character'),
        Relationship: tags.rows.filter(t => t.type === 'Relationship'),
        Additional: tags.rows.filter(t => t.type === 'Additional')
    };

    for (let fanfic of fanfics.rows) {

        const clusterConfig = TAGS_CONFIG[fanfic.cluster];

        //FANDOM (1)
        const fandomTag = tagsByType.Fandom.find(t =>
            clusterConfig.fandom.includes(t.name)
        );

        await pool.query(`
            INSERT INTO fanfics_tags (fanfic_id, tag_id)
            VALUES ($1,$2)
            ON CONFLICT DO NOTHING
        `, [fanfic.id, fandomTag.id]);

        //CHARACTERS (2–4)
        const characterTags = tagsByType.Character.filter(t =>
            clusterConfig.characters.includes(t.name)
        );

        const selectedCharacters = randomSample(characterTags, randomInt(2,4));

        for (let tag of selectedCharacters) {
            await pool.query(`
                INSERT INTO fanfics_tags (fanfic_id, tag_id)
                VALUES ($1,$2)
                ON CONFLICT DO NOTHING
            `, [fanfic.id, tag.id]);
        }

        //RELATIONSHIPS (1–2)
        const relationshipTags = tagsByType.Relationship.filter(t =>
            clusterConfig.relationships.includes(t.name)
        );

        const selectedRelationships = randomSample(relationshipTags, randomInt(1,2));

        for (let tag of selectedRelationships) {
            await pool.query(`
                INSERT INTO fanfics_tags (fanfic_id, tag_id)
                VALUES ($1,$2)
                ON CONFLICT DO NOTHING
            `, [fanfic.id, tag.id]);
        }

        //ADDITIONAL (3–7)
        const clusterAdditional = tagsByType.Additional.filter(t =>
            clusterConfig.additional.includes(t.name)
        );

        const globalAdditional = tagsByType.Additional.filter(t =>
            GLOBAL_ADDITIONAL_TAGS.includes(t.name)
        );

        const selectedAdditional = [
            ...randomSample(clusterAdditional, randomInt(2,4)),
            ...randomSample(globalAdditional, randomInt(1,3))
        ];

        for (let tag of selectedAdditional) {
            await pool.query(`
                INSERT INTO fanfics_tags (fanfic_id, tag_id)
                VALUES ($1,$2)
                ON CONFLICT DO NOTHING
            `, [fanfic.id, tag.id]);
        }
    }
}


async function generateInteractions() {
    console.log('Generating interactions...');

    const usersRes = await pool.query('SELECT id, preference_cluster FROM users');
    const users = usersRes.rows;

    const fanficsRes = await pool.query('SELECT id, cluster FROM fanfics');
    const fanfics = fanficsRes.rows;

    const fanficsByCluster = {};
    for (let cluster of FANFIC_CLUSTERS) {
        fanficsByCluster[cluster] = fanfics.filter(f => f.cluster === cluster);
    }

    for (let user of users) {

        const totalInteractions = randomInt(MIN_INTERACTIONS, MAX_INTERACTIONS);
        const preferredCount = Math.floor(totalInteractions * PREFERRED_RATIO);
        const randomCount = totalInteractions - preferredCount;

        let preferredFanfics = [];
        if (user.preference_cluster !== 'MIXED') {
            preferredFanfics = randomSample(
                fanficsByCluster[user.preference_cluster],
                preferredCount
            );
        } else {
            preferredFanfics = randomSample(fanfics, preferredCount);
        }

        const randomFanfics = randomSample(fanfics, randomCount);
        const finalFanfics = [...preferredFanfics, ...randomFanfics];

        for (let fanfic of finalFanfics) {

            //Reading history (100%)
            await pool.query(`
                                INSERT INTO reading_history
                                (user_id, fanfic_id, read_time, last_read_at)
                                VALUES ($1,$2,$3,NOW())
                                ON CONFLICT (user_id, fanfic_id) DO NOTHING
                              `, [
                user.id,
                fanfic.id,
                randomInt(60, 3600)
            ]);

            //Like (40%)
            if (Math.random() < 0.4) {
                await pool.query(`
                                  INSERT INTO likes (user_id, fanfic_id)
                                  VALUES ($1,$2)
                                  ON CONFLICT DO NOTHING
                                `, [user.id, fanfic.id]);
            }

            //Bookmark (15%)
            if (Math.random() < 0.15) {
                await pool.query(`
                                  INSERT INTO bookmarks (user_id, fanfic_id)
                                  VALUES ($1,$2)
                                  ON CONFLICT DO NOTHING
                                `, [user.id, fanfic.id]);
            }

            //Comment (7%)
            if (Math.random() < 0.07) {
                await pool.query(`
                                  INSERT INTO comments (user_id, content, chapter_id)
                                  VALUES ($1,$2,NULL)
                                `, [
                    user.id,
                    faker.lorem.sentence()
                ]);
            }
        }
    }
}



async function main() {
    try {
        await cleanDB();
        await seedUsers();
        await seedTags();
        await seedFanfics();
        await assignTagsToFanfics();
        await generateInteractions();
        console.log('SEED COMPLETED SUCCESSFULLY');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

await main();