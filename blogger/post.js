let mongoose = require('mongoose')

require('songbird')

let PostSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image:{
        data: Buffer,
        contentType: String
    },
    blogTitle :{
        type: String,
        required: true
    }
    , created_at    : { type: Date }
    , updated_at    : { type: Date }
})

PostSchema.pre('save',  function (next) {
    let now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }

    next();
})


module.exports = mongoose.model('Post', PostSchema)