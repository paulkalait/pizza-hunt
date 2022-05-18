const router = require('express').Router()
const { addComment, removeComment, addReply, removeReply} = require('../../controllers/comment-controller')


// post one comment
router.route('/:pizzaId').post(addComment)

router.route('/:pizzaId/:commentId').put(addReply).delete(removeComment)

//find one pizza > then its one comment id associated with the pizza post > then the reply id associated with the comment post
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply)

module.exports = router