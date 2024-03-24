// App.js
// This imports the 'BrowserRouter', 'Routes' and 'Route' components from the routing library 'React Router'.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// This imports 'useAuthorisationContext' from the file 'useAuthorisationContext' within the 'hooks' folder.
import { useAuthorisationContext } from './hooks/useAuthorisationContext'
// This imports the variable 'Home' from the file 'home' in the 'webPages' folder.
import Home from './webPages/home'
// This imports the variable 'Game' from the file 'game' in the 'webPages' folder.
import Game from './webPages/game'
// This imports the variable 'HighScoreTable' from the file 'highScoreTable' in the 'webPages' folder.
import HighScoreTable from './webPages/highScoreTable'
// This imports the variable 'Home' from the file 'home' in the 'webPages' folder.
import Admin from './webPages/admin'
// This imports the variable 'Home' from the file 'home' in the 'webPages' folder.
import Signup from './webPages/signup'
// This imports the variable 'Home' from the file 'home' in the 'webPages' folder.
import Login from './webPages/login'
// This imports the variable 'NavBar' from the file 'navBar' in the 'components' folder.
import NavBar from './components/navBar'

// This is the functional component 'App'.
function App() {
   // This initialises the object 'user' and assigns 'useAuthorisationContext' as its value.  
   const {user} = useAuthorisationContext()
  // When 'App' is called it returns the code within the parenthesis.
  return (
    <div className="App">
      {/* This is the 'BrowserRouter' component which enables client side routing.*/}
      <BrowserRouter>
        {/* This is the 'NavBar' component, it's called outside of the 'Routes' component enabling it to appear on every page.*/}
        <NavBar />
        <div className = "sitePages">
          {/* This is the 'Routes' component which contains all the routes.*/}
          <Routes>
            {/* This is a 'Route' component which defines the specific route to the Home component.*/}
            {/* A ternary operator is used which enables access to the 'Home' component if the user is logged in otherwise the user is redirected to the 'Login' component.*/}
            <Route
              path="/"              
              element = {user ? <Home /> : <Navigate to ="/login" />}
            />
            {/* This is a 'Route' component which defines the specific route to the Home component.*/}
            {/* A ternary operator is used which enables access to the 'Home' component if the user is logged in otherwise the user is redirected to the 'Login' component.*/}
            <Route
            path="/game"           
              element = {user ? <Game /> : <Navigate to ="/login" />}
            />
            {/* This is a 'Route' component which defines the specific route to the Home component.*/}
            {/* A ternary operator is used which enables access to the 'Home' component if the user is logged in otherwise the user is redirected to the 'Login' component.*/}
            <Route
              path="/highScoreTable"              
              element = {user ? <HighScoreTable /> : <Navigate to ="/login" />}
            />
            {/* This is a 'Route' component which defines the specific route to the admin component.*/}
            {/* A ternary operator is used which enables access to the 'Home' component if the user is logged in otherwise the user is redirected to the 'Login' component.*/}
            <Route
              path="/admin"              
              element = {<Admin />}
            />
            {/* This is a 'Route' component which defines the specific route to the Signup component.*/}
            {/* A ternary operator is used which enables access to the 'Signup' component if the user is NOT logged in otherwise the user is redirected to the 'Home' component.*/}
            <Route
              path="/signup"
              element = {!user ? <Signup /> : <Navigate to="/" />}
            />
            {/* This is a 'Route' component which defines the specific route to the Login component.*/}
            {/* A ternary operator is used which enables access to the 'Login' component if the user is NOT logged in otherwise the user is redirected to the 'Home' component.*/}
            <Route    
              path="/login"
              element = {!user ? <Login /> : <Navigate to="/" />}
            />            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
// This exports the functional component 'App' as the default export of this module.
export default App;