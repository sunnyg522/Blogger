let isLoggedIn = require('./middleware/isLoggedIn')
let multiparty = require('multiparty')
let then = require('express-then')
let Post = require('./post')
let fs = require('fs')
let DataUri = require('datauri')
let blogGet = require('./routes/blog/blog-get')
let commentPost = require('./routes/comment/comment-post')
let profileGet = require('./routes/profile/profile-get')
let deletePostGet = require('./routes/delete/deletepost-get')
module.exports = (app) => {
  let passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs')
  })
  app.get('/login', (req,res) => {
    res.render('login.ejs', {message: req.flash('error')})
  })
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }))
  app.get('/signup', (req,res) => {
    res.render('signup.ejs',{message: req.flash('error')})
  })
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.get('/post/:postId?',isLoggedIn, then (async (req, res) => {
    let postId = req.params.postId
    if(!postId){
      res.render('post.ejs',{
        post: {},
        verb: 'create'
      })
      return
    }
    let post = await Post.promise.findById(postId)
    if(!post) res.send(404,'Not found')

    let dataUri = new DataUri
    let image = dataUri.format('.'+post.image.contentType.split('/').pop(),post.image.data)
    console.log('image '+dataUri)
    res.render('post.ejs',{
      post: post,
      verb: 'Edit',
      image: `data: ${post.image.contentType};base64,${image.base64}`
    })

  }))
  app.post('/post/:postId?',isLoggedIn, then(async (req, res) => {
    let postId = req.params.postId
    if(!postId) {
      let post = new Post()

      console.log(req.body)
      let [{title:[title], content:[content]},{image: [file]}] = await new multiparty.Form().promise.parse(req)
      post.title = title
      post.content = content

      post.image.data = await fs.promise.readFile(file.path)
      post.image.contentType = file.headers['content-type']
      post.blogTitle = req.user.blogTitle
      console.log(file, title, content,post.image)
      await post.save()
      console.log("req.user.blogTitle  "+req.user)
      res.redirect('/blog/'+encodeURI(req.user.blogTitle))
      return
    }
    let post = await Post.promise.findById(postId)
    if(!post) res.send(404,'Not found')

    let [{title:[title], content:[content]},{image: [file]}] = await new multiparty.Form().promise.parse(req)

    post.title = title
    post.content = content
    console.log("req session value during post edit "+JSON.stringify(req.session))
    console.log("req session user value during post edit ")
    console.log(req.user)
    post.blogTitle = req.user.blogTitle
    await post.save()
    res.redirect('/blog/'+encodeURI(req.user.blogTitle))
    return




  }))



 /* app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user,
      message: req.flash('error')
    })
  })*/

  app.get('/profile',isLoggedIn,then(profileGet))


  app.get('/blog/:blogTitle', then(blogGet))

  app.post('/comment/:postId',then(commentPost))

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/delete/:postId',then(deletePostGet))


}
