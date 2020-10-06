const fs = require("fs");
const Tour = require("../../models/tourModel")
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;

mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
}).then(con => {
            console.log("DB connected");
}).catch(e => console.log(e))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
            try {
                        await Tour.create(tours);
                        console.log('Data loaded');
                        process.exit()
            } catch (error) {
                        console.log(error)
            }
}

//Delete all data in db
const deleteData = async () => {
            try {
                        await Tour.deleteMany();
                        console.log('Data deleted');
                        process.exit()
            } catch (error) {
                        console.log(error)
            }
}

if (process.argv[2] === '--import') {
            importData();
} else if (process.argv[2] === '--delete') {
            deleteData();
}
console.log(process.argv);
