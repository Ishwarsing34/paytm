const mongoose = require("mongoose");
const { string } = require("zod");


const UserSchema = new mongoose.Schema({

    firstName: {
        type: string,
        required: true
    },

    lastName: {
        type: string,
        required: true
    },

    password: {
        type: string,
        required: true
    }
})





const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel;