const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = new mongoose.Schema({
    firstName:{
        type: 'string',
        required: true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type: 'string',
        required: true,
        minLength:4,
        maxLength:50
    },
    email:{
        type: 'string',
        required:true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email id");
            }
        }
    },
    password:{
        type: 'string',
        required:true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password");
            }
        }
    },
    gender:{
        type: 'string',
        validate(value) {
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    age:{
        type: 'number',
        min : 18,
        max : 100
    },
    aboutUser:{
        type: "string",
        default: "This is default description of the User"
    },
    skills:{
        type:["string"]
    }
},
{
    timeStamps: true
})

//Mongoose model name is preferred to start with capital letter
// const UserModel = mongoose.model('User', userSchema);
// module.exports = UserModel
//is also valid code to create a model 
module.exports = mongoose.model("User", userSchema); 
// second parameter of the model function is the schema which we want to send to the model.
//now create a http API request to POST the data into database