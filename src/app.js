const express = require("express");
const app = express();
const {userAuth} = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/users")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const {authRouter} = require("./routes/auth")
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/request")
const {userRouter} = require("./routes/user")
const cors = require("cors")

app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend origin
    methods: ['GET', 'POST'],         // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
    credentials: true                 // Allow credentials
  }));
  
  // Preflight handling for OPTIONS request
  app.options('*', cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  
  // Apply the CORS middleware with the options


app.use(express.json())
app.use(cookieParser())

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
//   });
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", (req,res)=>{
    res.send("Hello World")
})
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
    

