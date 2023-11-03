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
    echo '<span style="color: white;">Hello</span><br>';
    echo '<span style="color: white;">' . $_SESSION['fld_user_id'] . '</span><br>';
    echo '<span style="color: white;">' . $_SESSION['fld_user_name'] . '</span><br>';
    echo '<span style="color: white;">' . $_SESSION['fld_rank'] . '</span><br>';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php
        //--------------------  Reference to 'rank_nav_bar' function on 'functions.php'  --------------------
        rank_nav_bar();
    ?>
    <h1>Index Page Heading</h1>  
    <div>
        <p>Hello <?php echo $_SESSION['fld_user_name']?> this is the index page paragraph.</p>
        <?php
            echo "This is the index page PHP!!!"
        ?>
    </div>
</body>
</html>