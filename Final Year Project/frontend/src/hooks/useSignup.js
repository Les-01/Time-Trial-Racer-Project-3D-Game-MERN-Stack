// This imports the 'useState' hook from the React library.
import { useState } from 'react'
// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from './useAuthorisationContext'

export const useSignup = () => {
    // This initializes the variable 'error' and the function 'setError' which are set to equal the React hook 'useState' which has an initial value of 'null'. 
    // When the 'setError' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'error'.
    const [error, setError] = useState(null)
    // This initializes the variable 'isLoading' and the function 'setIsLoading' which are set to equal the React hook 'useState' which has an initial value of 'null'. 
    // When the 'setError' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'error'.
    const [isLoading, setIsLoading] = useState(null)
    // This initializes the'dispatch' function from the useAuthorisationContext hook.
    const {dispatch} = useAuthorisationContext()

    const signup = async (userName, email, password) => {
        // This resets the value of 'setIsLoading' to 'null'. 
        setIsLoading(true)
        // This resets the value of 'setError' to 'null'. 
        setError(null)

        // Here data is 'fetched' from 'http://localhost:9000/api/user/signup' using 'await' which pauses the execution of the function until it's completed, then assigns the result as the value of the variable 'response'.
        const response = await fetch('http://localhost:9000/api/user/signup', {
            // This declares the HTTP method used for the request, here 'POST' is used to send data.
            method: 'POST',
            // This specifies that the request body is in JSON format.
            headers: {'Content-Type': 'application/json'},
            // Here 'JSON.stringify' is passed the variables 'userName', 'email' and 'password' containing the user input data which is converted into a JSON string and the set it as the request body.
            body: JSON.stringify({userName, email, password})
        })
        // This parses the response from JSON string into a JavaScript object using 'await' which pauses the execution of the function until it's completed, then assigns the JavaScript object to the variable 'json'.
        // If the signup is successful the server response will include the JSON Web Token.
        const json = await response.json()
        // This 'IF' statement checks to see if the status of the variable response is NOT 'OK', if it is NOT OK execute the code within the statement.
        if (!response.ok) {
            // This sets the value of 'setIsLoading' to 'false'. 
            setIsLoading(false)
            // This sets the value of 'setIsLoading' to 'json.error' which will contain the error property the server sent back. 
            setError(json.error)
            console.log(error)
        }
        // This 'IF' statement checks to see if the status of the variable response is 'OK', if it is OK execute the code within the statement.
        if (response.ok) {   
            // This adds the user's rank to the JSON object before storing it in local Storage
            const user = { ...json, rank: json.rank };
            // Here the JavaScript object 'user' is converted into a string using 'JSON.stringify' and then stored it as an item named 'user' in the browser's localStorage.
            localStorage.setItem('user', JSON.stringify(user));
            // This updates the Authorisation Context and triggers the 'LOGIN' case.
            dispatch({ type: 'LOGIN', payload: user });
            // This sets the value of 'setIsLoading' to 'false'.
            setIsLoading(false);
        }
    }
    // This returns 'signup', 'isLoading' and 'error'.
    return {signup, isLoading, error}
}