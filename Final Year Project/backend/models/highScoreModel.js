// This requires 'mongoose' then sets it as the value of the variable 'mongoose'.
const mongoose =require('mongoose')
// This declares the variable 'Schema' and sets its value as the 'mongoose.Schema' constructor function.
const Schema = mongoose.Schema
// This uses 'new Schema()' to create a new Schema which defines the structure of the data to be sent to the database and assigns it as the value of the variable 'highScoreSchema'.
const highScoreSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    }
}, {timestamps: true})
// This uses 'mongoose.model' which has been passed the schema through the variable 'highScoreSchema' and the string 'HighScore' to create a new model using the schema to create a collection called HighScore.
module.exports = mongoose.model('HighScore', highScoreSchema)