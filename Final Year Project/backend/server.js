// This line imports the 'express' module and assigns its functionality to the variable 'express', enabling the creation of Express applications.
const express = require('express')
// This requires 'mongoose' then sets it as the value of the variable 'mongoose'.
const mongoose = require('mongoose')
// This requires 'cors' then sets it as the value of the variable 'cors'.
const cors = require('cors')
// This declares the variable 'mongoURI' and assigns the mongoDB connection string as it's value.
const mongoURI = "mongodb+srv://lez:FallenOne13;@finalyearproject.mox9ikl.mongodb.net/?retryWrites=true&w=majority"

// This requires the file 'highScore' from the 'routes' folder importing it, then sets it as the value of the variable 'highScoreRoutes'.
const highScoreRoutes = require('./routes/highScore')
// This requires the file 'users' from the 'routes' folder importing it, then sets it as the value of the variable 'userRoutes'.
const userRoutes = require('./routes/users')
// This declares the const type variable 'app' and sets its value as the express application.
const app = express()
// This requires the 'http' module then sets it as the value of the variable 'http'.
const http = require('http');
// Here the 'http.createServer()' method is used to create a http server instance and passed the 'app' variable containing the the express application.
const server = http.createServer(app);
// This requires the file 'socket' from the directory level above importing it, then sets it as the value of the variable 'socketIO' importing the socket instance.
const socketIO = require('./socket');
// Here the 'socketIO.init()' method is used to initialise the 'socker.IO' instance passed the 'server' variable containing the the instance of the http server.
const io = socketIO.init(server);

// Here 'app.use' implements the cors middleware to handle Cross-Origin Resource Sharing (CORS).
app.use (cors({
    // Here the 'origin' is set as "*" which allows requests from any origin (all origins).
    origin: "*",
    // Here the 'credentials' option is set to 'true' which enables the sending  of credentials such as cookies in CORS requests.
    // credentials: true ---- This allows cookies
}))

// Middleware for Testing
// Here 'express.json()' function is used which when data is sent to the server via POST, PUT, or PATCH request with a Content-Type of json, this middleware function takes the raw JSON data and 
// converts it into a JavaScript object which enables the data to be worked with.
app.use(express.json())
// Here app.use method is passed the objects 'req' and 'res' and the method 'next' to create middleware that executes with each request to the server.  
app.use((req, res, next) => {
    // // Here 'console.log' is used to output the 'request path and the request method in the console for testing purposes.
    // console.log(req.path, req.method)
    // Here the method 'next' is used which was passed to the 'app.use' method, meaning for the code to execute past this method another 'next' must be included.
    next()
})

// Routes
// This is the express route for all the high score C.R.U.D functions
app.use('/api/highScores', highScoreRoutes)
// This is the express route for all the user C.R.U.D functions
app.use('/api/user', userRoutes)

// Database Connection
// This connects to the MongoDB database using the value of the variable 'mongoURI'.
mongoose.connect(mongoURI)
    // If the database connection is successful.
    .then(() => {
        // This starts the Express app to listen on port 9000.
        server.listen(9000, () => {
            // Here 'console.log' is used to log the message "Database connection successful, listening on port 9000." indicating a successful database connection and server start.
            console.log("Database connection successful, listening on port 9000.")
        })
    })
    // If an error occurs during database connection or server start.
    .catch((error) => {
        // Here 'console.log' is used to log the error to the console for troubleshooting.
        console.log(error)
    })
// This exports the variable 'app' contaiing the express server instance and server containing the http server instance enabling them to be imported elsewhere.
module.exports = { app, server };