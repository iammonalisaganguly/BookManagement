const {isValidObjectId}=require('mongoose')
const bookModel=require('../models/bookModel')
const userModel=require("../models/userModel")

const reviewValidator=async (req,res,next)=>{
    try{
        
    if(Object.keys(req.body).length==0){
        return res.status(400).send({status:false,message:"Request body cannot be empty"})
    }
    
    //reviewedBy validations

if(req.body.reviewedBy){
    if(typeof req.body.reviewedBy!="string"){
        return res.status(400).send({status:false,message:"reviewedBy should be string"})
    }
    else{
            const validate=req.body.reviewedBy.match(/^[A-Z][-a-zA-Z ]+$/)
            if(!validate){
                return res.status(400).send({status:false,message:"Invalid name of reviewer"})
            }
        }
    }
   

//===============================================================================================

    
//=================================================================================================

//bookId validation
        if(!isValidObjectId(req.params.bookId)){
           return  res.status(400).send({status:false,message:"Please enter a valid book ID in path arams"})
        }
        else{
            let availableBooks=await bookModel.findById(req.params.bookId)
            if(!availableBooks||availableBooks.isDeleted){
               return res.status(400).send({status:false,message:"No book with the given ID"})
            }
        }

    //=============================================================================================

    //validations for ratings

    if(req.body.rating==undefined){
        return res.status(400).send({status:false,message:"Rating should be provided in request body"})
    }
    else{
        const rating=req.body.rating
    if(!(typeof rating=="number"&&(rating>=1&&rating<=5))){
          return  res.status(400).send({status:false,message:"Rating shold be a number between 1 and 5"})
        }
    }
    //==========================================================================================
    if(req.body.reviewedAt){
        if(!/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(req.body.reviewedAt))return res.status(400).send({status:false,message:"Pls provide valid date (YYYY-MM-DD)"})
    }
    else{
        req.body.reviewedAt=Date.now()
    }
    req.body.review=req.body.review.trim()
    next()
}
catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}

module.exports.reviewValidator=reviewValidator
