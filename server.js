const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });

const app = require('./app');




const port = 3001 || process.env.PORT;

app.listen(port, () => {
            console.log("Server started");
});