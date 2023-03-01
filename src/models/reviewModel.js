const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const reviewSchema = mongoose.Schema({
  bookId: {
    type: ObjectId,
    ref: "Book",
    required: true,
    trim: true
  },
  reviewedBy: {
    type: String,
    required: true,
    default: "Guest",
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
    trim: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  reviewedAt: { type: Date, required: true, trim: true },
  review:
  {
    type: String,
    trim: true
  }
})


module.exports = mongoose.model("Review", reviewSchema)