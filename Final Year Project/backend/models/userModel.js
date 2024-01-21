// This requires 'mongoose' then sets it as the value of the variable 'mongoose'.
const mongoose = require('mongoose')
// This requires 'bcrypt' then sets it as the value of the variable 'bcrypt'.
const bcrypt = require('bcrypt')
// This requires the functions 'checkEmptyFields', 'checkValidEmail', 'checkStrongPassword', 'checkEmailExists', 'checkEmptyEmailAndPassword', 'checkUserExists', 'comparePasswords', from the 'validationModel' file
// then assigns each funtion to a variable of the same name.
const {checkEmptyFields, checkValidEmail, checkStrongPassword, checkEmailExists, checkEmptyEmailAndPassword, checkUserExists, comparePasswords} = require('./validationModel');

// This declares the variable 'Schema' and sets its value as the 'mongoose.Schema' constructor function.
const Schema = mongoose.Schema
// This uses 'new Schema()' to create a new Schema which defines the structure of the data to be sent to the database and assigns it as the value of the variable 'userSchema'.
const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        default: 'user'
    }
})

// This is the 'static' user signup method 
userSchema.statics.signup = async function (userName, email, password) {
    // This calls the function 'checkEmptyFields' which has been passed the variables 'userName', 'email' and 'password'.
    checkEmptyFields(userName, email, password);
    // This calls the function 'checkValidEmail' which has been passed the variable 'email'.
    checkValidEmail(email);
    // This calls the function 'checkStrongPassword' which has been passed the variable 'password'.
    checkStrongPassword(password);
    // This calls the function 'checkEmailExists' which has been passed the User model in 'this' and the variable 'email'.
    await checkEmailExists.call(this, email);

    // Password hashing
    // Here 'bcrypt.genSalt' is used to generate a 'bcrypt salt' to generate a random string of characters which will be added to the end of a users password to add an additional layer of security. 
    // This salt is then assigned as the value of the variable 'bcryptSalt'.
    const bcryptSalt = await bcrypt.genSalt(10)
    // Here the 'bcrypt.hash' method is used to hash arguments passed to it. In this case the users password and the bcrypt salt are both passed to 'bcrypt.hash' with the resulting hash being assigned as the 
    // value of the variable 'hashedPassword'. 
    const hashedPassword = await bcrypt.hash(password, bcryptSalt)
    // Here the 'this.create' method is passed the variables 'userName', 'email', and 'hashedPassword' to create a new user object which is assigned as the value of the variable 'user'.
    const user = await this.create({userName, email, password: hashedPassword})
    // This returns the 'user' object.
    return user
}

// This is the 'static' user login method 
userSchema.statics.login = async function (email, password) {
    // This calls the function 'checkEmptyEmailAndPassword' which has been passed the variables 'email' and 'password'.
    checkEmptyEmailAndPassword(email, password);
    // This calls the function 'checkUserExists' which has been passed the User model in 'this' and the variable 'email'.
    const user = await checkUserExists.call(this, email);
    // This calls the function 'comparePasswords' which has been passed the variables 'password' and 'password' property of the 'user' object.
    await comparePasswords(password, user.password);
    // This returns the 'user' object.
    return user;
};
// This uses 'mongoose.model' which has been passed the schema through the variable 'userSchema' and the string 'User' to create a new model using the schema to create a collection called User.
module.exports = mongoose.model('User', userSchema)