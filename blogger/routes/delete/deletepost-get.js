/**
 * Created by gshanka on 9/9/15.
 */
let Post = require('../../post')
module.exports = async (req, res) => {
    let postId = req.params.postId
    await Post.promise.findByIdAndRemove(postId);
    res.redirect('/profile')
}