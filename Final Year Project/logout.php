<?php
    // Command to start the session containing 'super gloabal' variables.
    session_start();

    // Command to destroy the session containing 'super gloabal' variables effectiveley removing all the values.
    session_destroy();

    // This redirects the user to the login page.
    header("location: login.php?error=sessionunset");
    // This ends the process stopping the script from running.
    exit;