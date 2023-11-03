<?php
    // Link to 'config/conn.php' containing the database connection code and 'functions.php' containing all the application functions.
    // 'require_once' is used instead of 'include' as the require function is designed for when the file is required by your application
    // such as an important file containing configuration variables, without which the application would break. Whereas include is used to 
    // include files that the application flow would continue when not found, such as templates.
    require_once 'conn.php';
    require_once 'functions.php';      

    // This 'IF' statement declares that if the submit button has been used to access this proccess page execute the code within the 'IF' statement.
    if(isset($_POST['submit']))
    {
        // This assigns the values POSTED to this page using '$_POST' method to the variables to be passed on to a function.
        $varuName = $_POST['uName'];
        $varemail = $_POST['Email'];
        $txt = $_POST['Password'];
        $varpassword = md5($_POST['Password']);
        $varrepeatPassword = md5($_POST['RepeatPassword']);

        // This 'IF' statement declares that if the 'emptyInputSignUp' function does not equal false (so true) execute the code within the statement.
        // The variables passed to the function are within the parenthesis.
        if (emptyInputSignUp($varuName, $varemail, $varpassword, $varrepeatPassword) !== false) {
            // This redirects the user to the sign up page, but includes the the error message 'error=emptyinput' in the URL to be retreived with the 'GET' method.
            header("location: ../sign_up.php?error=emptyinput");
            // This ends the process stopping the script from running.
            exit();
        }

        // This 'IF' statement declares that if the 'invalidEmail' function does not equal false (so true) execute the code within the statement.
        // The variable '$varemail' is passed to the function by placing it within the parenthesis.
        if (invalidEmail($varemail) !== false) {
            // This redirects the user to the sign up page, but includes the the error message 'error=invalidemail' in the URL to be retreived with the 'GET' method.
            header("location: ../sign_up.php?error=invalidemail");
            // This ends the process stopping the script from running.
            exit();
        }

        if (isStrongPassword($txt) !== false) {
            // This redirects the user to the sign up page, but includes the the error message 'error=invalidemail' in the URL to be retreived with the 'GET' method.
            header("location: ../sign_up.php?error=passwordweak");
            // This ends the process stopping the script from running.
            exit();
        }
        

        // This 'IF' statement declares that if the 'passwordMatch' function does not equal false (so true) execute the code within the statement.
        // The variables '$varpassword' and '$varrepeatPassword' are passed to the function by placing them within the parenthesis.
        if (passwordMatch($varpassword, $varrepeatPassword) !== false) {
            // This redirects the user to the sign up page, but includes the the error message 'error=passwordsdontmatch' in the URL to be retreived with the 'GET' method.
            header("location: ../sign_up.php?error=passwordsdontmatch");
            // This ends the process stopping the script from running.
            exit();
        }

        // This 'IF' statement declares that if the 'accountExists' function does not equal false (so true) execute the code within the statement.
        // The variables '$conn' and '$varemail' are passed to the function by placing them within the parenthesis.
        if (accountExists($conn, $varemail) !== false) {
            // This redirects the user to the sign up page, but includes the the error message 'error=accountExists' in the URL to be retreived with the 'GET' method.
            header("location: ../sign_up.php?error=accountExists");
            // This ends the process stopping the script from running.
            exit();
        }

        //--------------------  Reference to 'createUserAccount' function on 'functions.php'  --------------------
        createUserAccount($conn, $varuName, $varemail, $varpassword);
    } 
    
    // If the user gained access to this page without using the submit button execute the code within the 'ELSE' statement.
    else {
        // This redirects the user to the sign up page.
        header("location: sign_up.php");
        // This ends the process stopping the script from running.
        exit();
    }