const mongoose = require("mongoose");
const dotenv = require("dotenv");


//uncaughtException
process.on('uncaughtException', err => {
            console.log(err.name, err.message)

})


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const app = require('./app');

mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
}).then(con => {
            console.log("DB connected");
}).catch(e => console.log(e))

const port = 3001 || process.env.PORT;

const server = app.listen(port, () => {
            console.log("Server started");
});

//unhandled rejections
process.on('unhandledRejection', err => {
            console.log(err.name, err.message)
            server.close(() => {
                        process.exit(1);
            })
})


