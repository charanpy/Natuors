const express = require("express");

const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/userController')
const { signup } = require("../controllers/authController")

const router = express.Router();


router.post("/signup", signup)


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