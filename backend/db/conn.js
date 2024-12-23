const mongoose = require("mongoose");

const DB = process.env.mongodburl;

mongoose.connect(DB,{

    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>
    console.log("database connected")).
    catch((err)=>console.log("errr",err))