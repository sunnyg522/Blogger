/**
 * Created by gshanka on 9/8/15.
 */
let mongoose = require('mongoose')
let bcrypt = require('bcrypt')
let nodeify = require('bluebird-nodeify')
require('songbird')

let commentsSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
     created_at    : { type: Date }
, updated_at    : { type: Date }
})

commentsSchema.pre('save',  function (next) {
    console.log('Pre ssave ')
    let now = new Date();
    this.updated_at = now;
    console.log(this)
    if ( !this.created_at ) {
        this.created_at = now;
    }

    next();
})


module.exports = mongoose.model('Comments', commentsSchema)
