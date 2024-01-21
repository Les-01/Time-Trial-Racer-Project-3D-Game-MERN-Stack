// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from './useAuthorisationContext'

export const useLogout = () => {
    // This initializes the'dispatch' function from the useAuthorisationContext hook.
    const {dispatch} = useAuthorisationContext()
    const logout = () => {
        // This removes the JSON wen token saved in local storage removing the users authorised login status. 
        localStorage.removeItem('user')
        // This updates the Authorisation Context and triggers the 'LOGOUT' case.
        dispatch({type: 'LOGOUT'})        
    }
    return {logout}
}