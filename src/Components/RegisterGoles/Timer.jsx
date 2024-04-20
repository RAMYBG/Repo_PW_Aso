import React, { useState, useEffect } from 'react';
import PublicTimer from './TimerPublic';
import './styles/Timer.css';  // Make sure the path is correct based on your project structure
import SelectGames from './SelectGame';

const Timer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
                updateServerTime(seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const toggle = () => {
        setIsActive(!isActive);
    };

    const reset = () => {
        setSeconds(0);
        setIsActive(false);
        updateServerTime(0);
    };

    const updateServerTime = async (time) => {
        await fetch('http://192.168.0.107/API_aso/othersapi/timerupdate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `time=${time}`
        });
    };

    return (
        <div>
        <div className="timer-container">
            <h1 className="timer-header">{new Date(seconds * 1000).toISOString().substr(11, 8)}</h1>
            <button className="timer-button timer-button-start" onClick={toggle}>{isActive ? 'Pause' : 'Start'}</button>
            <button className="timer-button timer-button-reset" onClick={reset}>Reset</button>
        </div>
         <SelectGames/>
         </div>
    );
};

export default Timer;
