const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName:{
        type: 'string',
    },
    lastName:{
        type: 'string',
    },
    email:{
        type: 'string',
    },
    password:{
        type: 'string',
    },
    gender:{
        type: 'string',
    },
    age:{
        type: 'number',
    }
})

//Mongoose model name is preferred to start with capital letter
// const UserModel = mongoose.model('User', userSchema);
// module.exports = UserModel
//is also valid code to create a model 
module.exports = mongoose.model("User", userSchema); 
// second parameter of the model function is the schema which we want to send to the model.
//now create a http API request to POST the data into database