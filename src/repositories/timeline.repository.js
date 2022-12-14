import connection from "../database/database.js"

async function getPostsData(limit) {
    return (await connection.query(`
            SELECT 
            DISTINCT users.id AS user_id,
            users.username AS owner_post,
            users.picture_url,
            posts.id AS post_id,
            posts.body,
            posts.post_url,
            posts.created_at,
            reposts.id AS repost_id,
            reposts.user_id AS repost_user_id,
            u.username AS reposted_by,
            reposts.created_at AS reposted_on
        FROM users
        JOIN posts ON users.id = posts.user_id
        LEFT JOIN reposts ON posts.id = reposts.post_id
        LEFT JOIN users AS u ON reposts.user_id = u.id
        ORDER BY reposted_on DESC
        ;
    `)).rows
}

async function getLikesCount() {
    return (await connection.query(`
    SELECT
        post_id,
        COUNT (likes.id) AS likes_count
    FROM likes
    GROUP BY likes.post_id;
    `)).rows
}

async function getRepostsCount() {
    return (await connection.query(`
    SELECT
        post_id,
        COUNT (reposts.id) AS reposts_count
    FROM reposts
    GROUP BY reposts.post_id;
    `)).rows
}

async function getListLikes() {
    return (await connection.query(`
    SELECT 
        users.username,
        likes.post_id
    FROM likes
    JOIN users ON users.id = likes.user_id;
    `)).rows
}


async function getMyLikes(id) {
    return (await connection.query(`
    SELECT * FROM likes
    WHERE user_id = $1
    `, [id])).rows
}

export {getPostsData, getMyLikes, getLikesCount, getRepostsCount, getListLikes}
