/**
 * Created by gshanka on 9/8/15.
 */
let Comment = require('../../comment')

module.exports = async (req, res) => {
    let postId = req.params.postId;
    let comment = new Comment();
    comment.comment = req.body.txtComment;
    console.log("Req in comment popst")
    console.log(req)
    comment.username = req.user.username
    comment.postId = postId
    console.log(JSON.stringify(comment))
     let result = await comment.promise.save()
    res.redirect(`/blog/${encodeURI(req.body.blogTitle)}`)


}