const express = require('express');
const bcrypt = require('bcrypt');
const User = require("../models/users");
const {validateSignupData} = require("../utils/validation")


const authRouter = express.Router();


authRouter.post("/signup", async(req,res)=>{    
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
authRouter.post("/login", async (req, res) =>{
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
authRouter.post("/logout", async(req, res) =>
{
    const cookies = req.cookies;
    res.cookie("token", null, 
        {expires: new Date(Date.now())}
    )
    res.send("logged Out successfully")
})

module.exports = {
    authRouter
}