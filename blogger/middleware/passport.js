let LocalStrategy = require('passport-local').Strategy
let nodeifyit = require('nodeifyit')
let User = require('../user')
let util = require('util')

module.exports = (app) => {
  let passport = app.passport

  passport.use(new LocalStrategy({
    // Use "email" field instead of "username"
    usernameField: 'username',

    failureFlash: true
  }, nodeifyit(async (username, password) => {
      let user

      let email ="";
      if(username.indexOf('@') > -1){
          email = username.toLowerCase()
          user = await User.promise.findOne({email: email})
      }
      else{
          let regexp = new RegExp(username,'i')
          user = await User.promise.findOne({username: {$regex: regexp}})
      }


    if (!user || (email === "" && username !== user.username) || (email !== "" && username !==  user.email)) {
      return [false, {message: 'Invalid username'}]
    }

    if (!await user.validatePassword(password)) {
      return [false, {message: 'Invalid password'}]
    }
    return user
  }, {spread: true})))

  passport.serializeUser(nodeifyit(async (user) => user._id))
  passport.deserializeUser(nodeifyit(async (id) => {
      console.log("deserializ called")
      let user = await User.promise.findById(id)
      console.log("User object in desrialize "+user)
    return user
  }))

  passport.use('local-signup', new LocalStrategy({
    // Use "email" field instead of "username"
    usernameField: 'email',
    failureFlash: true,
      passReqToCallback: true
  }, nodeifyit(async (req, email, password) => {
      email = (email || '').toLowerCase()
      // Is the email taken?
      if (await User.promise.findOne({email})) {
        return [false, {message: 'That email is already taken.'}]
      }

      let {username,title,description} = req.body

      let regexp = new RegExp(username,'i')
      let query = {username:{$regex: regexp}}

      if( await User.promise.findOne(query)){
          return [false, {message: 'That Username is already taken.'}]
      }

      // create the user
      let user = new User()
      user.email = email
      user.username = username
      user.blogTitle = title
      user.blogDescription = description
      // Use a password hash instead of plain-text
      user.password = password
      try{
          return await user.save()
      }
      catch (e){
          console.log(util.inspect(e))
          return [false, {message: e.message}]
      }

  }, {spread: true})))
}
