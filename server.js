const express = require ("express");
 const app = express();
 const cors =require("cors");
 const axios =require("axios")
 const port = 3000;
 const crypto = require('crypto');
const base64url = require('base64url');

 app.listen(port,()=>{
   console.log(`Server running on port ${port}`)
 });

 app.use(express.json());
 app.use(express.urlencoded({ extended:true  }));
 app.use(cors());


 app.get("/token",(req,res)=>{
   generateToken();
 });

 const generateToken = async (req,res,next)=>{
   const auth = crypto.randomBytes(64).toString('hex');

   await axios.get("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
      headers:{
         authorization:`Basic ${auth}`,
      }
   }).then((data)=>{
      console.log(requestId)
      next();
   }).catch((err)=>{
      console.log(err)
   });
 }
//middle ware to generate token
   app.post("/stk",generateToken,async (req,res)=>{
    const phone =req.body.phone.subString(1);
    const amount = req.body.amount;
    const date = new Date()
    const timestamp=
    date.getFullYear()+
    ('0' + (date.getMonth()+1)).slice(-2)+
    ('0' + date.getDate()).slice(-2)+
    ('0' + date.getHours()).slice(-2)+
    ('0' + date.getMinutes()).slice(-2)+
    ('0' + date.getSeconds()).slice(-2);

    const shortCode = "174379"
    const passKey="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
    const password = new Buffer.from(shortCode + passKey + timestamp).toString("base64");

    await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {    
         BusinessShortCode: shortCode,    
         Password: password,    
         Timestamp: timestamp,    
         TransactionType: "CustomerPayBillOnline",    
         Amount: amount,    
         PartyA:`254${phone}`,    
         PartyB: shortCode,    
         PhoneNumber:`254${phone}`,    
         CallBackURL:"https://mydomain.com/pat",    
         AccountReference:`254${phone}`,    
         TransactionDesc:"Test"
     },
     {
        headers:{
            authorization:`Bearer ${token}`
        },
     }).then((data)=>{
        console.log(data.data)
        res.status(200).json(data.data)
     }).catch((err)=>{
      res.status(400)
     })
 })