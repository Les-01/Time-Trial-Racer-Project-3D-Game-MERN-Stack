// This requires 'bcrypt' then sets it as the value of the variable 'bcrypt'.
const bcrypt = require('bcrypt')
// This requires 'validator' then sets it as the value of the variable 'validator'.
const validator = require('validator')

// Signup form validation
// This is the function to check for empty fields
function checkEmptyFields(userName, email, password) {
    // This 'IF' statement checks if the 'userName', 'email' or 'password' fields are empty, if they are execute the code within the statement.
    if (!userName || !email || !password) {
        // This 'throws' an error which can be caught in a catch statement and halts execution of the code and produces a new error object with the message 'Please fill in all fields'.
        throw new Error('Please fill in all fields');
    }
}  
// This is the function to check for a valid email
function checkValidEmail(email) {
    // This 'IF' statement used the validator method '!validator.isEmail' to check if the email entered is NOT a valid email. If the email is NOT valid execute the code within the statement.
    if (!validator.isEmail(email)) {
        // This 'throws' an error which can be caught in a catch statement and halts execution of the code and produces a new error object with the message 'Please use a valid email'.
        throw new Error('Please use a valid email');
    }
}
// This is the function to check for a strong password
function checkStrongPassword(password) {
    // This 'IF' statement used the validator method '!validator.isStrongPassword' to check if the password entered is NOT a strong password. If the password is NOT strong enough execute the code within the statement.
    if (!validator.isStrongPassword(password)) {
        // This 'throws' an error which can be caught in a catch statement and halts execution of the code and produces a new error object with the message 'Please use a stronger password'.
        throw new Error('Please use a stronger password');
    }
}
// This is the function to check if the email already exists inthe database.
async function checkEmailExists(email) {
    // Here the 'this' keyword is used in place of 'User' to refer to the User model.
    const emailExists = await this.findOne({ email });
    // This 'IF' statement checks to see if the variable 'emailExists' has a value if it does execute the code within the 'IF' statement.
    if (emailExists) {
        // This 'throws' an error which can be caught in a catch statement and halts execution of the code and produces a new error object with the message 'Email already registered'.
        throw new Error('Email already registered');
    }
}

// Login form validation
// Function to check for empty email and password fields
function checkEmptyEmailAndPassword(email, password) {
    // This 'IF' statement checks if the 'email' or 'password' fields are empty, if they are execute the code within the statement.
    if (!email || !password) {
        // This 'throws' an error which can be caught in a catch statement and halts execution of the code and produces a new error object with the message 'Please fill in all fields'.
        throw new Error('Please fill in all fields');
    }
}  
// Function to check if user exists
async function checkUserExists(email) {
    // Here the 'this' keyword is used in place of 'User' to refer to the User model.
    const user = await this.findOne({ email });
    // This 'IF' statement checks to see if the variable 'user' does NOT exist if it does NOT exist execute the code within the 'IF' statement.
    if (!user) {
        // This 'throws' an error which can be caught in a catch statement and halts execution of the code and produces a new error object with the message 'Incorrect email or password'.
        throw new Error('Invalid email or password');
    }
    return user;
}  
// Function to compare passwords
async function comparePasswords(password, hashedPassword) {
    // Here the 'bcrypt.compare' method is used to compare the entered 'password' with the hashed password 'user.password' stored in the 'user' object.
    // If the passwords match the boolean value of true is assigned as the value of the variable 'passwordMatch'.  
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    // If the passwords don't match, this block 'throws' an error with the message 'Invalid email or password'
    // This 'IF' statement checks to see if the passwords DON'T match. If the passwords DON'T match execute the code within the 'IF' statement.
    if (!passwordMatch) {
        // This 'throws' an error which can be caught in a catch statement and halts execution of the code and produces a new error object with the message 'Incorrect email or password'.
        throw new Error('Invalid email or password');
    }
}
module.exports = {
    checkEmptyFields,
    checkValidEmail,
    checkStrongPassword,
    checkEmailExists,
    checkEmptyEmailAndPassword,
    checkUserExists,
    comparePasswords
};