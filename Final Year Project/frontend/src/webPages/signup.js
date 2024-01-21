// This imports the 'useState' hook from the React library.
import { useState } from 'react'
// This imports 'useSignup' Hook from the file 'useSignup' within the 'hooks' folder.
import { useSignup } from '../hooks/useSignup'

// This is the functional component 'Signup'.
const Signup = () => {
    // This initializes the variable 'userName' and the function 'setUserName' which are set to equal the React hook 'useState' which has an initial value of an empty string ('').
    // When the 'setUserName' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'userName'.
    const [userName, setUserName] = useState('')
    // This initializes the variable 'email' and the function 'setEmail' which are set to equal the React hook 'useState' which has an initial value of an empty string ('').
    // When the 'setEmail' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'email'.
    const [email, setEmail] = useState('')
    // This initializes the variable 'password' and the function 'setPassword' which are set to equal the React hook 'useState' which has an initial value of an empty string ('').
    // When the 'setPassword' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'password'.
    const [password, setPassword] = useState('')
    // This initializes the variables 'error' and 'isLoading' along with the function 'signup' from 'useSignup'.
    const {signup, error, isLoading} = useSignup()

    // Here the asynchronous function 'submissionHandler' is defined and passed the event object (e) to handle user data input submissions via a button click.
    const submissionHandler = async (e) => {
        // This prevents the default form submission behaviour of refreshing the page.
        e.preventDefault()
        // This executes the functional component 'signup' which has been passed the variables 'userName', 'email', and 'password'.
        await signup(userName, email, password)
    }
    return (
        <form className = "signup" onSubmit={submissionHandler}>
            <h2>Sign Up</h2>
            {/* Input field for User Name */}
            <label>User Name:</label>
            {/* Here the 'onChange' event handler is passed the event object 'e', then the 'setUserName' function is called which is passed 'e.target.value' which contains the value of the event object
            which is the users input data which updates the state of the variable 'userName' */}
            <input type = "text" onChange={(e) => setUserName(e.target.value)} 
            // Here the value of the input field is set to the current value of the 'userName' state. 
            // In React this is known as a "controlled component" where the input value is controlled by React's state and any changes to the input field are reflected by updating the state, and vice versa.
            value = {userName}
            />

            {/* Input field for Email */}
            <label>Email:</label>
            {/* Here the 'onChange' event handler is passed the event object 'e', then the 'setEmail' function is called which is passed 'e.target.value' which contains the value of the event object
            which is the users input data which updates the state of the variable 'email' */}
            <input type = "email" onChange={(e) => setEmail(e.target.value)} 
            // Here the value of the input field is set to the current value of the 'email' state. 
            // In React this is known as a "controlled component" where the input value is controlled by React's state and any changes to the input field are reflected by updating the state, and vice versa.
            value = {email}
            />

            {/* Input field for Password */}
            <label>Password:</label>
            {/* Here the 'onChange' event handler is passed the event object 'e', then the 'setPassword' function is called which is passed 'e.target.value' which contains the value of the event object
            which is the users input data which updates the state of the variable 'password' */}
            <input type = "password" onChange={(e) => setPassword(e.target.value)} 
            // Here the value of the input field is set to the current value of the 'password' state. 
            // In React this is known as a "controlled component" where the input value is controlled by React's state and any changes to the input field are reflected by updating the state, and vice versa.
            value = {password}
            />
            {/* Button to Sign the user up */}
            <button disabled={isLoading}>Sign Up</button>   
            {/* This is a conditional check, it checks if the variable 'error' has value and is valid before rendering the error message */}
            {error && <div className="errorMessage">{error}</div>}
        </form>
    )
}
// This exports the functional component 'Signup' as the default export of this module.
export default Signup