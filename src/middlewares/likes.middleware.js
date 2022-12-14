import {getPosts} from"../repositories/likes.repository.js"

async function validateLikeOrDeslikePost(req, res, next) {

    const {postId} = req.params
    const {likeValue} = req.body
    const {id} = res.locals.user
    
    if (!postId || isNaN(postId) || typeof(likeValue) !== "boolean") {
        return res.sendStatus(401)
    }

    try {
        const post = await getPosts({postId})

        if (!post) {
            return res.sendStatus(404)
        }
        res.locals.userId = id
        next()

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

export {validateLikeOrDeslikePost}