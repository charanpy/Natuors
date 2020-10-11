const User = require("../models/userModel")
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
            const newObj = {}
            Object.keys(obj).forEach(el => {
                        if (allowedFields.includes(el)) newObj[el] = obj[el]
            })
            return newObj;
}
exports.getAllUsers = async (req, res) => {
            const users = await User.find({})
            return res.status(200).json({
                        status: "success",
                        results: users.length,
                        data: {
                                    users
                        }
            })

}

exports.getUser = (req, res) => {
            res.status(500).json({
                        status: 'error',
                        message: 'Not yet completed'
            })
}

exports.createUser = (req, res) => {
            res.status(500).json({
                        status: 'error',
                        message: 'Not yet completed'
            })
}

exports.updateMe = catchAsync(async (req, res, next) => {
            //create error if user post password data
            if (req.body.password || req.body.passwordConfirm) {
                        return next(new AppError('Thisroute is not for password updates', 400))
            }
            //update user doc
            const filteredBody = filterObj(req.body, 'name', 'email');
            const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
                        new: true,
                        runValidators: true
            })

            res.status(200).json({
                        status: 'success',
                        data: {
                                    user
                        }
            })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
            await User.findByIdAndUpdate(req.user.id, { active: false })

            res.status(204).json({
                        status: "success",
                        data: null
            })
})
exports.updateUser = (req, res) => {
            res.status(500).json({
                        status: 'error',
                        message: 'Not yet completed'
            })
}


exports.deleteUser = (req, res) => {
            res.status(500).json({
                        status: 'error',
                        message: 'Not yet completed'
            })
}





