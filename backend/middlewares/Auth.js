
const jwt = require("jsonwebtoken")

const authCheck  = async (req , res , next) =>{

   try{

      const headers  = req.headers.authorization;

      if(!headers || !headers.startsWith('Bearer')){

        return res.status(401).json({
            success : 'false',
            message : 'No token provider'
        })
      }


      const token = headers.spilt(" ")[1];



      const decoded = jwt.verify(token , process.env.JWT_SECRET)


      req.userId = decoded.id;

      next()
   }catch(error){

    return res.status(400).json({
        success:'false',
        message : 'Invalid Token'
    })
   }
   

}




module.exports = authCheck
