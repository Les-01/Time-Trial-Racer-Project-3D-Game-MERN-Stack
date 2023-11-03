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
<html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login</title>
      <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
      <?php
          //--------------------  Reference to 'rank_nav_bar' function on 'functions.php'  --------------------
          rank_nav_bar();
      ?>
      <!--------------------  Login Form Box, POSTS values to 'login_process.php'  -------------------->
      <div class="login_form-box">		                    
                      <h2>Login</h2>
                      <form action="process/login_process.php" method="post">
                      <input placeholder="Email" type="text" name="Email"> 
                      <input placeholder="Password" type="password" name="Password"> 
                      <button type="submit" name="submit">Login</button>
                      </form><br>
          <!---------------  This is the login validation feed back Div which uses the 'GET' method to retreive error messages from the URL sent from the functions page  --------------->
                      <div class="feedback">    
                          <?php
                              if (isset($_GET["error"])) {
                                if ($_GET["error"] == "emptyinput") {
                                  echo "<h2>Please fill in all fields</h2>";
                                }                               
                                else if ($_GET["error"] == "norecordfound") {
                                  echo "<h2>Incorrect email or Password</h2>";
                                }   
                                else if ($_GET["error"] == "nosessionfound") {
                                  echo "<h2>Please Login</h2>";
                                }       
                              }
                            ?> 
                        </div>                    
                  </div>  
  </body>
</html>

