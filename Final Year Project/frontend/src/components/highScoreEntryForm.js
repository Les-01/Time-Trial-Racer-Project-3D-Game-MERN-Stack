// This imports the 'useState' hook from the React library.
import { useState } from "react"
// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from '../hooks/useAuthorisationContext'

// This is the functional component 'HighScoreEntryForm'.
const HighScoreEntryForm = () => {
    // This initialises the object 'user' and assigns 'useAuthorisationContext' as its value.  
    const {user} = useAuthorisationContext()
    // This initializes the variable 'userName' and the function 'setUserName' which are set to equal the React hook 'useState' which has an initial value of an empty string ('').
    // When the 'setUserName' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'userName'.
    const [userName, setUserName] = useState('')
    // This initializes the variable 'score' and the function 'setScore' which are set to equal the React hook 'useState' which has an initial value of an empty string (''). 
    // When the 'setScore' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'score'.
    const [score, setScore] = useState('')
    // This initializes the variable 'error' and the function 'setError' which are set to equal the React hook 'useState' which has an initial value of 'null'. 
    // When the 'setError' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'error'.
    const [error, setError] = useState(null)
    // This initializes the variable 'emptyFormFields' and the function 'setEmptyFormFields' which are set to equal the React hook 'useState' which has an initial value of an empty array ([]).  
    // When the 'setEmptyFormFields' function is called and passed a value or object containing values, that value or values will be assigned as an element in the 'emptyFormFields' array.
    const [emptyFormFields, setEmptyFormFields] = useState([])

    // Here the asynchronous function 'submissionHandler' is defined and passed the event object (e) to handle user data input submissions via a button click.
    const submissionHandler = async (e) => {
        // This prevents the default form submission behaviour of refreshing the page.
        e.preventDefault()

        if (!user) {
            setError('Please log in')
            return
        }
        // Here an highScore object is created with the initial values from the state.
        const highScore = {userName, score}
        // Here data is 'fetched' from 'http://localhost:9000/api/highScores' using 'await' which pauses the execution of the function until it's completed, then assigns the result as the value of the variable 'response'.
        const response = await fetch('http://localhost:9000/api/highScores', { 
            // This declares the HTTP method used for the request, here 'POST' is used to send data.
            method: 'POST',
            // Here 'JSON.stringify' is passed the variable 'highScore' containing the JavaScript highScore object to convert the object into JSON string and the set it as the request body.
            body: JSON.stringify(highScore),
            headers: {
                // This specifies that the request body is in JSON format.
                'Content-Type': 'application/json',
                // This sends the authorisation header with the users token to the server with the fetch request.
                'Authorization': `Bearer ${user.token}`
            }
        })
        // This parses the response from JSON string into a JavaScript object using 'await' which pauses the execution of the function until it's completed, then assigns the JavaScript object to the variable 'json'.
        const json = await response.json()
        // This 'IF' statement uses the '!'operator and 'response.ok' property boolean value to check if the response is NOT okay. 
        // If the HTTP status code value is not in the range of 200-299 the response will NOT be ok and the code block will execute.
        if (!response.ok) {
            // Here the 'setError' function is called and passed the variable 'json' specifying the error property '.error' which contains the data of the error parsed from the response updating the state of the 
            // 'error' variable to the retrieved error data.
            setError(json.error)
            // Here the 'setEmptyFormFields' function is called and passed the variable 'json' specifying the property '.emptyFormFields' which contains the data of the unfilled user input forms updating the state of the 
            // 'emptyFormFields' variable to an array containing data on all unfilled form fields.
            setEmptyFormFields(json.emptyFormFields)
        }
        // This 'IF' statement is used with the 'response.ok' property boolean value. If the HTTP status code value is 200-299 the response will be ok and the code block will execute.
        if (response.ok) {
            // This clears all the input fields. 
            setUserName('')
            setScore('')
            // This resets error state to 'null'.
            setError(null)
            // This resets the 'emptyFormFields' variable to an empty array.
            setEmptyFormFields([])
            // This logs the success message 'New highScore entered into database' and the returned data from the API into the console.
            console.log('New highScore entered into database', json)
        }
    }

    return (
        <form className = "newEntry" onSubmit={submissionHandler}>
            <h2>Add High Score</h2>
            {/* Input field for HighScore Name */}
            <label>User Name:</label>
            {/* Here the 'onChange' event handler is passed the event object 'e', then the 'setUserName' function is called which is passed 'e.target.value' which contains the value of the event object
            which is the users input data which updates the state of the variable 'userName' */}
            <input type="text" onChange={(e) => setUserName(e.target.value)}
            // Here the value of the input field is set to the current value of the 'userName' state. 
            // In React this is known as a "controlled component" where the input value is controlled by React's state and any changes to the input field are reflected by updating the state, and vice versa.
            value = {userName}
            // This is a conditional ternary operator to check if the 'emptyFormFields' array contains the string 'userName'. If it's does it's true and apply the class of 'error', if it does not it's false
            // and apply a class of an empty string. This gives the input a conditional class. 
            className = {emptyFormFields.includes('userName') ? 'error' : ''}
            />

            {/* Input field for Score */}
            <label>Score:</label>
            {/* Here the 'onChange' event handler is passed the event object 'e', then the 'setScore' function is called which is passed 'e.target.value' which contains the value of the event object
            which is the users input data which updates the state of the variable 'score' */}
            <input type="number" onChange={(e) => setScore(e.target.value)}
            // Here the value of the input field is set to the current value of the 'score' state. 
            // In React this is known as a "controlled component" where the input value is controlled by React's state and any changes to the input field are reflected by updating the state, and vice versa.
            value = {score}
            // This is a conditional ternary operator to check if the 'emptyFormFields' array contains the string 'score'. If it's does it's true and apply the class of 'error', if it does not it's false
            // and apply a class of an empty string. This gives the input a conditional class. 
            className = {emptyFormFields.includes('score') ? 'error' : ''}
            />            
            {/* Button to add highScore */}
            <button>Add HighScore</button>
            {/* This is a conditional check, it checks if the variable 'error' has value and is valid before rendering the error message */}
            {error && <div className="errorMessage">{error}</div>}
        </form>
    )
}
// This exports the functional component 'HighScoreEntryForm' as the default export of this module.
export default HighScoreEntryForm