// This requires the file 'userModel' from the 'models' folder importing it, then sets it as the value of the variable 'User'.
const User = require('../models/userModel')
// This requires 'jsonwebtoken' then sets it as the value of the variable 'JWT'.
const JWT = require('jsonwebtoken')
// This is the secret string the server will use to encrypt JSON wen tokens
const serverSecretString = 'TheQuickBrownFoxJumpedOverTheLazyDogs'
// This requires 'mongoose' then sets it as the value of the variable 'mongoose'.
const mongoose = require('mongoose')
// This requires the file 'socket' from the directory level above importing it, then sets it as the value of the variable 'socketIO' importing the socket instance.
const socketIO = require('../socket'); 

// This is the functional component 'generateJSONWebToken'.
const generateJSONWebToken = (_id) => {
    // Here 'JWT.sign' is used to generate a JSON Web Token. 
    return JWT.sign({_id}, serverSecretString, {expiresIn: '100d'})
}

// login
// This is the functional component 'userLogin'.
const userLogin = async (req, res) => {
    // Here the values stored in the request body are destructured.
    const {email, password} = req.body

    try {
        // Here the 'User.login' method is used and passed the variables 'email' and 'password' to login the user.
        const user = await User.login(email, password)
        // Here the 'generateJSONWebToken' function is called and passed the ID of the user logging in to generate a JSON webtoken that contains the users unique ID. The resulting token is assigned as the value 
        // of the variable 'token'.
        const token = generateJSONWebToken(user._id)
        // This sends the users rank back in the response object.
        const rank = user.rank
        // This sends the users username back in the response object.
        const userName = user.userName        
        // If the user login was successful set the response status to 200 and send a json object response with the 'userName', 'email' and the JSON web token 'token'.
        res.status(200).json({userName, email, rank, token})
    } catch (error) {
        // If the user sign up was unsuccessful set the response status to 400 and send a json object response with the 'error.message'.
        res.status(400).json({error: error.message})
    }
}

// This is the functional component 'userSignup'.
const userSignup = async (req, res) => {
    // Here the values stored in the request body are destructured.
    const {userName, email, password} = req.body
    try {
        // Here the 'User.signup' method is used and passed the variables 'userName', 'email' and 'password' to sign the user up.
        const user = await User.signup(userName, email, password)
        // Here the 'generateJSONWebToken' function is called and passed the ID of the user signing up to generate a JSON webtoken that contains the users unique ID. The resulting token is assigned as the value 
        // of the variable 'token'.
        const token = generateJSONWebToken(user._id)
        // This sends the users rank back in the response object.
        const rank = user.rank
        // If the user sign up was successful set the response status to 200 and send a json object response with the 'userName', 'email' and the JSON web token 'token'.
        res.status(200).json({userName, email, rank, token})
    } catch (error) {
        // If the user sign up was unsuccessful set the response status to 400 and send a json object response with the 'error.message'.
        res.status(400).json({error: error.message})
    }
}

// This is the functional component 'getUsers'.
const getUsers = async (req, res) => {
    try {
        let users;
        // Fetch all users and sort them in descending order based on 'createdAt'
        users = await User.find({}).sort({ createdAt: -1 });        
        // Respond with status code '200' and return users as a JSON object
        res.status(200).json(users);
    } catch (error) {
        // Handle errors if any occur
        console.error("Error in getUsers:", error);
        res.status(500).json({ error: "An error occurred while fetching users" });
    }
};

// This is the functional component 'deleteUser'.
const deleteUser = async (req, res) => {
    try {
        // Here the variable 'id' is set to equal the value of the id of the request object.
        const {id} = req.params
        // This 'IF' statement declares that if the value of the variable 'id' is not a mongoos type of object id execute the code within the code block.
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // Here the server responds with status code '404' and a JSON object with an error property with a string value of "No user found".
            return res.status(404).json({error: "No user found"})
        }
        // Here the 'User.findOneAndDelete' method is used to find a specific user by its id and delete it. 
        const user = await User.findOneAndDelete({_id: id})
        // This 'IF' statement declares that if the variable 'user' does is not exist or has no value execute the code within the code block.
        if (!user) {
            // Here the server responds with status code '404' and a JSON object with an error property with a string value of "No user found".
            return res.status(404).json({error: "No user found"})
        }
        // This calls the 'getIO' method from the socketIO module, which returns the Socket.IO instance and then applies the 'emit' method to that instance which sends the 'userDeleted' event to the server 
        // along with the 'id' object containing the id of the object to be deleted. 
        socketIO.getIO().emit('userDeleted', id);
        // Here the server responds with status code '200' and the value of the variable 'user' is returned as a JSON object.
        res.status(200).json(user)
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ error: "An error occurred while deleting the user" });
    }
}

// This is the functional component 'updateUser'.
const updateUser = async (req, res) => {
    try {
        // Here the variable 'id' is set to equal the value of the id of the request object.
        const {id} = req.params
        // This 'IF' statement declares that if the value of the variable 'id' is not a mongoos type of object id execute the code within the code block.
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // Here the server responds with status code '404' and a JSON object with an error property with a string value of "No user found".
            return res.status(404).json({error: "No user found"})
        }
        // Here the 'User.findOneAndUpdate' method is used to find a specific user by its id and update its value. 
        const user = await User.findOneAndUpdate({_id: id}, {
            // Here the spread operator '...' is used to create a new object with all of the properties and values from req.body.
            ...req.body},
            // Here the 'new: true' option is used to guarentee the user object will contain the updated data after the update operation finishes enabling the updated object to be emitted in the 'userUpdated' event.
            {new: true})
        // This 'IF' statement declares that if the variable 'user' does is not exist or has no value execute the code within the code block.
        if (!user) {
            // Here the server responds with status code '404' and a JSON object with an error property with a string value of "No user found".
            return res.status(404).json({error: "No user found"})
        }
        // This calls the 'getIO' method from the socketIO module, which returns the Socket.IO instance and then applies the 'emit' method to that instance which sends the 'userUpdated' event to the server 
        // along with the 'user' object containing the data on the user entry to be updated. 
        socketIO.getIO().emit('userUpdated', user);
        // Here the server responds with status code '200' and the value of the variable 'user' is returned as a JSON object.
        res.status(200).json(user)
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ error: "An error occurred while updating the user" });
    }
}

// This exports the controller functional components 'userLogin' and 'userSignup' enabling them to be imported elsewhere.
module.exports = {userLogin, userSignup, serverSecretString, getUsers, deleteUser, updateUser}