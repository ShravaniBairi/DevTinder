const express = require("express");
const {validateEditProfileData} = require("../utils/validation")
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

profileRouter.get("/profile/view",userAuth, async (req,res) => {
    try{
        const user = await req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }
    //req.body is the data entered by the user to edit
    //req.user is the user details extracted form the DB while authentication
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]))
    loggedInUser.save();
    res.send("Edit successful")

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }

})

module.exports = {
    profileRouter
}