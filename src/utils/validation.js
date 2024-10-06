const validator = require("validator");
const validateSignupData = (req) => {
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(firstName.length<4 || firstName.length>50){
        throw new Error("Name should be between 4-50 chars");
    }else if(!validator.isEmail(email)){
        throw new Error("Email not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("enter a strong password");
    }

}
const validateEditProfileData = (req) => {
    const allowedEditFields = [
      "firstName",
      "lastName",
      "photoUrl",
      "gender",
      "age",
      "aboutUser",
      "skills",
    ];
  
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    );
  
    return isEditAllowed;
  };

module.exports = {
    validateSignupData,
    validateEditProfileData
}