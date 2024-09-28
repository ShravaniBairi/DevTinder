const express = require("express");
const app = express();
const {userAuth} = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/users")
const {validateSignupData} = require("./utils/validation")
const bcrypt = require("bcrypt")

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

app.use(express.json())
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error("invalid Credentials");
        }
        res.send(user.firstName+" " + user.lastName+" login Successful");

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }




})

app.get("/user", async (req, res) => {
    const userData = req.body
    try{
        const user = await User.findOne({email: userData.email})
        console.log(user.length);
        
        if(user.length === 0){
            res.send("user Not found")
    }else{
        res.send("user data read successfully")
    }
    } catch(err){
        res.status(404).send("something went wrong")
    }
})
app.post("/user", async (req, res) => {
    const userData = req.body
    try{
        const user = await User.findOne({email: userData.email})
        console.log(user.length);
        
        if(user.length === 0){
            res.send("user Not found")
    }else{
        res.send("user data read successfully")
    }
    } catch(err){
        res.status(404).send("something went wrong")
    }
})
app.patch("/user/:userId", async (req, res) => {
    const userData = req.body
    const userId = req.params?.userId
    try{
        const ALLOWED_UPDATES = ["photoUrl", "aboutUser", "gender", "age", "skills" ]
        const isUpdateAllowed = Object.keys(userData).every((key)=> ALLOWED_UPDATES.includes(key));
        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }
        

        const user = await User.findByIdAndUpdate(userId, userData, {
            returnDocument: "before",
            runValidators: true
        });
    
        
        //the collection ignores the keys which are not present in the schema
        if(user.length === 0){
            res.send("user Not found")
    }else{
        res.send("user data updated successfully")
    }
    } catch(err){
        res.status(404).send("Update Failed:" + err.message)
    }
})

app.delete("/user", async (req,res) => {
    
    const userId = req.body.userId
    try{
        const user = await User.findByIdAndDelete(userId);
        
        if (user.length === 0){
            res.status(404).send("user not found")
        }else{
            res.send("user Deleted successfully")
        }
    }catch(err) {
        res.status(400).send("Something went wrong")
    }
})
app.get("/feed", async (req, res) => {
    const userData = req.body;
    try{
        const user = await User.find({})
        if(user.length === 0) {
            res.status(404).send("No users FOund")
        }else{
            res.send(user)
        }
    }catch(err){
        res.status(400).send("Something went wrong");
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
    

