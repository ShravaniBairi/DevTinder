const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://shravani:ShravaniPuchu@namastenode.tjb2s.mongodb.net/devTinder");
}



module.exports = connectDB