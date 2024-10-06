const express = require("express")
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const User = require("../models/users")
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) =>{
    try{
        const fromUserId= req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"]
        //validate the status to send a request
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"invalid Status Type"+status})
        }
        //check whether user is sending connection request to himself
        if(toUserId == fromUserId){
            return res.status(400).json({message:"Cannot send self connection request"})
        }
        //check whether toUserId is available in our database
        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(400).json({message: "User does not exist"})
        }
        //validate existing connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{fromUserId, toUserId},
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        })              
        if(existingConnectionRequest){
            return res.status.json({message:"connection request exists"});
        }
       
        const connectionRequest=new ConnectionRequest({fromUserId,
            toUserId,
            status}
        )
        const data = await connectionRequest.save();
        res.send({
            message:"connection Request sent successfully",
            data,
        })
    }catch(err){
        res.status(400).send("Error:" + err.message)
    }
})

module.exports = {
    requestRouter
}