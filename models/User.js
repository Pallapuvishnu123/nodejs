const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const userschema =  new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phonenumber:{
        type: Number,
        required:true
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword:{
        type:String,
        required:true
    },
    gender: {
        type: String,
        required: true
    }
})

module.exports=mongoose.model('user',userschema)    