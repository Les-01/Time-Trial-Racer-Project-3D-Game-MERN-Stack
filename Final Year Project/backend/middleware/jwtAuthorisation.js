// This requires 'jsonwebtoken' then sets it as the value of the variable 'JWT'.
const JWT = require('jsonwebtoken')
// This imports the variable 'serverSecretString' from the 'usersController' file in the 'controllers' folder.
const {serverSecretString} = require('../controllers/usersController')
// This requires the file 'userModel' from the 'models' folder importing it, then sets it as the value of the variable 'User'.
const User = require('../models/userModel')

// This is the functional components 'authorisation'.
const authorisation = async (req, res, next) => {
    // Here the headers from the request object are assigned to the object 'authorization'
    const {authorization} = req.headers
    // This 'IF' statement checks if the object 'authorization' does NOT have a value, if it does NOT execute the code within the statement. 
    if (!authorization) {
        // This returns an error response status of 401 and json error object containg the string 'Access denied. Authorisation token required'.
        return res.status(401).json({error: 'Access denied. Authorisation token required'})
    }
    // Here 'split(' ')[1]' is used to split the string value of the variable 'authorization' into an array and assign the second element in the array as the value of the variable 'authorisationToken'.
    // (This stores the jason web token string in the variable 'authorisationToken') 
    const authorisationToken = authorization.split(' ')[1]

    try {
        // Here the jason web token '.verify' method is used and passed the variables 'authorisationToken' and 'serverSecretString' to verify the token and retrieves the '_id'.
        const {_id} = JWT.verify(authorisationToken, serverSecretString)
        // Here the 'User.findOne({_id})' method is used to find a user record in the database with a matching 'id', '.select('_id')' is used to only retrieve the '_id' property from the matching record.
        // The resulting '_id' is then stored in the request object as the 'user' property for autherisation and server verification.
        req.user = await User.findOne({_id}).select('_id')
        // Here the method 'next' is used which was passed to the 'authorisation' function, meaning for the code to execute past this function 'next' must be executed.
        next()
    } catch (error) {
        // This logs any errors to the console.
        console.log(error)
        // This returns an error response status of 401 and json error object containg the string 'Access denied. Request not authorised'.
        res.status(401).json({error: 'Access denied. Request not authorised'})
    }
}
// This exports the controller functional components 'authorisation' enabling it to be imported elsewhere.
module.exports = authorisation