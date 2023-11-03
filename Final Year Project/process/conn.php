<?php
//This declares the variable '$serverName' and asigns the value 'localhost' to it.
$serverName = "localhost";
//This declares the variable '$dbUserName' and asigns the value 'Les' to it.
$dbUserName = "Les";
//This declares the variable '$dbPassword' and asigns the value 'Database01' to it.
$dbPassword = "Database01";
//This declares the variable '$dbName' and asigns the value 'final_year_project' to it.
$dbName = "final_year_project";

// This passes the variables '$serverName', '$dbUserName', '$dbPassword' and '$dbName' to the function 'mysqli_connect' and assigns 
// this to the value of the variable '$conn'.
$conn = mysqli_connect($serverName, $dbUserName, $dbPassword, $dbName);

// This 'IF' statements declares that if the variable '$conn' is false meaning meaning the function 'mysqli_connect' was unable to 
// connect execute the code within the 'IF' statement.
if (!$conn) {
    // Here the 'die' statement ends any running processes, then outputs the text 'Connection to Database Failed' concatenated with 
    // the function 'mysqli_connect_error' which will produce specifics of the encountered error.
    die("Connection to Database Failed: " . mysqli_connect_error());
}