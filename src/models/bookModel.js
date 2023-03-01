
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true,
        trim:true
    },
    excerpt: {
        type: String,
        require: true,
        trim:true
    },
    userId: {
        type: ObjectId,
        require: true,
        ref: 'user',
        trim:true
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    category: {
        type : String,
        required:true,
        trim:true
    },
    subcategory:{
        type : String,
        required:true,
        trim:true
    },
    reviews: {
        type:Number, 
        default: 0,
        trim:true 
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        trim:true
    },
    releasedAt:{
        type:Date,
        require:true,
        trim:true
    },
    bookCover:String


},{timestamps:true})

module.exports=mongoose.model('Book',bookSchema)