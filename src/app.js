const express = require("express");
const app = express();


app.use("/test", (req, res)=>{
    res.send("Hello from the server");
})


app.listen(3000, ()=> {
    console.log("app is successfully running on port 3000");
})