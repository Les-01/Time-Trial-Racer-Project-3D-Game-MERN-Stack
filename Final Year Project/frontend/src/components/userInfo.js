// This imports the 'useState' hook from the React library.
import React, { useState } from 'react';
// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from '../hooks/useAuthorisationContext'

// This is the functional component 'UserInfo' which has been passed the object 'user'.
const UserInfo = ({userObject}) => {
    // This initialises the object 'user' and assigns 'useAuthorisationContext' as its value.  
    const {user} = useAuthorisationContext()

    // This initializes the variable 'showModal' and the function 'setShowModal' which are set to equal the React hook 'useState' which has an initial value of 'false'.
    // When the 'setShowModal' function is called and passed a value of either 'true' or 'false' that value will be assigned as the new value of the variable 'showModal'.
    const [showModal, setShowModal] = useState(false);
    // This initializes the variable 'editedUserName' and the function 'setEditedUserName' which are set to equal the React hook 'useState' which has an initial value of the 'userName' property 
    // stored in the 'user' object. When the 'setEditedUserName' function is called and passed a value, that value will be assigned as the new value of the variable 'editedUserName'.
    const [editedUserName, setEditedUserName] = useState(userObject.userName);
    // This initializes the variable 'editedEmail' and the function 'setEditedEmail' which are set to equal the React hook 'useState' which has an initial value of the 'email' property 
    // stored in the 'user' object. When the 'setEditedEmail' function is called and passed a value, that value will be assigned as the new value of the variable 'editedEmail'.
    const [editedEmail, setEditedEmail] = useState(userObject.email);
    // This initializes the variable 'editedPassword' and the function 'setEditedPassword' which are set to equal the React hook 'useState' which has an initial value of the 'password' property 
    // stored in the 'user' object. When the 'setEditedPassword' function is called and passed a value, that value will be assigned as the new value of the variable 'editedPassword'.
    const [editedPassword, setEditedPassword] = useState(userObject.password);
    // This initializes the variable 'editedRank' and the function 'setEditedRank' which are set to equal the React hook 'useState' which has an initial value of the 'rank' property 
    // stored in the 'user' object. When the 'setEditedRank' function is called and passed a value, that value will be assigned as the new value of the variable 'editedRank'.
    const [editedRank, setEditedRank] = useState(userObject.rank);

    // This is the 'deleteButton' function.
    const deleteButton = async () => {
        if (!user) {
            return
        }
        // Here data is 'fetched' from 'http://localhost:9000/api/user/admin/' + the unique id of the specific user entry, using 'await' which pauses the execution of the function until it's completed.
        await fetch('http://localhost:9000/api/user/admin/' + userObject._id, {
            // This declares the HTTP method used for the request, here 'DELETE' is used to delete the database entry that matches the unique id of the specific user entry.
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
            // This creates an object containing all the updated user information.
            const updatedUser = {
                // Updated user name
                userName: editedUserName,
                // Updated user email
                email: editedEmail,
                // Updated user password
                password: editedPassword,
                // Updated user rank
                rank: editedRank,
            };    
            // Here data is 'fetched' from 'http://localhost:9000/api/user/admin/' + the unique id of the specific user entry, using 'await' which pauses the execution of the function until it's completed.
            const response = await fetch('http://localhost:9000/api/user/admin/' + userObject._id, {
                // This declares the HTTP method used for the request, here 'PATCH' is used to update the database entry that matches the unique id of the specific user entry.
                method: 'PATCH', // Use the PUT method for updating
                // This sets the content type to JSON.
                headers: {
                    'Content-Type': 'application/json',
                    // This sends the authorisation header with the users token to the server with the fetch request.
                    'Authorization': `Bearer ${user.token}`
                },
                // Here 'JSON.stringify' is passed the variable 'updatedUser' containing the JavaScript updatedUser object to convert the object into JSON string and the set it as the request body.
                body: JSON.stringify(updatedUser),
            });    
            // This 'IF' statement declares that fi the response from the server is successful (status code 200-299) execute the code within the code block.
            if (response.ok) {
                // This parses the 'response' from a JSON string into a JavaScript object using 'await' which pauses the execution of the function until it's completed, then assigns the JavaScript object to the variable 'updatedUserFromServer'.
                const updatedUserFromServer = await response.json();
                // Here 'setEditedUserName' function is called and passed the 'userName' property stored in the 'updatedUserFromServer' object updating the previous user 'name' with the edited version.
                setEditedUserName(updatedUserFromServer.userName);
                // Here 'setEditedEmail' function is called and passed the 'email' property stored in the 'updatedUserFromServer' object updating the previous user 'email' with the edited version.
                setEditedEmail(updatedUserFromServer.email);
                // Here 'setEditedPassword' function is called and passed the 'password' property stored in the 'updatedUserFromServer' object updating the previous user 'password' with the edited version.
                setEditedPassword(updatedUserFromServer.password);    
                // Here 'setEditedRank' function is called and passed the 'rank' property stored in the 'updatedUserFromServer' object updating the previous user 'rank' with the edited version.
                setEditedRank(updatedUserFromServer.rank);    
                // This calls the 'closeModal' funtion closing the modal after a successful update.
                closeModal();
            }
            // This 'ELSE' statement is for handling update failure events.  
            else {                
                // Here 'console.error' is used to display the error message 'Failed to update user'.
                console.error('Failed to update user');
            }
        }
        // This 'CATCH' statement is for handling update error events.   
        catch (error) {
            // Here 'console.error' is used to display the error message 'Error updating user:' and the error object itself.
            console.error('Error updating user:', error);
        }
    };      

    // When 'UserInfo' is called it returns the code within the parenthesis.
     return (        
        <div className="user_info">
            {/* This outputs the 'userName' property of the 'user' object as a 'H4' heading*/} 
            <h4>{userObject.userName}</h4>
            {/* This outputs the 'weight' property of the 'user' object */} 
            <p><strong>Email: </strong>{userObject.email}</p>
            {/* This outputs the 'reps' property of the 'user' object */} 
            <p><strong>Password: </strong>{userObject.password}</p>
            {/* This outputs the 'createdAt' property of the 'user' object */} 
            <p><strong>Rank: </strong>{userObject.rank}</p>
            {/* This creates a edit button with an 'onClick' event handler with calls the 'editButton' function */} 
            <span className="editButton" onClick={editButton}>Edit</span>
            {/* This creates a delete button with an 'onClick' event handler with calls the 'deleteButton' function */} 
            <span className="deleteButton" onClick = {deleteButton}>Delete</span>
            {/* This is a conditional statement wherein the modal will only render if 'showModal' is 'true' */} 
            {showModal && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>Edit User Details</h2>
                        <form>
                            <label>User Name:</label>
                            <input
                                // This sets the expected input as text.
                                type="text"
                                // Here value of the 'User Name' form field is set to be populated with the value of the variable 'editedUserName'.
                                value={editedUserName}
                                // Here the 'onChange' event handler is passed the event object 'e', then the 'setEditedUserName' function is called which is passed 'e.target.value' which contains the value 
                                // of the event object which is the users updated data which updates the state of the variable 'editedUserName'.
                                onChange={(e) => setEditedUserName(e.target.value)}
                            />
                            <label>Email (kg):</label>
                            <input
                                // This sets the expected input as text.
                                type="text"
                                // Here value of the 'Email' form field is set to be populated with the value of the variable 'editedEmail'.
                                value={editedEmail}
                                // Here the 'onChange' event handler is passed the event object 'e', then the 'setEditedEmail' function is called which is passed 'e.target.value' which contains the value 
                                // of the event object which is the users updated data which updates the state of the variable 'editedEmail'.
                                onChange={(e) => setEditedEmail(e.target.value)}
                            />
                            <label>Password:</label>
                            <input
                                // This sets the expected input as text.
                                type="text"
                                // Here value of the 'Password' form field is set to be populated with the value of the variable 'editedPassword'.
                                value={editedPassword}
                                // Here the 'onChange' event handler is passed the event object 'e', then the 'setEditedPassword' function is called which is passed 'e.target.value' which contains the value 
                                // of the event object which is the users updated data which updates the state of the variable 'editedPassword'.
                                onChange={(e) => setEditedPassword(e.target.value)}
                            />
                            <label>Rank:</label>
                            <input
                                // This sets the expected input as text.
                                type="text"
                                // Here value of the 'Rank' form field is set to be populated with the value of the variable 'editedRank'.
                                value={editedRank}
                                // Here the 'onChange' event handler is passed the event object 'e', then the 'setEditedRank' function is called which is passed 'e.target.value' which contains the value 
                                // of the event object which is the users updated data which updates the state of the variable 'editedRank'.
                                onChange={(e) => setEditedRank(e.target.value)}
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
// This exports the functional component 'UserInfo' as the default export of this module.
export default UserInfo

// This is the 'formatDate' function which has been passed the parameter 'dateString' to convert a date string to a specific format.
export const formatDate = (dateString) => {
    // Here a new 'Date' object from the provided date string is created and assigned as the value of the variable 'createdAt'.
    const createdAt = new Date(dateString);
    // This extracts the day, month, and year from the 'Date' object stored in the variable 'createdAt' returning a formatted date string.
    return `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;
};