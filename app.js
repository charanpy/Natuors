const express = require("express");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean")
const hpp = require("hpp");

const morgan = require("morgan")
const app = express()

const globalErrorHandler = require("./controllers/errorController")
const AppError = require('./utils/appError');
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");

//^Middleware
//^set security http headers
app.use(helmet())
if (process.env.NODE_ENV === 'development') {
       app.use(morgan('dev'));
}

const limiter = rateLimit({
       max: 100,
       windowMs: 60 * 60 * 1000,
       message: 'Too many requests from this IP,please try again in an hour'
});

app.use('/api', limiter)
app.use(express.json({
       limit: "10kb"
}));

//*Data sanitazation against nosql query injections
app.use(mongoSanitize());
//*Data sanitazation against XSS
app.use(xss());
//*Prevent parameter pollution :)
app.use(hpp({
       whitelist: [
              'duration'
              , 'ratingQuantity', 'ratingAverage', 'maxGroupSize', 'price', 'difficulty']
}));
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


