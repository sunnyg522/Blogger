let mongoose = require('mongoose')
let bcrypt = require('bcrypt')
let nodeify = require('bluebird-nodeify')
require('songbird')

let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  blogDescription: String,
  blogTitle: String
})

userSchema.methods.generateHash = async function(password) {
  return await bcrypt.promise.hash(password, 8)
}

userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.promise.compare(password, this.password)
}

userSchema.path('password').validate((password) => {
  console.log('password Validated')
  let passed = password.length >=4 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
  return passed
})

userSchema.pre('save',  function (callback) {
  nodeify(async () => {
    if(!this.isModified('password')) return callback()
    this.password = await this.generateHash(this.password)
  }(), callback)
})

module.exports = mongoose.model('User', userSchema)
