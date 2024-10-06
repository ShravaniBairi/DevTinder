const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

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
        unique:true,
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
        type:["string"],
        validate(value){
            if(value?.length>10){
            throw new Error("Skills cannot be more than 10")
        }
        }
        
    },
    photoUrl: {
        type:"String",
        default:"",
        valudate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid photo URL");
            }
        }

    }
},
{
    timeStamps: true
},

)
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id}, "MyDevTinderBackendSecret", {
        expiresIn:"1d" //token expires in 1 day
    });
    return token;
};
userSchema.methods.validatePassword = async function(password){
    const user = this;
    const passwordHash = user.password;
    const passwordInputByUser = password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid

}

//Mongoose model name is preferred to start with capital letter
// const UserModel = mongoose.model('User', userSchema);
// module.exports = UserModel
//is also valid code to create a model 
module.exports = mongoose.model("User", userSchema); 
// second parameter of the model function is the schema which we want to send to the model.
//now create a http API request to POST the data into database