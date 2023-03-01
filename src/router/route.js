const express= require('express');
const router= express.Router();
const bookController=require('../controller/booksControler');
const userController=require('../controller/userControler');
const reviewControler=require('../controller/reviewController')
const reviewValidator=require("../middleware/reviewValidations")
const awsFileUpload=require('../controller/awsFileUpload')
/////////////////////////////////////////////~Muddelware~//////////////////////////////////
const middleware=require('../middleware/auth')

/////////////////////////////////////////////~ROUTERS~//////////////////////////////////
router.post('/register', userController.userCreate)
router.post('/login',userController.userLogin)
router.post('/books',middleware.Authentication ,bookController.bookCreate)
router.get('/books',middleware.Authentication,bookController.getAllBooks)
router.get('/books/:bookId',middleware.Authentication,bookController.getbooksBybookId)
router.put('/books/:bookId',middleware.Authentication,bookController.bookUpdated)
router.delete('/books/:bookId',middleware.Authentication,bookController.bookDelete)
router.post("/books/:bookId/review",reviewValidator.reviewValidator,reviewControler.createReview)
router.put("/books/:bookId/review/:reviewId",reviewControler.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewControler.deleteReview)
router.post("/awsFileUpload",awsFileUpload.uploadPhoto)

router.all('/*',function(req,res){
    return res.status(400).send({status:false, message:"pls provide valid path"})
})

/////////////////////////////////////////////~MODULE~//////////////////////////////////
module.exports=router