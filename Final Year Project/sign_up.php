<?php
    // Command to start the session containing 'super gloabal' variables.
    session_start();
    // Link to 'config/conn.php' containing the database connection code and 'functions.php' containing all the application functions.
    // 'require_once' is designed for when the file is required by your application
    // such as an important file containing configuration variables, without which the application would break. 
    require_once 'process/conn.php';
    require_once 'process/functions.php';
    //--------------------  Reference to 'check_login' function on 'functions.php'  --------------------
    //check_login($conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php
        //--------------------  Reference to 'rank_nav_bar' function on 'functions.php'  --------------------
        rank_nav_bar();
    ?>
    <!--------------------  Sign Up Form Box, POSTS values to 'sign_up_process.php'  -------------------->
    <div class="sign_up_form-box">		
                          <h2>Sign Up</h2>
                          <form action="process/sign_up_process.php" method="post">
                            <input placeholder="User Name" type="text" name="uName"> 
                            <input placeholder="Email" type="text" name="Email"> 
                            <input placeholder="Password" type="password" name="Password"> 
                            <input placeholder="Repeat Password" type="password" name="RepeatPassword"> 
                            <button type="submit" name="submit">Sign Up</button>
                          </form><br>
        <!---------------  This is the login feed back Div which uses the 'GET' method to retreive error messages from the URL sent from the functions page  --------------->
                          <div class="feedback">    
                              <?php
                                  if (isset($_GET["error"])) {
                                    if ($_GET["error"] == "emptyinput") {
                                      echo "<h2>Please fill in all fields</h2>";
                                    }
                                    else if ($_GET["error"] == "invalidemail") {
                                      echo "<h2>Invalid email</h2>";
                                    }
                                    else if ($_GET["error"] == "passwordsdontmatch") {
                                      echo "<h2>Passwords dont match</h2>";
                                    }
                                    else if ($_GET["error"] == "passwordweak") {
                                      echo "<h2>Password must be 8 characters long, contain 1 capital letter, 1 number, and 1 special character.</h2>";
                                    }
                                    else if ($_GET["error"] == "accountExists") {
                                      echo "<h2>Account already exists</h2>";
                                    }
                                    else if ($_GET["error"] == "sql_error") {
                                      echo "<h2>Sql error statement failed</h2>";
                                    }
                                    else if ($_GET["error"] == "none") {                                        
                                      echo "<h2>You have signed up!</h2>";
                                      sleep(3);
                                    }
                                  }
                                ?> 
                          </div>                                     
                  </div>                    
</body>
</html>

