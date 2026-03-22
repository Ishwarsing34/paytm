const express = require('express');

const authCheck = require("../middlewares/Auth")
const {
       getBalance  
} = require("../controllers/accountController")

const accountRouter = express.Router();



accountRouter.get('/balance' , authCheck , getBalance )