const express = require("express");

const { deleteMe, getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe } = require('../controllers/userController')
const { protect, signup, login, forgotPassword, resetPassword } = require("../controllers/authController")

const router = express.Router();


router.post("/signup", signup)
router.post("/login", login)

router.post("/forgotPassword", forgotPassword)
router.patch("/resetPassword/:token", resetPassword)

router.patch("/updateme", protect, updateMe);

router.delete("/deleteme", protect, deleteMe);



router.param('id', (req, res, next, val) => {
            console.log(val);
            next();
})

router
            .route('/')
            .get(getAllUsers)
            .post(createUser)

router
            .route('/:id')
            .get(getUser)
            .patch(updateUser)
            .delete(deleteUser)


module.exports = router;