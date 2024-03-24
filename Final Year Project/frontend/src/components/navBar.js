// This imports the 'Link' component from the routing library 'React Router'.
import {Link} from 'react-router-dom'
// This imports the 'useLogout' function from the file 'useLogout' within the 'hooks' folder.
import { useLogout } from '../hooks/useLogout'
// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from '../hooks/useAuthorisationContext'

// This is the functional component 'NavBar'.
const NavBar = () => {
    // This destructures the 'logout' function from the 'useLogout' hook enabling it to be used.
    const {logout} = useLogout()
    // This retrieves the 'user' object from 'useAuthorisationContext'
    const {user} = useAuthorisationContext()
    // This is the 'logoutBtnHandler' function which executes when the logout button is click.
    const logoutBtnHandler = () => {
        // This is the 'logout' function.
        logout()
    }
    // When 'NavBar' is called it returns the code within the parenthesis.
    return (
        <header>
            <div className = "container">
                <nav className="home-link">
                    {/* This is a link component used to navigate to the root URL '/' */}
                    <Link to = "/">
                        {/* This is a H1 heading displaying the text 'Gym Log' */}
                        <h1>Time Trial Racer</h1>
                    </Link>
                </nav>
                {/* Centered Links */}
                <nav className="centered-links">
                    <Link to="/game">Play Game</Link>
                    <Link to="/highScoreTable">High Scores</Link>  
                    {/* Display "Admin" link only if the user is logged in and their rank is "admin" */}
                    {user && user.rank === 'admin' && (
                        <Link to="/admin">Admin</Link>
                    )}
                </nav>
                {/* Links pushed to the right */}
                <nav className="right-links">
                    {/* This is a conditional check, it checks if the variable 'user' has a value if it does render the content within the statement */}
                    {user && (
                        <div>
                            <span style={{color: 'white'}}>{user.email} </span>
                            {/* Logout button triggering the 'logoutBtnHandler' function */}
                            <button onClick = {logoutBtnHandler}>Logout</button>
                        </div>
                    )}                    
                    {/* This is a conditional check, it checks if the variable 'user' does NOT have a value if it does NOT render the content within the statement */}
                    {!user && (
                        <div>
                            {/* Nav Bar links to routes */}
                            <Link to = "/login">Login</Link>
                            <Link to = "/signup">Signup</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}
// This exports the functional component 'NavBar' as the default export of this module.
export default NavBar