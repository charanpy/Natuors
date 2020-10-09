const express = require("express");


const morgan = require("morgan")
const app = express()

const globalErrorHandler = require("./controllers/errorController")
const AppError = require('./utils/appError');
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");

if (process.env.NODE_ENV === 'development') {
       app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/ public`))

app.use((req, res, next) => {
       console.log("Hello-Middleware");
       next();
})

app.use((req, res, next) => {
       req.requestTime = new Date().toISOString();
       next();
})


app.use('/api/v1/tours', tourRoutes)
app.use('/api/v1/users', userRoutes)

app.all("*", (req, res, next) => {
       next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
});

app.use(globalErrorHandler)

module.exports = app;


