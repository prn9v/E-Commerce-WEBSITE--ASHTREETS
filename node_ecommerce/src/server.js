const app = require('.');
const connectDb = require("./config/db");

const PORT = 5454;
app.listen(PORT,async()=>{
    console.log("ecommerce api listing on port: ",PORT);
})