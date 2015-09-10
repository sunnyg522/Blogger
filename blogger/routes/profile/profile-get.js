/**
 * Created by gshanka on 9/9/15.
 */
let _ = require('lodash')
let Post = require('../../post')
let Comment = require('../../comment')
let DataUri = require('datauri')

module.exports = async (req, res) => {

    let blogTitle = req.user.blogTitle
    let profileObj = {
        blogTitle : blogTitle,
        user : req.user
    }
    let user = req.user
    let posts = await Post.promise.find({blogTitle: blogTitle});

    if(_.isEmpty(posts)) {
        //blogObj.blogPosts = [];
    }else {
        for(let i =0 ; i<posts.length;i++){
            let comments = await Comment.promise.find({postId: posts[i].id});
            if(_.isEmpty(comments)){
                posts[i].comments = []
            }else {
                posts[i].commentsCount = comments.length
                posts[i].comments = comments
            }
        }
    }
    profileObj.posts = posts
    res.render('profile.ejs', profileObj)
}