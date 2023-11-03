<html>
    <head>
    </head>
    <body>
        <nav>
            <ul>
                <li><a href="index.php" style="color: white">Home</a></li>
                <li><a href="profile.php" style="color: white">Profile</a></li>
                <li><a href="game.php" style="color: white">Game</a></li>
                <li><a href="about.php" style="color: white">About</a></li>
                <li><a href="sign_up.php" style="color: white">Sign Up</a></li>
                <li><a href="login.php" style="color: white">Login</a></li>
            </ul>
        </nav>
        <div class="in-out">
            <?php
               // Link to 'functions.php' containing all the application functions.
               // 'require_once' is used instead of 'include' as the require function is designed for when the file is required by your application
               // such as an important file containing configuration variables, without which the application would break. Whereas include is used to 
               // include files that the application flow would continue when not found, such as templates. 
               require_once 'process/functions.php';
               //--------------------  Reference to 'sign_log_but' function on 'functions.php'  --------------------
               sign_log_but();
               ?>      
       </div>
    </body>
</html>
