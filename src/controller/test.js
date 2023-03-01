// const authentication = async(req,res,next)=>{
//     try{
// let token =req.headers["x-api-key"];
// if(!token)token=req.headers[X-api-key];
//         if(!token){
//             return res.status(401).send({status:false, msg:"token must be present"})
//         };
//         let decodedToken = jwt.verify(token,"something",function(error,decodedToken){
//             if(error){
//                 return res.status(401)
//             }

//         }
//         )
//     }
//     catch(err){

//     }
// }