const express = require("express");
const app = express();
const {userAuth} = require("./middlewares/auth");
const connectDB = require("./config/database");

/*app.get("/user", (req, res)=>{
    console.log(req.query)
    res.send("Hello from the Dashboard");
})
app.post("/test/:userId/:name/:age", (req, res)=>{
    console.log(req.params);

    res.send("Hello from the server");
})
app.use("/", (req, res)=>{
    res.send("Hello Hello Hello");
})*/

app.use("/user", 
    userAuth
)

connectDB()
    .then(()=>{
        console.log("Connection established to Database")
        //server will be listening only after the successfull conbnection established to the Database.
        app.listen(3000, ()=>{
            console.log("Server is successfully listening on port 3000")
        })
    })
    .catch((error)=>{
        console.error("Cannot connect to the Database")
    })
    

