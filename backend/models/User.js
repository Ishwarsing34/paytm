const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});



const accountSchema = new mongoose.Schema({
     
    userId : {
        type : mongoose.Types.ObjectId , 
        ref : "User",
        required : true
    },

    balance : {
        type: Number,
        default : 0
    }
})



const BankModel = mongoose.model("Account" , accountSchema)
const UserModel = mongoose.model('User', UserSchema)

module.exports = {
    UserModel , BankModel
}