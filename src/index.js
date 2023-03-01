const express=require('express')
const mongoose=require('mongoose')
const route=require("./router/route")
const app=express()
const multer=require('multer')
app.use(express.json())
app.use(multer().any())
mongoose.connect("mongodb+srv://ayush8120:GeGo5qhr7wM6VQyg@cluster0.n1nevi5.mongodb.net/group27Database?retryWrites=true&w=majority",{useNewUrlParser:true})
.then(()=>{console.log("Project 03 Data Base is connected")})
.catch((error)=>{console.log({error:error.message})})

app.use('/',route)

app.listen(process.env.PORT||3000,()=>{console.log("Express app project 03 running on PORT", 3000||process.env.PORT)})