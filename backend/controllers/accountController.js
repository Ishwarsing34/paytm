
const { UserModel, BankModel } = require('../models/User');



const getBalance = async (req , res) =>{


       const userId = req.userId;


       const  account = await BankModel.findById({
            userId : userId
       })



       res.json({
          balance : account.balance
       })
}


const transaction = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { amount, to } = req.body;

    
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (req.userId === to) {
      throw new Error("Cannot transfer to yourself");
    }

    const account = await BankModel.findOne({
      userId: req.userId,
    }).session(session);

    if (!account || account.balance < amount) {
      throw new Error("Insufficient balance");
    }

    
    const toAccount = await BankModel.findOne({
      userId: to,
    }).session(session);

    if (!toAccount) {
      throw new Error("Invalid account");
    }

   
    await BankModel.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);


    await BankModel.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    
    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: "Transferred successfully",
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
    getBalance ,
    transaction
}