// PublicTimer.js
import React, { useState, useEffect } from 'react';

const PublicTimer = () => {
    const [time, setTime] = useState("00:00:00");

    useEffect(() => {
        const interval = setInterval(() => {
            fetchTime();
        }, 1000); // Actualiza cada segundo

        return () => clearInterval(interval);
    }, []);

    const fetchTime = async () => {
        try {
            const response = await fetch('http://192.168.0.107/API_aso/othersapi/publictime.php');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();
            setTime(new Date(data * 1000).toISOString().substr(11, 8));
        } catch (error) {
            console.error('Error fetching time:', error);
        }
    };

    return (
        <div>
            <h1>Time: {time}</h1>
        </div>
    );
};

export default PublicTimer;
