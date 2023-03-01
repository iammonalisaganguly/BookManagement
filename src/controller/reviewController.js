const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const { isValidObjectId } = require('mongoose')

/////////////////////////////////////////////~Review Create Api~//////////////////////////////////
const createReview = async (req, res) => {
    try {
        const data = req.body
        data.bookId = req.params.bookId
        const createdReview = await reviewModel.create(data)
        let data2 = await bookModel.findByIdAndUpdate(data.bookId, { $inc: { reviews: 1 } }, { new: true })
        data2._doc.reviewsData = createdReview
        res.status(201).send({ status: true, message: "Review created", data: data2 })
    } catch (error) { res.status(500).send({ status: false, message: error.message }) }
}

/////////////////////////////////////////////~Review Update Api~//////////////////////////////////
const updateReview = async function (req, res) {
    try {
        let { bookId, reviewId } = req.params
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Pls provide valid bookId" })
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Pls provide valid reviewId" })
        let bookDetails = await bookModel.findById(bookId)
        if (!bookDetails || bookDetails.isDeleted == true) return res.status(404).send({ status: false, message: "book not found" })
        let reviewDetails = await reviewModel.findById(reviewId)
        if (!reviewDetails || reviewDetails.isDeleted == true) return res.status(404).send({ status: false, message: "review not found" })
        if (bookId != reviewDetails.bookId) return res.status(400).send({ status: false, message: "bookId and review BookId not Match" })

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Request body cannot be empty" })
        }
        let { reviewedBy, rating, review } = req.body

        //validations before updating a review======================================================
        if (reviewedBy) {
            //reviewedBy validations
            if (req.body.reviewedBy) {
                if (typeof req.body.reviewedBy != "string") {
                    return res.status(400).send({ status: false, message: "reviewedBy should be string" })
                }
                else {
                    const validate = req.body.reviewedBy.match(/^[A-Z][-a-zA-Z ]+$/)
                    if (!validate) {
                        return res.status(400).send({ status: false, message: "Invalid name of reviewer" })
                    }
                }
            }
            //===============================================================================================
        }

        if (rating != undefined) {
            //validations for ratings

            if (req.body.rating == undefined) {
                return res.status(400).send({ status: false, message: "Rating should be provided in request body" })
            }
            else {
                const rating = req.body.rating
                if (!(typeof rating == "number" && (rating >= 1 && rating <= 5))) {
                    return res.status(400).send({ status: false, message: "Rating shold be a number between 1 and 5" })
                }
            }
            //==========================================================================================
        }

        if (review) {
            review = review.trim()
        }
        //End of validations=============================================================================


        let update = await reviewModel.findByIdAndUpdate(reviewId, { reviewedBy, rating, review }, { new: true })
        let bookdata = await bookModel.findById(bookId)
        bookdata._doc.reviewsData = update
        return res.status(200).send({ status: true, message: "Success ", data: bookdata })


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

/////////////////////////////////////////////~Review Delete Api~//////////////////////////////////
const deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, msg: "Pls provide a valid bookId" }) }
        let bookData = await bookModel.findById(bookId)
        if (!bookData) { return res.status(404).send({ status: false, msg: "No book exists with this Id" }) }
        if (bookData.isDeleted == true) { return res.status(404).send({ status: false, msg: "book not exist already deleted with this Id" }) }

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, msg: "pls provide valid review Id" }) }

        let reviewData = await reviewModel.findById(reviewId)

        if (!reviewData) { return res.status(404).send({ status: false, msg: "No review exists with this Id" }) }

        if (reviewData.isDeleted == true) { return res.status(404).send({ status: false, msg: "review not exist already deleted " }) }

        if (reviewData.bookId != bookId) {
            return res.status(401).send({ status: false, message: "Book Id does not match with the review" })
        }
        else {
            let delReview = await reviewModel.findByIdAndUpdate(reviewId, { isDeleted: true }, { new: true })
            const bookDoc = await bookModel.findByIdAndUpdate(bookId, { $inc: { reviews: -1 } }, { new: true })
            res.status(200).send({ status: true, message: "Success", data: bookDoc })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports = { createReview, updateReview, deleteReview }
