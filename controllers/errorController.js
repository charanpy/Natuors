const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
            const message = `Invalid ${err.path}: ${err.value}.`;
            return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
            const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
            console.log(value);

            const message = `Duplicate field value: ${value}. Please use another value!`;
            return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
            const errors = Object.values(err.errors).map(el => el.message);

            const message = `Invalid input data. ${errors.join('. ')}`;
            return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
            res.status(err.statusCode).json({
                        status: err.status,
                        error: err,
                        message: err.message,
                        stack: err.stack
            });
};

const sendErrorProd = (err, res) => {
            // Operational, trusted error: send message to client
            if (err.isOperational) {
                        res.status(err.statusCode).json({
                                    status: err.status,
                                    message: err.message
                        });

                        // Programming or other unknown error: don't leak error details
            } else {
                        // 1) Log error
                        console.error('ERROR 💥', err);

                        // 2) Send generic message
                        res.status(500).json({
                                    status: 'error',
                                    message: 'Something went very wrong!'
                        });
            }
};

module.exports = (err, req, res, next) => {
            // console.log(err.stack);

            err.statusCode = err.statusCode || 500;
            err.status = err.status || 'error';

            if (process.env.NODE_ENV === 'development') {
                        sendErrorDev(err, res);
            } else if (process.env.NODE_ENV === 'production') {
                        let error = { ...err };

                        if (error.name === 'CastError') error = handleCastErrorDB(error);
                        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
                        if (error.name === 'ValidationError')
                                    error = handleValidationErrorDB(error);

                        sendErrorProd(error, res);
            }
};



// const AppError = require("../utils/appError")

// const handleCastErrorDB = err => {
//             console.log(err)
//             const message = `Invalid ${err.path} :${err.value}`

//             return new AppError(message, 400);
// }

// const handleDuplicateErrorDB = err => {
//             const { name } = err.keyValue;
//             const message = `Duplicate field value:${name} .Please use other value`

//             return new AppError(message, 400);

// }


// const sendErrorForDev = (err, res) => {

//             res.status(err.statusCode).json({
//                         status: err.status,
//                         error: err,
//                         message: err.message,
//                         stack: err.stack
//             })
// }

// const sendErrorForProd = (err, res) => {
//             //trusted error
//             if (err.isOperational) {
//                         res.status(err.statusCode).json({
//                                     status: err.status,
//                                     message: err.message,
//                         })
//             }
//             //programming error
//             else {

//                         res.status(500).json({
//                                     status: 'error',
//                                     message: 'Something went wrong'
//                         })
//             }
// }


// module.exports = (err, req, res, next) => {
//             err.statusCode = err.statusCode || 500;
//             err.status = err.status || 'error';

//             if (process.env.NODE_ENV === 'development') {
//                         sendErrorForDev(err, res)
//             }

//             else if (process.env.NODE_ENV === 'production') {
//                         let error = { ...err };


//                         if (error.kind == "ObjectId") {
//                                     console.log(1)
//                                     erorr = handleCastErrorDB(error)
//                         }
//                         else if (error.code === 11000) {

//                                     error = handleDuplicateErrorDB(error)
//                         }
//                         else {
//                                     sendErrorForProd(error, res)
//                         }
//             }
// }