// This imports the 'useEffect' and 'useState' hooks from the React library.
import {useEffect, useState} from 'react'
// This imports the 'io' from the socket.io-client.
import io from 'socket.io-client';
// This imports the variable 'UserInfo' from the file 'userInfo' within the 'components' folder.
import UserInfo from '../components/userInfo'
// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from '../hooks/useAuthorisationContext'

// This is the functional component 'Admin'.
const Admin = () => {
    // This initializes the variable 'users' and the function 'setUsers' which are set to equal the React hook 'useState' which has an initial value of 'null'. 
    // When the 'setUsers' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'users'.
    // This makes the variable 'users' reactive which triggeres React to re-render the component.
    const [users, setUsers] = useState([]) 
    // This initialises the object 'user' and assigns 'useAuthorisationContext' as its value.  
    const {user} = useAuthorisationContext()
    // Here the 'useEffect' hook is used to perform side effects such as fetching data within a functional component.
    useEffect (() => {
        // Here the asynchronous function 'retrieveUsers' is defined to retrieve users from the API endpoint 'http://localhost:9000/api/user/admin'.
        const retrieveUsers = async () => {
            // Here data is 'fetched' from 'http://localhost:9000/api/user/admin' using 'await' which pauses the execution of the function until it's completed, then assigns the result as the value of the variable 'response'.
            const response = await fetch('http://localhost:9000/api/user/admin', {
                headers: {
                    // This sends the authorisation header with the users token to the server with the fetch request.
                    'Authorization': `Bearer ${user.token}`
                }
            })
            // This parses the response from JSON string into a JavaScript object using 'await' which pauses the execution of the function until it's completed, then assigns the JavaScript object to the variable 'json'.
            const json = await response.json()
            // Here an 'IF' statement is used with the 'response.ok' property boolean value. If the HTTP status code value is 200-299 the response will be ok and the code block will execute.
            if (response.ok) {
                // Here the 'setUsers' function is called and passed the variable 'json' which contains the data parsed from the response updating the state of the users variable to the retrieved user data.
                setUsers(json)                
            }
        }
        if (user) {
            // This calls the 'retrieveUsers' function.
            retrieveUsers()
        }
    },
    // This is the empty dependency array which ensures this 'useEffect' runs only once on initial render.
    [user])

    // Here the 'useEffect' hook is used to perform side effects such as fetching data within a functional component.
    useEffect(() => {
        // This establishes a WebSocket connection to 'http://localhost:9000'
        const socket = io('http://localhost:9000', {
            extraHeaders: {
                "Access-Control-Allow-Origin": "*"
            }            
        });        
        // This is the Websocket event listener listening for the 'userCreated' event to be emitted from the server. When the server emits the event execute the code within the block.
        socket.on('userCreated', (user) => {
            // This uses the 'setUserss' method to update the users array state by adding the new user to the array state.
            setUsers(prevUsers => [user, ...prevUsers]);
        });
        // This is the Websocket event listener listening for the 'userUpdated' event to be emitted from the server. When the server emits the event execute the code within the block.
        socket.on('userUpdated', (updatedUser) => {
            // This uses the 'setUsers' method to update the users array state by updating the user with the matching ID from users array state.
            setUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === updatedUser._id ? updatedUser : user                
                )
            );
        });
        // This the Websocket event listener listening for the 'userDeleted' event to be emitted from the server. When the server emits the event execute the code within the block.
        socket.on('userDeleted', (userId) => {
            // This uses the 'setUsers' method to update the users array state by deleting the user with the matching ID from users array state.
            setUsers(prevUsers =>
                prevUsers.filter(user => user._id !== userId)
            );
        });
        return () => {
            // This disconnect the WebSocket when component unmounts
            socket.disconnect(); 
        };        
    },
    // This is the dependency array for this 'useEffect'. 
    [setUsers, user]);

    return (
        <div className = "admin">
            <div className = "users">
                {/* This is a conditional check, it ensures the variable 'users' has value and is valid before rendering */}
                {users && users.map((user) => (
                    // This renders the 'UserInfo' components for each 'user'' in the 'users' array.
                    <UserInfo key = {user._id} userObject = {user}/>                    
                ))}
            </div>            
        </div>
    )    
}
// This exports the functional component 'Admin' as the default export of this module.
export default Admin