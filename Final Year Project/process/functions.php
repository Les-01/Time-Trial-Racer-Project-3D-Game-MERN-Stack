<?php
    //--------------------  This is the function 'emptyInputSignUp'  --------------------
    // The variables in the parenthesis are passed to the function
    function emptyInputSignUp($varuName, $varemail, $varpassword, $varrepeatPassword) 
    {
        // This declares the variable '$result' which will hold of the result of the function.
        $result;
        // This 'IF' statement has the pre built PHP function 'empty' within its parenthesis, which determines if data is stored within an element, in this case variable.
        // The 2 pipe symbols '||' are used as an 'OR' statement, meaning if this variable, OR this variable are empty the value is true. 
        // These variables all must be NOT empty to get a return value of false.
        if (empty($varuName) || empty($varemail) || empty($varpassword) || empty($varrepeatPassword)) 
        { 
            // If there are empty values stored in any of the above variables the value of 'true' is assigned to the variable '$result'.
            $result = true;
        }
        else
        {
            // If there are no empty values stored in any of the above variables the value of 'false' is assigned to the variable '$result'.
            $result= false;
        }
        // This returns the value of the variable $result. 
        return $result;
    }

    //--------------------  This is the function 'invalidEmail'  --------------------
    // The variable in the parenthesis is passed to the function
    function invalidEmail($varemail) 
    {
        // This declares the variable '$result' which will hold of the result of the function.
        $result;
        // This 'IF' statement has the pre built PHP functions 'filter_var' and 'FILTER_VALIDATE_EMAIL' within its parenthesis, which determine if an email is in the correct
        // format, if the email is in the correct format execute the code within the 'IF' statement. 
        // Here this is reversed by using the '!' symbol meaning in this case if the email is NOT in the correct format execute the code in the 'IF statement' reversing the outcome.
        if (!filter_var ($varemail, FILTER_VALIDATE_EMAIL)) 
        {
            // If the email is NOT in the correct format the value of 'true' is assigned to the variable '$result'.
            $result = true;
        }
        else 
        {
            // If the email is in the correct format the value of 'false' is assigned to the variable '$result'.
            $result= false;
        }
        // This returns the value of the variable $result. 
        return $result;
    }

    // function isStrongPassword($varpassword) 
    // {
    //     // This declares the variable '$result' which will hold of the result of the function.
    //     $result;
    //     // Check if the password is at least 8 characters long, contains at least 1 capital letter, contains at least 1 number, and contains at least 1 special character.
    //     if (strlen($varpassword) < 8 || !preg_match('/[A-Z]/', $varpassword) || !preg_match('/[0-9]/', $varpassword) || !preg_match('/[^A-Za-z0-9]/', $varpassword)) 
    //     {
    //         $result = false;
    //     } 
    //     else 
    //     {
    //         $result = true;
    //     }
    //     // This returns the value of the variable $result. 
    //     return $result;
    // }      

    function isStrongPassword($txt) 
    {
        // Check if the plain text password is at least 8 characters long, contains at least 1 capital letter, contains at least 1 number, and contains at least 1 special character.
        if (strlen($txt) < 8 || !preg_match('/[A-Z]/', $txt) || !preg_match('/[0-9]/', $txt) || !preg_match('/[^A-Za-z0-9]/', $txt)) 
        {
            return true; // Password is weak
        } 
        else 
        {
            return false; // Password is strong
        }
    }

    //--------------------  This is the function 'passwordMatch'  --------------------
    // The variables in the parenthesis are passed to the function
    function passwordMatch($varpassword, $varrepeatPassword) 
    {
        // This declares the variable '$result' which will hold of the result of the function.
        $result;
        // This 'IF' statement declares that if the variable '$varpassword' is not equal to the variable '$varrepeatPassword' execute the code within 
        // the statement.
        if ($varpassword !== $varrepeatPassword) 
        {
            // If the variable '$varpassword' is not equal to the variable '$varrepeatPassword' the value of 'true' is assigned to the variable '$result'.
            $result = true;
        }
        else 
        {
            // If the variable '$varpassword' is equal to the variable '$varrepeatPassword' the value of 'false' is assigned to the variable '$result'.
            $result= false;
        }
        // This returns the value of the variable $result.
        return $result; 
    }

    // //--------------------  This is the function 'accountExists' using a prepared SQL statement  --------------------
    // The variables in the parenthesis are passed to the function
    function accountExists($conn, $varemail) 
    {
        // This declares the variable '$result' which will hold of the result of the function.
        $result;
        // SQL SELECT statement to select all from the table 'tbl_users' where the field 'fld_email' is equal to the prepared SQL statement placeholder.
        $sql = "SELECT * FROM `tbl_users` WHERE `fld_email` LIKE ?";        
        // This initialises the prepared sql statement and passes it the variables '$conn' and 'sql'.
        $stmt = mysqli_prepare($conn, $sql);        
        // This 'IF' statement determines if the prepared statement was prepared successfully.
        if ($stmt) 
        {
            // Here the variable $'varemail' is binded to the placeholder.
            mysqli_stmt_bind_param($stmt, "s", $varemail);            
            // This executes the prepared sql statement.
            mysqli_stmt_execute($stmt);            
            // Here the result of the prepared statement is assigned as the value of the variable '$selectResult'.
            $selectResult = mysqli_stmt_get_result($stmt);            
            // This 'IF' statement declares that if a result is found execute the code within the 'IF' statement. 
            if ($row = mysqli_fetch_assoc($selectResult)) 
            {
                // This returns the value of the variable '$row'.
                return $row;
            } 
            // This 'ELSE' statement declares that if a result is not found execute the code within the 'ELSE' statement. 
            else 
            {
                // This assigns the value of the variable '$result' to false.
                $result = false;
                // This returns the value of the variable '$result'.
                return $result;
            }
        } 
        else 
        {
            // If unsuccessfull the user is redirected to sign_up.php with the 'sql_error' message.
            header("location: ../sign_up.php?error=sql_error");
        }
    }
    

    //--------------------  This is the function 'createUserAccount' using a prepared SQL statement  --------------------
    function createUserAccount($conn, $varuName, $varemail, $varpassword) {
        // SQL INSERT statement to insert user information into 'tbl_users' using prepared SQL statement placeholders.
        $sql = "INSERT INTO `final_year_project`.`tbl_users` (`fld_user_id`, `fld_user_name`, `fld_email`, `fld_password`, `fld_gamer_score`, `fld_rank`) VALUES (NULL, ?, ?, ?, 0, 'user')";
        // This initialises the prepared sql statement and passes it the variables '$conn' and 'sql'.
        $stmt = mysqli_prepare($conn, $sql);
        // This 'IF' statement determines if the prepared statement was prepared successfully.
        if ($stmt === false) {
            // If the statement fails redirect the user to sign_up.php with the 'sql_error' message.
            header("location: ../sign_up.php?error=sql_error");
            exit();
        }
    
        // Here the variables '$varuName', '$varemail' and '$varpassword' are binded to their placeholders.
        mysqli_stmt_bind_param($stmt, "sss", $varuName, $varemail, $varpassword);    
        // This executes the prepared sql statement.
        if (mysqli_stmt_execute($stmt)) 
        {
            // If successfull the user is redirected to sign_up.php with a success message
            header("location: ../sign_up.php?error=none");
        } 
        else 
        {
            // If unsuccessfull the user is redirected to sign_up.php with the 'sql_error' message.
            header("location: ../sign_up.php?error=sql_error");
        }
    
        // This closes the prepared sql statement
        mysqli_stmt_close($stmt);
    }
    

    //--------------------  This is the function 'emptyInputLogin'  --------------------
    // The variables in the parenthesis are passed to the function
    function emptyInputLogin($varemail, $varpassword) 
    {
        // This declares the variable '$result' which will hold of the result of the function.
        $result;
        // This 'IF' statement has the pre built PHP function 'empty' within its parenthesis, which determines if data is stored within an element, in this case a variable.
        // The 2 pipe symbols '||' are used as an 'OR' statement, meaning if this variable, OR this variable are empty the value is true. 
        // These variables all must be NOT empty to get a return value of false.
        if (empty($varemail) || empty($varpassword)) 
        {
            // If there are empty values stored in any of the above variables the value of 'true' is assigned to the variable '$result'.
            $result = true;
        } 
        else 
        {
            // If there are no empty values stored in any of the above variables the value of 'false' is assigned to the variable '$result'.
            $result= false;
        }
        // This returns the value of the variable '$result'.
        return $result;
    }

    // //--------------------  This is the function 'loginUser' using prepared sql statements --------------------
    function loginUser($conn, $varemail, $varpassword) 
    {
        // This declares the variable '$result' which will hold of the result of the function.
        $result;
        // SQL SELECT statement to select all from the table 'tbl_users' where the field 'fld_email' and 'fld_password' are both equal to the prepared SQL statement placeholders.
        $sql = "SELECT * FROM `final_year_project`.`tbl_users` WHERE `fld_email` LIKE ? AND `fld_password` LIKE ?";
        // This initialises the prepared sql statement and passes it the variables '$conn' and 'sql'.
        $stmt = mysqli_prepare($conn, $sql);    
        // This 'IF' statement determines if the prepared statement was prepared successfully.
        if ($stmt) 
        {
            // Here the variables '$varemail' and '$varpassword' are bindeded to their placeholders.
            mysqli_stmt_bind_param($stmt, "ss", $varemail, $varpassword);    
            // This executes the prepared sql statement.
            mysqli_stmt_execute($stmt);    
            // Here the result of the prepared statement is assigned as the value of the variable 'result'.
            $result = mysqli_stmt_get_result($stmt);    
            // This declares that the number of rows found in the variable '$result' will be assigned to the variable '$row_count'
            $row_count = mysqli_num_rows($result);
    
            if ($row_count > 0) 
            {
                // This places an 'error=success' message in the URL to be retreived with a 'GET' function and redirects to 'index.php' page to display a message.
                header("location: ../index.php?error=success");
                // This end the process and stops the script from running.
                exit();
            } 
            else 
            {
                // Place an 'error=norecordfound' message in the URL to be retrieved with a GET function and redirect to 'login.php' page to display a message.
                header("location: ../login.php?error=norecordfound");
                // This end the process and stops the script from running.
                exit();
            }
        }
    }

    // //--------------------  This is the function 'set_session_variables' using prepared sql statements --------------------
    function set_session_variables($conn, $varemail, $varpassword) 
    {
        // SQL SELECT statement to select all from the table 'tbl_users' where the field 'fld_email' is equal to the prepared SQL statement placeholder.
        $sql = "SELECT * FROM `tbl_users` WHERE `fld_email` = ?";    
        // This initialises the prepared sql statement and passes it the variables '$conn' and 'sql'.
        $stmt = mysqli_prepare($conn, $sql);    
        // This 'IF' statement determines if the prepared statement was prepared successfully.
        if ($stmt) 
        {
            // Here the variable '$varemail' is binded to the placeholder.
            mysqli_stmt_bind_param($stmt, "s", $varemail);    
            // This executes the prepared sql statement.
            mysqli_stmt_execute($stmt);    
            // Here the result of the prepared statement is assigned as the value of the variable 'result'.
            $result = mysqli_stmt_get_result($stmt);    
            // This 'IF' statement declares that if the value of the variable '$result' and the number of rows is greater than zero execute the code within the statement.
            if ($result && mysqli_num_rows($result) > 0) {
                // This assigns the result of the query as an associative array to the variable '$user_data'.
                $user_data = mysqli_fetch_assoc($result);    
                // This 'IF' statement declares that if the value of the variable '$user_data['fld_password']' is equal to the value of the variable '$varpassword' execute the code within the statement.
                if ($user_data['fld_password'] === $varpassword) 
                {
                    //This sets various values from the query as 'Super Global' session variables to be used throughout the application.
                    $_SESSION['fld_user_id'] = $user_data['fld_user_id'];
                    $_SESSION['fld_user_name'] = $user_data['fld_user_name'];
                    $_SESSION['fld_rank'] = $user_data['fld_rank'];
                }
                else
                {
                    header("location: ../sign_up.php?error=sql_error");
                }
            }
        }
        else {
            echo "Error: " . mysqli_error($conn); // Check for SQL errors
        }
    }    
    
    //--------------------  This is the function 'check_login'  --------------------
    // The variables in the parenthesis are passed to the function
    function check_login($conn)
    {
        // This 'IF' statement determines if SESSION is set and if the value 'fld_user_id' is stored in it.
        if(isset($_SESSION['fld_user_id']))
        {
            // If SESSION is set with the value 'fld_user_id' stored in it, assign that value to the variable '$uID'.
            $uID = $_SESSION['fld_user_id'];
            // SQL SELECT statement to select all from 'tbl_users' where the field 'fld_user_id' is equal to the variable '$uID', limited to 1 result.
            $sql = "SELECT * FROM `tbl_users` WHERE `fld_user_id` LIKE '$uID' limit 1";
            // This passes the variables $conn and $sql to the the function 'mysqli_query' and assigns the result of the query to the variable '$result'
            $result = mysqli_query($conn, $sql);
            // If the result and number of rows is greater than zero execute the code in the statement.
            if($result && mysqli_num_rows($result) > 0)
            {
                // This assigns the result of the query as an associative array to the variable '$user_data'.
                $user_data = mysqli_fetch_assoc($result);
                // This returns the value of the variable 'user_data'.
                return $user_data;
            }
        }
    
        // This places an 'error=nosessionfound' message in the URL to be retreived with a 'GET' function and redirects to 'login.php' page to display a message.
        header("location: login.php?error=nosessionfound");
        // This ends the process stopping the script from running.        
        exit;
    }

      //--------------------  This is the function 'rank_nav_bar'  --------------------
    function rank_nav_bar()
    {
        // This 'IF' statement declares that if SESSION is set and there is a value stored in '$_SESSION[fld_rank]' execute the code within the statement.
        if (isset($_SESSION['fld_rank']))
        {
            // This declares the variable '$rank' and assigns the value of the variable '$_SESSION['fld_rank']' to it.
            $rank = $_SESSION['fld_rank'];
            
             // This 'IF' statement declares that if the value contained in the variable '$rank' is "admin" execute the code within the 'IF' statement.
            if ($rank === "admin")
            {
                // This will include the Admins navigation bar.
                include_once 'nav_bars/admin_nav.php';
            }            
            // This 'ELSE' statement declares that if the value contained in the variable '$rank' is not "admin or ""secretary" execute the code within the 'ELSE' statement.
            else
            {
                // This will include the Users or Members navigation bar.
                include_once 'nav_bars/user_nav.php';
            }
        } 
        else 
        {
            // If no session is set or 'fld_rank' is not defined, include the default user navigation bar.
            include_once 'nav_bars/user_nav.php';
        }
    }   

    function login_logout_but()
    {
        // This 'IF' statement declares that if SESSION is set and there is a value stored in '$_SESSION[fld_user_id]' execute the code within the statement.
        if(isset($_SESSION['fld_user_id']))
        {
            echo '<li><a href="logout.php" style="color: white">Log Out</a></li>';
        } 
        else 
        {
            echo '<li><a href="sign_up.php" style="color: white">Sign Up</a></li>';
            echo '<li><a href="login.php" style="color: white">Login</a></li>';
        }
    }