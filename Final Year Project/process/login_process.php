<?php
    // Command to start the session containing 'super gloabal' variables.
    session_start();
    // Link to 'config/conn.php' containing the database connection code and 'functions.php' containing all the application functions.
    // 'require_once' is used instead of 'include' as the require function is designed for when the file is required by your application
    // such as an important file containing configuration variables, without which the application would break. Whereas include is used to 
    // include files that the application flow would continue when not found, such as templates.
    require_once 'conn.php';
    require_once 'functions.php';

    // This 'IF' statement declares that if the submit button has been used to access this proccess page execute the code within the 'IF' statement.
    if (isset($_POST['submit'])) 
    {
        // This assigns the values POSTED to this page using '$_POST' method to the variables to be passed on to a function.
        $varemail = $_POST['Email'];
        // This applies md5 encryption to the value POSTED before assigning it to the variable to be passed to a function.
        $varpassword = md5($_POST['Password']);


        // This 'IF' statement declares that if the 'emptyInputLogin' function does not equal false (so true) execute the code within the statement.
        // The variables passed to the function are within the parenthesis.
        if (emptyInputLogin($varemail, $varpassword) !== false) {
            // This redirects the user to the sign up page, but includes the the error message 'error=emptyinput' in the URL to be retreived with the 'GET' method.
            header("location: ../login.php?error=emptyinput");
            // This ends the process stopping the script from running.
            exit();
        }

        //--------------------  Reference to 'set_session_variables' function on 'functions.php'  --------------------
        set_session_variables($conn, $varemail, $varpassword);

        //--------------------  Reference to 'loginUser' function on 'functions.php'  --------------------
        loginUser($conn, $varemail, $varpassword);       
    }
    // This 'ELSE' statement determines if the the submit button has not been used to access this proccess page execute the code within the 'ELSE' statement.
    else 
    {   
        // This redirects back to the login page.
        header("location: ../login.php");
        // This ends the process stopping the script from running.
        exit();
    }