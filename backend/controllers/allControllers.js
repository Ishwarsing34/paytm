const { UserModel, BankModel } = require('../models/User');
const generateToken = require("../utils/tokenGenerator")
const bcrypt = require("bcryptjs")




const registerUser = async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;

        // Check if user exists
        const userExists = await UserModel.findOne({ username });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Username already exists",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await UserModel.create({
            firstname,
            lastname,
            username,
            password: hashedPass, // ✅ correct key
        });


        await BankModel.create({
            id: newUser._id,
            balance: Math.floor(Math.random() * (10000 - 100 + 1)) + 100,
        })

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token: generateToken(newUser._id), // ✅ send token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const logIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Generate token
        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const updateUser = async (req, res) => {
    try {
        const userId = req.userId;

        // ❗ Optional: restrict fields (important for security)
        const { firstname, lastname } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { firstname, lastname, username }, // ✅ only allowed fields
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        // ❗ Check if user exists
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: updatedUser,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const searchFilter = async (req, res) => {
    try {
        const filter = req.query.filter;

        if (!filter) {
            return res.status(400).json({
                success: false,
                message: "Filter is required",
            });
        }

        const users = await UserModel.find({
            $or: [
                { firstname: { $regex: filter, $options: "i" } },
                { lastname: { $regex: filter, $options: "i" } },
            ],
        });

        return res.json({
            users: users.map(user => ({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                _id: user._id,
            })),
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




module.exports = {
    registerUser, logIn,
    updateUser, searchFilter
}