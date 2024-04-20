import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConnectionExample = () => {
    const [equipos, setEquipos] = useState([]);
    const [modoJuego, setModoJuego] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        axios.get('http://192.168.0.107/API_aso/othersapi/CreateGames.php')
            .then(response => {
                if (response.data && Array.isArray(response.data.equipos)) {
                    const equiposResult = response.data.equipos;
                    setEquipos(equiposResult);
                    determineGameMode(equiposResult.length);
                } else {
                    console.error('Datos recibidos no contienen equipos:', response.data);
                    setEquipos([]);  // Asegura que equipos siempre esté definido
                }
            })
            .catch(error => {
                console.error('Error al obtener datos: ', error);
                setMensaje("Error al obtener datos. Por favor, intenta de nuevo.");
            });
    }, []);

    const determineGameMode = (numEquipos) => {
        let modo;
        if (numEquipos >= 4 && numEquipos <= 7) {
            modo = "Round Robin";
        } else if (numEquipos >= 8 && numEquipos <= 10) {
            modo = "en dos grupos";
        } else if (numEquipos === 11) {
            modo = "en tres grupos";
        } else {
            modo = "No definido";
        }
        setModoJuego(modo);
    };

    const generarCalendario = () => {
        axios.post('http://192.168.0.107/API_aso/othersapi/CreateGames.php', {
            fecha: 'Fecha 1',
            partidos: 'Equipo1 vs Equipo4, Equipo2 vs Equipo3',
            descanso: 'Equipo5'
        })
        .then(response => {
            setMensaje(response.data.success || "Calendario generado correctamente.");
        })
        .catch(error => {
            console.error('Error al insertar datos: ', error);
            setMensaje("Error al insertar datos.");
        });
    };

    return (
        <div>
            <h1>Equipos:</h1>
            {equipos.map(equipo => (
                <div key={equipo}>{equipo}</div>
            ))}
            <h2>Modo de juego: {modoJuego}</h2>
            <button onClick={generarCalendario}>Generar Calendario</button>
            <p>{mensaje}</p>
        </div>
    );
};

export default ConnectionExample;
