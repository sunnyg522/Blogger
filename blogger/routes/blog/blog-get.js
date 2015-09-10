/**
 * Created by gshanka on 9/8/15.
 */
let Post = require('../../post')
let Comment = require('../../comment')
let DataUri = require('datauri')
let _ = require('lodash')

module.exports = async (req, res) => {

    let blogTitle = req.params.blogTitle
    let blogObj = {
        blogTitle : blogTitle,
        user : req.user
    }
    console.log("REQUEST USER OBJECT"+req.user)
    let posts = await Post.promise.find({blogTitle: blogTitle});
    if(_.isEmpty(posts)) {
        blogObj.blogPosts = [];
    }else {
        console.log(posts)
        for(let i =0 ; i<posts.length;i++){
            let duri = new DataUri
            let img = duri.format("." + posts[i].image.contentType.split("/").pop() , posts[i].image.data)
            let imgURL = `data:${posts[i].image.contentType};base64,${img.base64}`
            posts[i].displayImage = imgURL

            if(posts[i].created_at) {
                if(posts[i].updated_at){
                    if(posts[i].updated_at > posts[i].created_at) {
                        posts[i].displayDate = posts[i].updated_at.toString()
                    }else {
                        posts[i].displayDate = posts[i].created_at.toString()
                    }
                }else{
                    posts[i].displayDate = posts[i].created_at.toString();
                }
            } else if(posts[i].dateUpdated) {
                posts[i].displayDate = posts[i].updated_at.toString()
            }



            let comments = await Comment.promise.find({postId: posts[i].id});
            if(_.isEmpty(comments)){
                posts[i].comments = []
            }else {
                console.log("comments retrieved from DB "+comments)
                posts[i].comments = comments
            }
        }

        blogObj.blogPosts = posts;
    }
    res.render('blog.ejs', blogObj)
}

