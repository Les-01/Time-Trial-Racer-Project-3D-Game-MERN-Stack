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
    <title>High Score</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <?php
        //--------------------  Reference to 'rank_nav_bar' function on 'functions.php'  --------------------
        rank_nav_bar();
    ?>
    <h1>High Score Page Heading</h1>
    <div>
        <!--------------------  HTML Table Column Headings  -------------------->
        <table class="styled-table">
                        <thead>
                            <tr>
                                <th>User Name</th>                                                         
                                <th>Score</th> 
                            </tr>
                        </thead>
            <!--------------------  HTML Table Body  -------------------->
                        <tbody>
                            <?php
                                // SQL SELECT statement to select fld_member_id, fld_first_name, and fld_last_name from the members table, fld_image_points and 'SUM(fld_image_points)' from the images table, 
                                // in descending order by  SUM(fld_image_points), grouping the results by member ID.
                                $sql = "SELECT tbl_users.fld_user_name, tbl_high_score.fld_score
                                FROM `final_year_project`.`tbl_users`, `tbl_high_score` 
                                WHERE tbl_users.fld_user_id = tbl_high_score.fld_user_id
                                ORDER BY tbl_high_score.fld_score DESC";
                                // This passes the variables $conn and $sql to the the function 'mysqli_query' and assigns the result of the query to the variable '$result'.
                                $result = mysqli_query($conn, $sql);
                                // This 'IF' statement declares that if the value of the variable '$result' and the number of rows is greater than zero execute the code within the statement. 
                                if ($result && mysqli_num_rows($result) > 0) 
                                {
                                    // This 'While' loop fetches the associative array for the value of the variable '$result' and assigns its value to the variable '$rows'.
                                    while ($row = mysqli_fetch_assoc($result)) 
                                    {     
                                        // This echoes the HTML table containing the varaibles '$row["fld_member_id"]', '$row["fld_first_name"]', '$row["fld_last_name"]' and '$row["SUM(fld_image_points)"]'on each row.
                                        echo "<tr>
                                                <td>" . $row["fld_user_name"] . "</td>
                                                <td>" . $row["fld_score"] . "</td>                                                                                                                        
                                            </tr>";
                                    }
                                }
                            ?>
                        </tbody>
        </table>
    </div>        
</body>
</html>