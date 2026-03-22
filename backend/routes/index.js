const express = require("express");

const router = express.Router();

const authCheck = require("../middlewares/Auth");

const {
  registerUser,
  logIn,
  updateUser,
  searchFilter
} = require("../controllers/allControllers");

// Public routes
router.post("/register", registerUser);
router.post("/login", logIn);

// Protected route
router.put("/update", authCheck, updateUser);


//protected

router.get("/bulk" , authCheck , searchFilter)

module.exports = router;