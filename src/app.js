const express = require("express");
const app = express();
const {userAuth} = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/users")
const {validateSignupData} = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(cookieParser())
app.get("/", 
    userAuth
)

app.post("/signup", async(req,res)=>{    
    try{
        const {firstName, lastName, email, password} = req.body
    //Validate the user Data
    validateSignupData(req);
    //encrypt the password
    const encryptedPasswordHash = await bcrypt.hash(password, 10);
    //Create new instance of user Model by saving the enctypted password
    const user = new User({
        firstName, lastName, email, password:encryptedPasswordHash
    });
    if(!user){
        throw new Error("invalid credentials")
    }

    await user.save();
    //Whenever we are trying to interact with DB it returns a promise, hence it is better to wrap the code with async await funtions
    res.send("user added successfully")
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
    })

app.post("/login", async (req, res) =>{
    try{
        const {email, password} = req.body;
        
        //validate email
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("invalid user Credentials");
        }
        //validate password
        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            throw new Error("invalid Credentials");
        }
        const token = await user.getJWT();
        res.cookie("token",token)

        res.send(user.firstName+" " + user.lastName+" login Successful");

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

app.get("/profile",userAuth, async (req,res) => {
    try{
        
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
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
    

