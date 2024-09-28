const jwt = require("jsonwebtoken")
const User = require("../models/users")
const userAuth= async (req, res, next) => {
    try{
        const cookies = req.cookies;
        //cookies give an object with contains token
        const {token} = cookies;

        if(!token){
            throw new Error("Invalid token");
        }
        const decodeToken = await jwt.verify(token, "MyDevTinderBackendSecret" )
        //above funtion will return the object with unique ID of token
        const {_id} = decodeToken;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("user not found")
        }
        req.user = user;
        next();

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
}
module.exports = {userAuth}