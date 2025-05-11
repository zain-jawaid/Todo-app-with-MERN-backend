const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})

const TodoSchema = new mongoose.Schema({
    task : String,
    done:{
        type : Boolean, 
        default : false
    }
})
const userModel = mongoose.model('users',userSchema)
const TodoModel = mongoose.model('todos',TodoSchema)
module.exports = {TodoModel , userModel}

