// This requires the file 'highScoreModel' from the 'models' folder importing it, then sets it as the value of the variable 'HighScore'.
const HighScore = require('../models/highScoreModel')
// This requires 'mongoose' then sets it as the value of the variable 'mongoose'.
const mongoose = require('mongoose')
// This requires the file 'socket' from the directory level above importing it, then sets it as the value of the variable 'socketIO' importing the socket instance.
const socketIO = require('../socket'); 
// This requires the file 'userModel' from the 'models' folder importing it, then sets it as the value of the variable 'User'.
const User = require('../models/userModel')

// This is the functional component 'getHighScores'.
const getHighScores = async (req, res) => {
    try {
        // This initialises the variable 'user_id' and assigns it the value off the 'user_id' property stored in the request object.
        const user_id = req.user._id;

        // This retrieves the users data from the database using the user_id.
        const user = await User.findById(user_id);
        // This declares the variable 'highScores'.
        let highScores;        
        // Here the 'HighScore.find({})' method is used to find all of the high scores. The '.sort' method and '-1' is used to sort the results in descending order from creation. 
        highScores = await HighScore.find({}).sort({ score: 1 });        
        // Here the server responds with status code '200' and the value of the variable 'highScores' is returned as a JSON object.
        res.status(200).json(highScores);
    } catch (error) {
        // If an error occurs during the execution of the code within the try block, it will be caught here.
        console.error("Error in getHighScores:", error);
        res.status(500).json({ error: "An error occurred while fetching high scores" });
    }
};

// This is the functional component 'createHighScore'.
const createHighScore = async (req, res) => {
    // Here the variables 'userName' and 'score' are set to equal the value of the userName and score of the request object.
    const {userName, score} = req.body   
    // This 'TRY' and 'CATCH' block act as the function that adds entries to the database.
    try {
        // This initialises the variable 'user_id' and assigns it the value off the 'user_id' property stored in the request object.
        const user_id = req.user._id
        // This retrieves the users data from the database using the user_id.
        const userInfo = await User.findById(user_id);
        // This retrieves the users email from the 'userInfo' object and assigns it as the value of the variable 'email'
        const email = userInfo.email
        // Here the 'HighScore.create' method is used and passed the variables 'userName', 'score', 'user_id' and 'email' to add the values to the database. 
        const highScore = await HighScore.create({userName, score, user_id, email})
        // This calls the 'getIO' method from the socketIO module, which returns the Socket.IO instance and then applies the 'emit' method to that instance which sends the 'highScoreCreated' event to the server 
        // along with the 'highScore' object containing the data on the highScore entry to be created. 
        socketIO.getIO().emit('highScoreCreated', highScore);
        // Here the server responds with status code '200' and the value of the variable 'highScore' is returned as a JSON object.
        res.status(200).json(highScore)
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: "Validation failed555", details: error.errors });
        } else {
            console.error("Error in createHighScore:", error);
            return res.status(500).json({ error: "An error occurred while creating the high score" });
        }
    }
}

// This is the functional component 'deleteHighScore'.
const deleteHighScore = async (req, res) => {
    try {
        // Here the variable 'id' is set to equal the value of the id of the request object.
        const {id} = req.params
        // This 'IF' statement declares that if the value of the variable 'id' is not a mongoos type of object id execute the code within the code block.
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // Here the server responds with status code '404' and a JSON object with an error property with a string value of "No high score found".
            return res.status(404).json({error: "No high score found"})
        }
        // Here the 'HighScore.findOneAndDelete' method is used to find a specific high score by it's id and delete it. 
        const highScore = await HighScore.findOneAndDelete({_id: id})
        // This 'IF' statement declares that if the variable 'highScore' does is not exist or has no value execute the code within the code block.
        if (!highScore) {
            // Here the server responds with status code '404' and a JSON object with an error property with a string value of "No high score found".
            return res.status(404).json({error: "No high score found"})
        }
        // This calls the 'getIO' method from the socketIO module, which returns the Socket.IO instance and then applies the 'emit' method to that instance which sends the 'highScoreDeleted' event to the server 
        // along with the 'id' object containing the id of the object to be deleted. 
        socketIO.getIO().emit('highScoreDeleted', id);
        // Here the server responds with status code '200' and the value of the variable 'highScore' is returned as a JSON object.
        res.status(200).json(highScore)
    } catch (error) {
        console.error("Error in deleteHighScore:", error);
        res.status(500).json({ error: "An error occurred while deleting the high score" });
    }
}

// This is the functional component 'updateHighScore'.
const updateHighScore = async (req, res) => {
    try {
        // Here the variable 'id' is set to equal the value of the id of the request object.
        const {id} = req.params
        // This 'IF' statement declares that if the value of the variable 'id' is not a mongoos type of object id execute the code within the code block.
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // Here the server responds with status code '404' and a JSON object with an error property with a string value of "No high score found".
            return res.status(404).json({error: "No high score found"})
        }
        // Here the 'HighScore.findOneAndUpdate' method is used to find a specific high score by its id and update its value. 
        const highScore = await HighScore.findOneAndUpdate({_id: id}, {
            // Here the spread operator '...' is used to create a new object with all of the properties and values from req.body.
            ...req.body},
            // Here the 'new: true' option is used to guarentee the high score object will contain the updated data after the update operation finishes enabling the updated object to be emitted in the 'highScoreUpdated' event.
            {new: true})
        // This 'IF' statement declares that if the variable 'highScore' does is not exist or has no value execute the code within the code block.
        if (!highScore) {
            // Here the server responds with status code '404' and a JSON object with an error property with a string value of "No high score found".
            return res.status(404).json({error: "No high score found"})
        }
        // This calls the 'getIO' method from the socketIO module, which returns the Socket.IO instance and then applies the 'emit' method to that instance which sends the 'highScoreUpdated' event to the server 
        // along with the 'highScore' object containing the data on the high score entry to be updated. 
        socketIO.getIO().emit('highScoreUpdated', highScore);
        // Here the server responds with status code '200' and the value of the variable 'highScore' is returned as a JSON object.
        res.status(200).json(highScore)
    } catch (error) {
        console.error("Error in updateHighScore:", error);
        res.status(500).json({ error: "An error occurred while updating the high score" });
    }
}
// This exports the controller functional components 'getHighScores', 'createHighScore', 'deleteHighScore' and 'updateHighScore' enabling them to be imported elsewhere.
module.exports = {getHighScores, createHighScore, deleteHighScore, updateHighScore}