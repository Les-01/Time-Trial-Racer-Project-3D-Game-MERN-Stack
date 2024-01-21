// This imports 'AuthorisationContext' from the file 'authorisationContext' within the 'context' folder.
import { AuthorisationContext } from '../context/authorisationContext'
// This imports the 'useContext' hook from the React library.
import { useContext } from 'react'

// This defines the custom hook 'useAuthorisationContext'.
export const useAuthorisationContext = () => {
    // Here the 'useContext' hook is passed 'AuthorisationContext' to access the context data which is then assigned to the variable 'context'.
    const context = useContext(AuthorisationContext)
    // This 'IF' statement checks if the value of the variable 'context' is NOT null or NOT undefined.
    if (!context) {
        // This 'throws' an error which can be caught in a catch statement and halts execution of the code and produces a new error object with the 
        // message 'useAuthorisationContext should be used within an AuthorisationContextProvider'.
        throw Error('useAuthorisationContext must be used within an AuthorisationContextProvider')
    }
    // This returns the context from useContext.
    return context
}