// This imports the 'useState' hook from the React library.
import { useState, useEffect } from "react"
// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from '../hooks/useAuthorisationContext'

// This is the functional component 'HighScoreEntryForm'.
const HighScoreEntryForm = () => {
    // This initialises the object 'user' and assigns 'useAuthorisationContext' as its value.  
    const {user} = useAuthorisationContext()
    // This initializes the variable 'userName' and the function 'setUserName' which are set to equal the React hook 'useState' which has an initial value of an empty string ('').
    // When the 'setUserName' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'userName'.
    let [userName, setUserName] = useState('')
    // This initializes the variable 'score' and the function 'setScore' which are set to equal the React hook 'useState' which has an initial value of an empty string (''). 
    // When the 'setScore' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'score'.
    let [score, setScore] = useState('')
    // This initializes the variable 'error' and the function 'setError' which are set to equal the React hook 'useState' which has an initial value of 'null'. 
    // When the 'setError' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'error'.
    const [error, setError] = useState(null)
    // This initializes the variable 'fastestLap' and the function 'setFastestLap' which are set to equal the React hook 'useState' which has an initial value of an empty string ('').
    // When the 'setFastestLap' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'fastestLap'.
    const [fastestLap, setFastestLap] = useState(null); 
    // This initializes the variable 'totalRaceTime' and the function 'setTotalRaceTime' which are set to equal the React hook 'useState' which has an initial value of an empty string ('').
    // When the 'setTotalRaceTime' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'totalRaceTime'.
    const [totalRaceTime, setTotalRaceTime] = useState(null); 

    // UseEffect to retrieve cookies from the browser for highscore entry.
    useEffect(() => {
        // Retrieves the cookie 'fastestLap' from the browser and assigns its value as the value of the variable 'fastestLapValue'.
        const fastestLapValue = document.cookie.split('; ')
            .find(cookie => cookie.startsWith('fastestLap='))
            ?.split('=')[1];
        // Retrieves the cookie 'totalRaceTime' from the browser and assigns its value as the value of the variable 'totalRaceTimeValue'.
        const totalRaceTimeValue = document.cookie.split('; ')
            .find(cookie => cookie.startsWith('totalRaceTime='))
            ?.split('=')[1];
        // Calls the 'setFastestLap' function and passes it the variable 'fastestLapValue'.
        setFastestLap(fastestLapValue);
        // Calls the 'setTotalRaceTime' function and passes it the variable 'totalRaceTimeValue'.
        setTotalRaceTime(totalRaceTimeValue);        
    }, []);

    // 'submissionHandler' function to handle highscore data submissions via button click.
    const submissionHandler = async (e) => {
        // This prevents the default form submission behaviour of refreshing the page.
        e.preventDefault()
        // If there is no 'user' object execute the code within the IF statement.
        if (!user) {
            // Calls the 'setError' function and passes it the string 'Please log in'.
            setError('Please log in')
            return
        }
        // Assigns the value of 'userName' property from the 'user' object to the variable 'userName'.
        userName = user.userName
        // Assigns the value of the variable 'totalRaceTime' to the variable 'score'.
        score = totalRaceTime    
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
        }
        // This 'IF' statement is used with the 'response.ok' property boolean value. If the HTTP status code value is 200-299 the response will be ok and the code block will execute.
        if (response.ok) {
            // This clears all the input fields. 
            setUserName('')
            setScore('')
            // This resets error state to 'null'.
            setError(null)         
            // This logs the success message 'New highScore entered into database' and the returned data from the API into the console.
            console.log('New highScore entered into database', json)
            // Forces the window to refresh.
            window.location.reload()
        }
    }

    return (
        // Assignt the form the class name of 'newEntry' and the onSubmit event handler 'submissionHandler'.
        <form className = "newEntry" onSubmit={submissionHandler}>
        {/*  H2 heading containing string response plus user name retrievbed from user object and value of the variables 'fastestLap' and 'totalRaceTime' */}
        <h2>Congratulations {user.userName}!!<br /><br />Your fastest lap was {fastestLap}<br />Your total race time was {totalRaceTime}</h2>   
            {/* Button to add highScore */}
            <button>Add HighScore</button>
            {/* This is a conditional check, it checks if the variable 'error' has value and is valid before rendering the error message */}
            {error && <div className="errorMessage">{error}</div>}
        </form>
    )
}
// This exports the functional component 'HighScoreEntryForm' as the default export of this module.
export default HighScoreEntryForm