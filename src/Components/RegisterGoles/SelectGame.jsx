import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/SelectGames.css'; // Asegúrate de tener el archivo CSS importado

function SelectGames() {
    const [games, setGames] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [minutes, setMinutes] = useState('');
    const [seconds, setSeconds] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formType, setFormType] = useState('');
    const [selectedTeamName, setSelectedTeamName] = useState('');
    const [showGoalForm, setShowGoalForm] = useState(false);
    const [showFoulForm, setShowFoulForm] = useState(false);
    const [actionSelected, setActionSelected] = useState('');

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios.get('http://192.168.0.107/API_aso/othersapi/SelectGames.php');
                setGames(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setError('Failed to load games. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchGames();
    }, []);

    useEffect(() => {
        if (!selectedTeam) return;
        async function fetchPlayers() {
            try {
                const response = await axios.get(`http://192.168.0.107/API_aso/othersapi/gameDetails.php?teamName=${encodeURIComponent(selectedTeam)}`);
                setTeamPlayers(response.data);
            } catch (error) {
                console.error('Error fetching players: ', error);
                setError('Failed to load players. Please try again later.');
            }
        }
        fetchPlayers();
    }, [selectedTeam]);

    const handleGameSelection = (event) => {
        setSelectedGameId(event.target.value);
        setSelectedTeam(null);
        setTeamPlayers([]);
        setFormType('');
    };

    const handleTeamSelection = (teamName) => {
        setSelectedTeam(teamName);
        setSelectedTeamName(teamName); // Set the selected team name
        setShowGoalForm(false);
        setShowFoulForm(false);
    };

    const handlePlayerSelection = (event) => {
        setSelectedPlayer(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedGameId || !selectedTeam || !selectedPlayer || !minutes || !seconds) {
            alert("Please complete all fields before submitting.");
            return;
        }
        const postData = {
            gameId: selectedGameId,
            team: selectedTeam,
            player: selectedPlayer,
            time: `${minutes}:${seconds}`,
            type: formType
        };
        try {
            await axios.post('http://192.168.0.107/API_aso/othersapi/registerGameDetails.php', postData);
            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Submission error: ', error);
            alert('Failed to submit data.');
        }
    };

    const findGameById = id => games.find(game => game.idgame === id);

    const handleGoalRegistration = () => {
        setShowGoalForm(true);
        setShowFoulForm(false);
        setActionSelected('Goal');
    };

    const handleFoulRegistration = () => {
        setShowGoalForm(false);
        setShowFoulForm(true);
        setActionSelected('Foul');
    };

    const renderActionButtons = () => {
        if (!selectedGameId) return null;
        const localTeam = findGameById(selectedGameId).local;
        const visitorTeam = findGameById(selectedGameId).visitante;
        return (
            <div>
                <button onClick={() => handleTeamSelection(localTeam)} className="button">Select {localTeam}</button>
                <button onClick={() => handleTeamSelection(visitorTeam)} className="button">Select {visitorTeam}</button>
            </div>
        );
    };

    const renderGoalOrFoulButtons = () => {
        if (!selectedTeam) return null;
        return (
            <div>
                <button onClick={handleGoalRegistration} className="button">Register Goal</button>
                <button onClick={handleFoulRegistration} className="button">Register Foul</button>
            </div>
        );
    };

    const renderActionLabel = () => {
        if (!formType) return null;
        const label = formType === 'goal' ? 'Registro de gol' : 'Registro de falta';
        return <h2>Acción actual: {label}</h2>;
    };

    const renderGoalForm = () => {
        if (!showGoalForm) return null;
        return (
            <div>
                <label htmlFor="player-select">Select a Player:</label>
                <select id="player-select" onChange={handlePlayerSelection} className="select-input">
                    <option value="">Select a player</option>
                    {teamPlayers.map((player, index) => (
                        <option key={index} value={player.name}>
                            {player.name} {player.lastname}
                        </option>
                    ))}
                </select>
                <div className="time-inputs">
                    <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="Minutes" min="0" max="90" className="number-input"/>
                    <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} placeholder="Seconds" min="0" max="59" className="number-input"/>
                </div>
                <button onClick={handleSubmit} className="button">Submit</button>
            </div>
        );
    };

    const renderFoulForm = () => {
        if (!showFoulForm) return null;
        return (
            <div>
                <label htmlFor="foul-player-select">Select a Player:</label>
                <select id="foul-player-select" onChange={handlePlayerSelection} className="select-input">
                    <option value="">Select a player</option>
                    {teamPlayers.map((player, index) => (
                        <option key={index} value={player.name}>
                            {player.name} {player.lastname}
                        </option>
                    ))}
                </select>
                <div className="time-inputs">
                    <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="Minute of Foul" min="0" max="90" className="number-input"/>
                </div>
                <button onClick={handleSubmit} className="button">Submit</button>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Seleccionar Juegos</h1>
                <label htmlFor="game-select">Choose a game:</label>
                <select id="game-select" onChange={handleGameSelection} value={selectedGameId} className="select-input">
                    <option value="">Select a game</option>
                    {games.map(game => (
                        <option key={game.idgame} value={game.idgame}>
                            {game.local} vs {game.visitante}
                        </option>
                    ))}
                </select>
                {renderActionButtons()}
                {renderActionLabel()}
                {selectedTeam && teamPlayers.length > 0 && (
                    <div>
                        <p>Selected Team: {selectedTeamName}</p>
                        {renderGoalOrFoulButtons()}
                        {actionSelected && <p>Action Selected: {actionSelected}</p>}
                        {renderGoalForm()}
                        {renderFoulForm()}
                       
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelectGames;
