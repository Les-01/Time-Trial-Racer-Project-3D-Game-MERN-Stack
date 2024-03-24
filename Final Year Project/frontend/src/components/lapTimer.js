// This imports React useState and useEffect from react.
import React, { useState, useEffect } from 'react';
// This imports 'HighScoreEntryForm' from the file 'highScoreInfo' within the 'components' folder.
import HighScoreEntryForm from '../components/highScoreEntryForm'

const Timer = () => {
    // This initializes the variable 'minutes' and the function 'setMinutes' which are set to equal the React hook 'useState' which has an initial value of '0'.
    const [minutes, setMinutes] = useState(0);
    // This initializes the variable 'seconds' and the function 'setSeconds' which are set to equal the React hook 'useState' which has an initial value of '0'.
    const [seconds, setSeconds] = useState(0);
    // This initializes the variable 'lapTimeFormat' and the function 'setLapTimeFormat' which are set to equal the React hook 'useState' which has an initial value of 'false'.
    const [lapTimeFormat, setLapTimeFormat] = useState(false);
    // This initializes the variable 'lapCount' and the function 'setLapCount' which are set to equal the React hook 'useState' which has an initial value of '0'.
    const [lapCount, setLapCount] = useState(0);
    // This initializes the variable 'lapTime1' and the function 'setLapTime1' which are set to equal the React hook 'useState' which has an initial value of 'null'.
    const [lapTime1, setLapTime1] = useState(null);
    // This initializes the variable 'lapTime2' and the function 'setLapTime2' which are set to equal the React hook 'useState' which has an initial value of 'null'.
    const [lapTime2, setLapTime2] = useState(null);
    // This initializes the variable 'lapTime3' and the function 'setLapTime3' which are set to equal the React hook 'useState' which has an initial value of 'null'.
    const [lapTime3, setLapTime3] = useState(null);
    // This initializes the variable 'isRaceFinished' and the function 'setIsRaceFinished' which are set to equal the React hook 'useState' which has an initial value of 'false'.
    const [isRaceFinished, setIsRaceFinished] = useState(false);
    // This initializes the variable 'timerInterval' and the function 'setTimerInterval' which are set to equal the React hook 'useState' which has an initial value of 'null'.
    const [timerInterval, setTimerInterval] = useState(null);
    // This initializes the variable 'showHighScoreEntryForm' and the function 'setShowHighScoreEntryForm' which are set to equal the React hook 'useState' which has an initial value of 'false'.
    const [showHighScoreEntryForm, setShowHighScoreEntryForm] = useState(false);

    // Function to get cookie value by name.
    const getCookie = (name) => {
        // Splitting and trimming cookie string to get individual cookies.
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        // Finding the cookie with the specified name.
        const cookie = cookies.find(cookie => cookie.startsWith(name + '='));
        // Returning the value of the cookie if found, otherwise returning null.
        return cookie ? parseInt(cookie.split('=')[1]) : null;
    };

    // Function to convert total seconds to lap time format (mm:ss).
    const formatLapTime = (totalSeconds) => {
        // Calculate minutes.
        const mins = Math.floor(totalSeconds / 60);
        // Calculate seconds.
        const secs = totalSeconds % 60;
        // Format minutes and seconds to ensure they are two digits.
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // useEffect hook to periodically check for changes in lapCount cookie value.
    useEffect(() => {
        // Set up an interval to check for changes in lapCount.
        const interval = setInterval(() => {
            // Retrieve updated lapCount from the cookie.
            const updatedLapCountCookie = parseInt(getCookie('lapCount'));
            // Check if the retrieved lapCount is a valid number and different from the current lapCount state.
            if (!isNaN(updatedLapCountCookie) && updatedLapCountCookie !== lapCount) {
                // Calculate the current lap time based on the timer values.
                const lapTime = minutes * 60 + seconds;
                // Switch statement to update lap times based on the updated lapCount.
                switch (updatedLapCountCookie) {
                    // Switch case 1
                    case 1:
                        // Calls 'setLapTime1' method and passes it the variable 'lapTime'.
                        setLapTime1(formatLapTime(lapTime));
                        break;
                    // Switch case 2
                    case 2:
                        // Calls 'setLapTime2' method and passes it the variable 'lapTime'.
                        setLapTime2(formatLapTime(lapTime));
                        break;
                    // Switch case 3
                    case 3:
                        // Calls 'setLapTime3' method and passes it the variable 'lapTime'.
                        setLapTime3(formatLapTime(lapTime));
                        break;
                    default:
                        break;
                }
                // Reset main timer (minutes and seconds) if the lap count value has increased.
                if (updatedLapCountCookie > lapCount) {
                    // Calls 'setMinutes' method and passes it the value '0'.
                    setMinutes(0);
                    // Calls 'setSeconds' method and passes it the value '0'.
                    setSeconds(0);
                    // Calls 'setLapTimeFormat' method and passes it the value 'false'.
                    setLapTimeFormat(false);
                    // Calls 'setLapCount' method and passes it the variable 'updatedLapCountCookie'.
                    setLapCount(updatedLapCountCookie);
                }
            }
            // Checks for changes in lapCount cookie value every second.
        }, 1000);     
        // Clean up interval on component unmount.
        return () => clearInterval(interval);
    }, [lapCount, minutes, seconds]);
    
    // useEffect hook to set up the timer interval.
    useEffect(() => {
        // Set up the timer interval.
        const intervalId = setInterval(() => {
            // IF seconds reach 59 execute the code within the statement.
            if (seconds >= 59) {
                // Calls 'setSeconds' method and passes it the value '0'.           
                setSeconds(0);
                // Calls 'setMinutes' method and passes it the variable 'prevMinutes' + '1'. Incrementing the minutes by 1.       
                setMinutes(prevMinutes => prevMinutes + 1);
            } 
            // IF seconds havne not reaced 59 execute the code within the statement.
            else {
                // Calls 'setSeconds' method and passes it the variable 'prevSeconds' + '1'. Incrementing the seconds by 1.       
                setSeconds(prevSeconds => prevSeconds + 1);
            }
            // Run every second.
        }, 1000);
        // Store the interval ID
        setTimerInterval(intervalId);
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
        // Empty dependency array means effect only runs once on component mount.
    }, []);

    // useEffect hook to set lap time format and trigger race finish.
    useEffect(() => {
        // Set lap time format if seconds reach 1 and lap time format is not already set.
        if (seconds >= 1 && !lapTimeFormat) {
            // Calls 'setLapTimeFormat' method and passes it the value 'true'.   
            setLapTimeFormat(true);
        }

        // Check if lapTime3 has a value to trigger race finish.
        if (lapTime3 !== null) {
            // Calls 'setIsRaceFinished' method and passes it the value 'true'. 
            setIsRaceFinished(true);
            // Call handleRaceFinish function.
            handleRaceFinish(); 
        }
        // Dependencies include seconds, lapTimeFormat, and lapTime3.
    }, [seconds, lapTimeFormat, lapTime3]);

    // Function to convert lap time format (mm:ss) to seconds.
    const lapTimeToSeconds = (lapTime) => {
        // Split lap time string into minutes and seconds, then convert to number.
        const [minutes, seconds] = lapTime.split(':').map(Number);
        // Return total seconds.
        return minutes * 60 + seconds;
    };

    // Function to determine the fastest lap.
    const determineFastestLap = () => {
        // Convert lap times to seconds for comparison.
        const lapTime1Seconds = lapTime1 ? lapTimeToSeconds(lapTime1) : Infinity;
        const lapTime2Seconds = lapTime2 ? lapTimeToSeconds(lapTime2) : Infinity;
        const lapTime3Seconds = lapTime3 ? lapTimeToSeconds(lapTime3) : Infinity;
        // Find the minimum lap time among lap times.
        const fastestLapTimeSeconds = Math.min(lapTime1Seconds, lapTime2Seconds, lapTime3Seconds);
        
        // Determine which lap was the fastest based on the minimum lap time.
        if (fastestLapTimeSeconds === lapTime1Seconds) {
            // Return lapTime1 formatted as mm:ss.
            return lapTime1; 
        } else if (fastestLapTimeSeconds === lapTime2Seconds) {
            // Return lapTime2 formatted as mm:ss.
            return lapTime2; 
        } else if (fastestLapTimeSeconds === lapTime3Seconds) {
            // Return lapTime3 formatted as mm:ss.
            return lapTime3; 
        } else {
            // No lap completed.
            return null; 
        }
    };  
    // Assign the result from the 'determineFastestLap' method as the value variable 'fastestRaceLap'.
    const fastestRaceLap = determineFastestLap();

    // Function to calculate the total time taken for all three laps combined.
    const calculateTotalTime = () => {
        // Convert lap times to seconds for calculation.
        const lapTime1Seconds = lapTime1 ? lapTimeToSeconds(lapTime1) : 0;
        const lapTime2Seconds = lapTime2 ? lapTimeToSeconds(lapTime2) : 0;
        const lapTime3Seconds = lapTime3 ? lapTimeToSeconds(lapTime3) : 0;
        // Calculate total time in seconds.
        const totalTimeSeconds = lapTime1Seconds + lapTime2Seconds + lapTime3Seconds;
        // Convert total time to lap time format (mm:ss).
        return formatLapTime(totalTimeSeconds);
    };
    // Assign the result from the 'calculateTotalTime' method as the value variable 'totalRaceTime'.
    const totalRaceTime = calculateTotalTime();
    
    // Function to handle race finish event.
    const handleRaceFinish = () => {
        // Create a new Date object and assign it to the variable 'expireTime', representing the current date and time.
        const expireTime = new Date();
        // Set the expiry time for the cookies by adding 1 hour (in milliseconds) to the current time.
        expireTime.setTime(expireTime.getTime() + (1 * 60 * 60 * 1000));
        // Save lap times as cookies before resetting them.
        document.cookie = `lapTime1=${lapTime1}; expires=${expireTime.toUTCString()}; path=/`;
        document.cookie = `lapTime2=${lapTime2}; expires=${expireTime.toUTCString()}; path=/`;
        document.cookie = `lapTime3=${lapTime3}; expires=${expireTime.toUTCString()}; path=/`;   
        document.cookie = `fastestLap=${fastestRaceLap}; expires=${expireTime.toUTCString()}; path=/`;
        document.cookie = `totalRaceTime=${totalRaceTime}; expires=${expireTime.toUTCString()}; path=/`;       
        // Stop the timer
        clearInterval(timerInterval);
        // Simulate click on the close game button
        const closeGameButton = document.getElementById('closeGameButton');
        if (closeGameButton) {
            closeGameButton.click();
        } else {
            console.error('Close game button not found');
        }
        // Calls 'setShowHighScoreEntryForm' method and passes it the value 'true'. 
        setShowHighScoreEntryForm(true);
    };

    return (
        <>
            <div id="timer" style={{ fontSize: '24px', color: 'white', position: 'fixed', top: '10px', left: '10px' }}>
                {/* Conditionally render the timer display if the race is not finished */}
                {!isRaceFinished && (
                    <>
                        <p style={{ display: 'inline-block' }}>Lap Time {lapTimeFormat ? `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : '- - : - -'}</p>
                        <p style={{ display: 'inline-block', marginLeft: '20px' }}>Lap Count: {lapCount}</p>
                        <div style={{ marginTop: '10px' }}>
                            {/* Display lap times if they are not null */}
                            <p>Lap 1: {lapTime1 !== null ? lapTime1 : '- - : - -'}</p>
                            <p>Lap 2: {lapTime2 !== null ? lapTime2 : '- - : - -'}</p>
                            <p>Lap 3: {lapTime3 !== null ? lapTime3 : '- - : - -'}</p>
                        </div>
                    </>
                )}
            </div>
            {/* Conditionally render the high score entry form */}
            {showHighScoreEntryForm && (
                <div className="high-score-entry-form" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 101 }}>
                    <HighScoreEntryForm />
                </div>
            )}
        </>
    );
}
// Export the Timer component as the default export.
export default Timer;