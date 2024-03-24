// This imports the 'useState' hook from the React library.
import React, { useState } from 'react';
// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from '../hooks/useAuthorisationContext'

// This is the functional component 'HighScoreInfo' which has been passed the object 'highScore'.
const HighScoreInfo = ({highScore}) => {
    // This initialises the object 'user' and assigns 'useAuthorisationContext' as its value.  
    const {user} = useAuthorisationContext()
    // This retrieves the 'user' object stored in local storage and assigns it as the value of the variable 'userObject'.
    const userObject = JSON.parse(localStorage.getItem('user'));
    // This is a conditioonal statement wherein if the 'userObject' has value and the 'userObject' 'rank' property equals 'admin'.
    const isAdmin = userObject && userObject.rank === 'admin';
    // This initializes the variable 'showModal' and the function 'setShowModal' which are set to equal the React hook 'useState' which has an initial value of 'false'.
    // When the 'setShowModal' function is called and passed a value of either 'true' or 'false' that value will be assigned as the new value of the variable 'showModal'.
    const [showModal, setShowModal] = useState(false);
    // This initializes the variable 'editedUserName' and the function 'setEditedUserName' which are set to equal the React hook 'useState' which has an initial value of the 'userName' property 
    // stored in the 'highScore' object. When the 'setEditedUserName' function is called and passed a value, that value will be assigned as the new value of the variable 'editedUserName'.
    const [editedUserName, setEditedUserName] = useState(highScore.userName);
    // This initializes the variable 'editedScore' and the function 'setEditedScore' which are set to equal the React hook 'useState' which has an initial value of the 'score' property 
    // stored in the 'highScore' object. When the 'setEditedScore' function is called and passed a value, that value will be assigned as the new value of the variable 'editedScore'.
    const [editedScore, setEditedScore] = useState(highScore.score);

    // This is the 'deleteButton' function.
    const deleteButton = async () => {
        // If there is no 'user' object execute the code within the IF statement.
        if (!user) {
            return
        }
        // Here data is 'fetched' from 'http://localhost:9000/api/highScores/' + the unique id of the specific highScore entry, using 'await' which pauses the execution of the function until it's completed.
        await fetch('http://localhost:9000/api/highScores/' + highScore._id, {
            // This declares the HTTP method used for the request, here 'DELETE' is used to delete the database entry that matches the unique id of the specific highScore entry.
            method: 'DELETE',
            headers: {
                // This sends the authorisation header with the users token to the server with the fetch request.
                'Authorization': `Bearer ${user.token}`
            }
        })
    }
    // This is the 'editButton' function.
    const editButton = () => {
        // Here the 'setShowModal' method is passed the boolean value of 'true'. When this is called the modal will be visible.
        setShowModal(true); 
    };
    // This is the 'closeModal' function.
    const closeModal = () => {
        // Here the 'setShowModal' method is passed the boolean value of 'false'. When this is called the modal will be hidden.
        setShowModal(false);
    };
    // This is the 'handleSaveChanges' function.
    const handleSaveChanges = async () => {
        if (!user) {
            return
        }
        try {
            // This creates an object containing all the updated highScore information.
            const updatedHighScore = {
                // Updated highScore name
                userName: editedUserName,
                // Updated highScore score
                score: editedScore,
            };    
            // Here data is 'fetched' from 'http://localhost:9000/api/highScores/' + the unique id of the specific highScore entry, using 'await' which pauses the execution of the function until it's completed.
            const response = await fetch('http://localhost:9000/api/highScores/' + highScore._id, {
                // This declares the HTTP method used for the request, here 'PATCH' is used to update the database entry that matches the unique id of the specific highScore entry.
                method: 'PATCH', // Use the PUT method for updating
                // This sets the content type to JSON.
                headers: {
                    'Content-Type': 'application/json',
                    // This sends the authorisation header with the users token to the server with the fetch request.
                    'Authorization': `Bearer ${user.token}`
                },
                // Here 'JSON.stringify' is passed the variable 'updatedHighScore' containing the JavaScript updatedHighScore object to convert the object into JSON string and the set it as the request body.
                body: JSON.stringify(updatedHighScore),
            });    
            // This 'IF' statement declares that fi the response from the server is successful (status code 200-299) execute the code within the code block.
            if (response.ok) {
                // This parses the 'response' from a JSON string into a JavaScript object using 'await' which pauses the execution of the function until it's completed, then assigns the JavaScript object to the variable 'updatedHighScoreFromServer'.
                const updatedHighScoreFromServer = await response.json();
                // Here 'setEditedUserName' function is called and passed the 'userName' property stored in the 'updatedHighScoreFromServer' object updating the previous highScore 'name' with the edited version.
                setEditedUserName(updatedHighScoreFromServer.userName);
                // Here 'setEditedScore' function is called and passed the 'score' property stored in the 'updatedHighScoreFromServer' object updating the previous highScore 'score' with the edited version.
                setEditedScore(updatedHighScoreFromServer.score);
                // This calls the 'closeModal' funtion closing the modal after a successful update.
                closeModal();
            }
            // This 'ELSE' statement is for handling update failure events.  
            else {                
                // Here 'console.error' is used to display the error message 'Failed to update highScore'.
                console.error('Failed to update highScore');
            }
        }
        // This 'CATCH' statement is for handling update error events.   
        catch (error) {
            // Here 'console.error' is used to display the error message 'Error updating highScore:' and the error object itself.
            console.error('Error updating highScore:', error);
        }
    };      

    // When 'HighScoreInfo' is called it returns the code within the parenthesis.
     return (        
        <div className="highScore_info">
            {/* Conditionally render email for admin */}
            {isAdmin && highScore.email && (
            <h4><strong>Email: </strong>{highScore.email}</h4>        )}
            {/* This outputs the 'userName' property of the 'highScore' object as a 'H4' heading*/} 
            <h4>{highScore.userName}</h4>
            {/* This outputs the 'score' property of the 'highScore' object */} 
            <p><strong>Score : </strong>{highScore.score}</p>
            {/* This outputs the 'createdAt' property of the 'highScore' object */} 
            <p>{formatDate(highScore.createdAt)}</p>
            {/* Conditionally render edit and delete buttons for the admin */}
            {isAdmin && (
                <div>
                    {/* This creates an edit button with an 'onClick' event handler that calls the 'editButton' function */} 
                    <span className="editButton" onClick={editButton}>Edit</span>
                    {/* This creates a delete button with an 'onClick' event handler that calls the 'deleteButton' function */} 
                    <span className="deleteButton" onClick={deleteButton}>Delete</span>
                </div>
            )}
            {/* This is a conditional statement wherein the modal will only render if 'showModal' is 'true' */} 
            {showModal && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>Edit HighScore</h2>
                        <form>
                            <label>HighScore Name:</label>
                            <input
                                // This sets the expected input as text.
                                type="text"
                                // Here value of the 'HighScore Name' form field is set to be populated with the value of the variable 'editedUserName'.
                                value={editedUserName}
                                // Here the 'onChange' event handler is passed the event object 'e', then the 'setEditedUserName' function is called which is passed 'e.target.value' which contains the value 
                                // of the event object which is the users updated data which updates the state of the variable 'editedUserName'.
                                onChange={(e) => setEditedUserName(e.target.value)}
                            />
                            <label>Score :</label>
                            <input
                                // This sets the expected input as number adding clickable arrows to the form for ease of use in increasing the value.
                                type="text"
                                // Here value of the 'Score' form field is set to be populated with the value of the variable 'editedScore'.
                                value={editedScore}
                                // Here the 'onChange' event handler is passed the event object 'e', then the 'setEditedScore' function is called which is passed 'e.target.value' which contains the value 
                                // of the event object which is the users updated data which updates the state of the variable 'editedScore'.
                                onChange={(e) => setEditedScore(e.target.value)}
                            />
                            {/* This is the modal cancel button which calls the 'closeModal' function which cancels the update and closes the modal */}
                            <button className="modalCancelButton" type="button" onClick={closeModal}>Cancel</button>
                            {/* This is the modal save button which calls the 'handleSaveChanges' function which executes the update process and closes the modal */}   
                            <button className="modalSaveButton" type="button" onClick={handleSaveChanges}>Save Changes</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
// This exports the functional component 'HighScoreInfo' as the default export of this module.
export default HighScoreInfo

// This is the 'formatDate' function which has been passed the parameter 'dateString' to convert a date string to a specific format.
export const formatDate = (dateString) => {
    // Here a new 'Date' object from the provided date string is created and assigned as the value of the variable 'createdAt'.
    const createdAt = new Date(dateString);
    // This extracts the day, month, and year from the 'Date' object stored in the variable 'createdAt' returning a formatted date string.
    return `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;
};  