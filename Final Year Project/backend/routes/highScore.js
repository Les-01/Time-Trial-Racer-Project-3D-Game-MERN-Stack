// This imports the 'express' module and assigns its functionality to the variable 'express', enabling the creation of Express applications.
const express = require('express')
// This imports the controller functional components 'getHighScores', 'createHighScore', 'deleteHighScore' and 'updateHighScore' from the 
// 'highScoreController' file in the 'controllers' folder and assigns them to variables with the same names.
const {getHighScores, createHighScore, deleteHighScore, updateHighScore} = require('../controllers/highScoreController')
// This imports the functional components 'authorisation' from the 'jwtAuthorisation' file in the 'middleware' folder.
const authorisation = require('../middleware/jwtAuthorisation')
// Here a new router object is initialised by calling express.Router() which is then stored in the variable named router.
const router = express.Router()
// Here 'router.use(authorisation) is used which will execute the middlewareFunction 'authorisation' for all routes defined after this statement within the same router.
router.use(authorisation)

// HighScore Routes

// This defines the route handling GET requests to the root URL ('/') to fetch all high scores by executing the 'getHighScores' function.
router.get('/', getHighScores)


// This defines the route handling GET requests to the root URL ('/') to fetch all high scores by executing the 'getHighScores' function.
router.get('/highScoreTable', getHighScores)
router.get('/game', getHighScores)

// This defines the route handling POST requests to the root URL ('/') to post a new high score to the database by executing the 'createHighScore' function.
router.post('/', createHighScore)
// This defines the route handling DELETE requests to the URL with an ID to delete a single high score by executing the 'deleteHighScore' function. 
// ':id' is used which is a route parameter where the value of 'id' can change.  
router.delete('/:id', deleteHighScore)
// This defines the route handling PATCH requests to the URL with an ID to update a single high score by executing the 'updateHighScore' function. 
// ':id' is used which is a route parameter where the value of 'id' can change.  
router.patch('/:id', updateHighScore)
// This exports the 'expressRouter' instance stored in the variable 'router' enabling it to be imprted elsewhere.
module.exports = router