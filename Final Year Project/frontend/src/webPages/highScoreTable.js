// This imports the 'useEffect' and 'useState' hooks from the React library.
import {useEffect, useState} from 'react'
// This imports the 'io' from the socket.io-client.
import io from 'socket.io-client';
// This imports the variable 'HighScoreInfo' from the file 'highScoreInfo' within the 'components' folder.
import HighScoreInfo from '../components/highScoreInfo'
// This imports the variable 'HighScoreEntryForm' from the file 'highScoreInfo' within the 'components' folder.
import HighScoreEntryForm from '../components/highScoreEntryForm'
// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from '../hooks/useAuthorisationContext'

// This is the functional component 'HighScoreTable'.
const HighScoreTable = () => {
    // This initializes the variable 'highScores' and the function 'setHighScores' which are set to equal the React hook 'useState' which has an initial value of 'null'. 
    // When the 'setHighScores' function is called and passed a value or object containing values, that value or values will be assigned as the new value of the variable 'highScores'.
    // This makes the variable 'highScores' reactive which triggeres React to re-render the component.
    const [highScores, setHighScores] = useState([]) 
    // This initialises the object 'user' and assigns 'useAuthorisationContext' as its value.  
    const {user} = useAuthorisationContext()
    // Here the 'useEffect' hook is used to perform side effects such as fetching data within a functional component.
    useEffect (() => {
        // Here the asynchronous function 'retrieveHighScores' is defined to retrieve highScores from the API endpoint 'http://localhost:9000/api/highScores'.
        const retrieveHighScores = async () => {
            // Here data is 'fetched' from 'http://localhost:9000/api/highScores' using 'await' which pauses the execution of the function until it's completed, then assigns the result as the value of the variable 'response'.
            const response = await fetch('http://localhost:9000/api/highScores/highScoreTable', {
                headers: {
                    // This sends the authorisation header with the users token to the server with the fetch request.
                    'Authorization': `Bearer ${user.token}`
                }
            })
            // This parses the response from JSON string into a JavaScript object using 'await' which pauses the execution of the function until it's completed, then assigns the JavaScript object to the variable 'json'.
            const json = await response.json()
            // Here an 'IF' statement is used with the 'response.ok' property boolean value. If the HTTP status code value is 200-299 the response will be ok and the code block will execute.
            if (response.ok) {
                // Here the 'setHighScores' function is called and passed the variable 'json' which contains the data parsed from the response updating the state of the highScores variable to the retrieved highScore data.
                setHighScores(json)                
            }
        }
        if (user) {
            // This calls the 'retrieveHighScores' function.
            retrieveHighScores()
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
        // This is the Websocket event listener listening for the 'highScoreCreated' event to be emitted from the server. When the server emits the event execute the code within the block.
        socket.on('highScoreCreated', (highScore) => {
            // This uses the 'setHighScores' method to update the highScores array state by adding the new highScore to the array state.
            setHighScores(prevHighScores => [highScore, ...prevHighScores]);
        });
        // This is the Websocket event listener listening for the 'highScoreUpdated' event to be emitted from the server. When the server emits the event execute the code within the block.
        socket.on('highScoreUpdated', (updatedHighScore) => {
            // This uses the 'setHighScores' method to update the highScores array state by updating the highScore with the matching ID from highScores array state.
            setHighScores(prevHighScores =>
            prevHighScores.map(highScore =>
                highScore._id === updatedHighScore._id ? updatedHighScore : highScore                
                )
            );
        });
        // This the Websocket event listener listening for the 'highScoreDeleted' event to be emitted from the server. When the server emits the event execute the code within the block.
        socket.on('highScoreDeleted', (highScoreId) => {
            // This uses the 'setHighScores' method to update the highScores array state by deleting the highScore with the matching ID from highScores array state.
            setHighScores(prevHighScores =>
                prevHighScores.filter(highScore => highScore._id !== highScoreId)
            );
        });
        return () => {
            // This disconnect the WebSocket when component unmounts
            socket.disconnect(); 
        };        
    },
    // This is the dependency array for this 'useEffect'. 
    [setHighScores, highScores]);

    return (
        <div className = "highScoreTable">
            {/*  This renders the 'HighScoreEntryForm' component */}
            {/*  <HighScoreEntryForm />  */}
            <div className = "highScores">
                {/* This is a conditional check, it ensures the variable 'highScores' has value and is valid before rendering */}
                {highScores && highScores.map((highScore) => (
                    // This renders the HighScoreInfo components for each highScore in the 'highScores' array.
                    <HighScoreInfo key = {highScore._id} highScore = {highScore}/>                    
                ))}
            </div>            
        </div>
    )    
}
// This exports the functional component 'HighScoreTable' as the default export of this module.
export default HighScoreTable