const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
// const validDate = /^\d{4}-\d{2}-\d{2}$/gm
const validDate=/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
const validISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
const fullName = /^[A-Za-z][A-Za-z ,._?]{5,50}$/
const { isValidObjectId } = require("mongoose")

/////////////////////////////////////////////~Book Create Api~//////////////////////////////////
const bookCreate = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "pls provide book ditails in body" })
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (!title) return res.status(400).send({ status: false, message: "Pls provide title" })
        if (typeof title !== "string" || title.trim().length === 0||!fullName.test(title)) {
            return res.status(400).send({ status: false, msg: "Enter valid title" })
        };
        let dublicatTitle = await bookModel.findOne({ title })
        if (dublicatTitle) return res.status(400).send({ status: false, message: "pls provide unique title" })
        if (!excerpt) return res.status(400).send({ status: false, message: "Pls provide excerpt" })
        if (typeof excerpt !== "string" || excerpt.trim().length === 0||!fullName.test(excerpt)) {
            return res.status(400).send({ status: false, msg: "Enter valid excerpt" })
        };
        if (!userId) return res.status(400).send({ status: false, message: "Pls provide userId" })
        if (typeof userId !== "string" || userId.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid userId" })
        };
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Pls provide valid UserId" })
        if (!ISBN) return res.status(400).send({ status: false, message: "Pls provide ISBN" })
        if (typeof ISBN !== "string" || ISBN.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid ISBN" })
        };
        if (!validISBN.test(ISBN)) return res.status(400).send({ status: false, message: "pls enter valid ISBN (10 or 13) digits in the input Only." })
        let dublicatISBN = await bookModel.findOne({ ISBN })
        if (dublicatISBN) return res.status(400).send({ status: false, message: "pls provide unique ISBN" })
        if (!category) return res.status(400).send({ status: false, message: "Pls provide category" })
        if (typeof category !== "string" || category.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid category" })
        };
        if (!subcategory) return res.status(400).send({ status: false, message: "Pls provide subcategory" })
        if (typeof subcategory !== "string" || subcategory.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid subcategory" })
        };
        if (!releasedAt) return res.status(400).send({ status: false, message: "Pls provide released date  (YYYY-MM-DD)" })
        if (typeof releasedAt !== "string" || releasedAt.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "Enter valid releasedAt" })
        };
        if (!validDate.test(releasedAt)) return res.status(400).send({ status: false, message: "Pls enter valid date (YYYY-MM-DD)format" })
        let userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "User not found" })
        if (req.decodedUserId != userId) return res.status(403).send({ status: false, message: "Your not authorised to create book" })

        let createBook = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: createBook })
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

/////////////////////////////////////////////~Get Books Api~//////////////////////////////////
const getAllBooks = async function (req, res) {
    try {
        let data = req.query
        if (data.userId) {
            if (!isValidObjectId(data.userId)) return res.status(400).send({ status: false, message: "Pls enter valid userId" })
        }
        data.isDeleted=false
        let allBooks = await bookModel.find(data).sort({title:1}).select({createdAt:0,updatedAt:0,__v:0,isDeleted:0})
        if (allBooks.length == 0) return res.status(404).send({ status: false, message: "Books not found" })
        else {
            return res.status(200).send({ status: true, message: "Books list", data: allBooks })
        }
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

/////////////////////////////////////////////~Get Books by id Api~//////////////////////////////////
const getbooksBybookId = async function (req, res) {
    try {
        let data = req.params.bookId
        if (!data) return res.status(400).send({ status: false, message: "Pls provide bookId" })
        if (!isValidObjectId(data)) return res.status(400).send({ statu: false, message: "pls provide valid BookId" })
        let bookDetails = await bookModel.findById(data)
        if (!bookDetails||bookDetails.isDeleted==true) return res.status(404).send({ status: false, message: "book not found" })
        let reviewDetails = await reviewModel.find({ bookId: bookDetails.id,isDeleted:false }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        bookDetails._doc.reviewsData = reviewDetails
        return res.status(200).send({ status: true, message: "Book List", data: bookDetails })

    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

/////////////////////////////////////////////~Book Update Api~//////////////////////////////////
const bookUpdated = async function (req, res) {
    try {
        let data = req.params.bookId
        if (!isValidObjectId(data)) return res.status(400).send({ status: false, message: "Pls provide valid BookId" })
        let data1 = req.body
        if (Object.keys(data1).length == 0) return res.status(400).send({ status: false, message: "Pls provide data" })
        let bookDetails = await bookModel.findById(data).select({ userId: 1, _id: 0, isDeleted: 1 })
        if (!bookDetails || bookDetails.isDeleted == true) return res.status(404).send({ status: false, message: "Book not found" })
        let { title, excerpt, releasedAt, ISBN } = req.body
        let keys = {}
        if (title) {
            if (typeof title !== "string" || title.trim().length === 0) {
                return res.status(400).send({ status: false, msg: "Enter valid title" })
            };
            keys.title = title.trim()
            let dublicatTitle = await bookModel.findOne({ title });
            if (dublicatTitle) return res.status(400).send({ status: false, message: "this title is allredy present" })
        }
        if (excerpt) {
            if (typeof excerpt !== "string" || excerpt.trim().length === 0) {
                return res.status(400).send({ status: false, msg: "Enter valid excerpt" })
            };
            keys.excerpt = excerpt.trim()
            let dublicatExcert = await bookModel.findOne({ excerpt });
            if (dublicatExcert) return res.status(400).send({ status: false, message: "this excert is allredy present" })
        }
        if (releasedAt) {
            if (typeof releasedAt !== "string" || releasedAt.trim().length === 0) {
                return res.status(400).send({ status: false, msg: "Enter valid releasedAt" })
            };
            if (!validDate.test(releasedAt)) return res.status(400).send({ status: false, message: "Pls enter valid date (YYYY-MM-DD)format" })
            keys.releasedAt = releasedAt.trim()
            let dublicatReleasedAt = await bookModel.findOne({ releasedAt });
            if (dublicatReleasedAt) return res.status(400).send({ status: false, message: "this relesedAt is allredy present" })
        }
        if (ISBN) {
            if (typeof ISBN !== "string" || ISBN.trim().length === 0) {
                return res.status(400).send({ status: false, msg: "Enter valid ISBN" })
            };
            if (!validISBN.test(validISBN)) return res.status(400).send({ status: false, message: "pls enter valid ISBN (10 or 13) digits in the input Only." })
            keys.ISBN = ISBN.trim()
            let dublicatISBN = await bookModel.findOne({ ISBN });
            if (dublicatISBN) return res.status(400).send({ status: false, message: "this ISBN is allredy present" })
        }
        if (bookDetails.userId != req.decodedUserId) return res.status(403).send({ status: false, message: "You are not authorised for update this doc" })
        let updatedata = await bookModel.findByIdAndUpdate(data, { $set: keys, updatedAt: Date.now() }, { new: true })
        return res.status(200).send({ status: true, message: "Success", data: updatedata })

    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}

/////////////////////////////////////////////~Book Delete Api~//////////////////////////////////
const bookDelete = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "pls enter valid BookId" })
        let bookDetails = await bookModel.findById(bookId)
        if (!bookDetails) return res.status(404).send({ status: false, message: "book dose not exist" })
        if (bookDetails.isDeleted == true) return res.status(404).send({ status: false, message: "book not found" })
        if (bookDetails.userId != req.decodedUserId) return res.status(403).send({ status: false, message: "You are not authorised for delete this doc " })
        let review = await reviewModel.updateMany({ bookId: bookId }, { $set: { isDeleted: true } })
        let bookDeleted = await bookModel.findByIdAndUpdate(bookId, { isDeleted: true, deletedAt: Date.now() }, { new: true })
        return res.status(200).send({ status: true, message: "Book deleted successful" })

    }
    catch (error) {
        res.status(500).send({ status: false, data: error.message })
    }
}

module.exports = { bookCreate, getAllBooks, getbooksBybookId, bookUpdated, bookDelete }