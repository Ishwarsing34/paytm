const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 


require("dotenv").config();
const express = require("express");
const cors = require("cors")
const connect = require("./config/db")


const app = express();


app.use(express.json());
connect();


app.use(cors())

app.get('/' , (req, res) =>{
res.send("BACKEND IS RUNNING SUCCESSFULLY")
})


app.listen(3000 , () =>{
    console.log('APP IS RUNNING AT 3000')
}) 



