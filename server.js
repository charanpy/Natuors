const mongoose = require("mongoose");
const dotenv = require("dotenv");
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

app.listen(port, () => {
            console.log("Server started");
});