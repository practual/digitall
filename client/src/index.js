import React, {createContext, useContext, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route, useParams, useNavigate} from 'react-router-dom';

import socket from './socket';

const GameContext = createContext({});

function Lobby () {
    const game = useContext(GameContext);
    const {activePlayerId, gameId} = useParams();
    const navigate = useNavigate();
    const joinGame = () => {
        socket.emit("add_player", gameId, playerId => {
            navigate(`/${gameId}/${playerId}`);
        })
    };
    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/${gameId}`);
    };
    if (!activePlayerId) {
        return (
            <button onClick={joinGame}>Join</button>
        );
    }
    return (
        <div>
            <div>Waiting for other players...</div>
            <button onClick={copyLink}>Copy game link</button>
        </div>
    );
}

function Number ({number, isUsed, addToExpression}) {
    if (isUsed) {
        return <span>{number}</span>;
    }
    return <button onClick={() => addToExpression(number)}>{number}</button>;
}

function Game () {
    const {gameId} = useParams();
    const [game, setGameState] = useState({});
    const [usedNumbers, setUsedNumbers] = useState({});
    const [expression, setExpression] = useState("");
    const [evaluatedExpression, setEvaluatedExpression] = useState("");
    const addToExpression = (val) => {
        setExpression(expression + val + " ");
    };
    const useNumber = (number) => {
        addToExpression(number);
        setUsedNumbers({
            ...usedNumbers,
            [number]: true,
        });
    };
    const evaluate = () => {
        setEvaluatedExpression(eval(expression));
    }
    const clear = () => {
        setEvaluatedExpression("");
        setExpression("");
        setUsedNumbers(Object.keys(usedNumbers).reduce((acc, el) => ({...acc, [el]: false}), {}));
    };
    useEffect(() => {
        socket.on('game_state', setGameState);
        socket.emit('get_game', gameId);
        return () => {
            socket.off('game_state', setGameState);
        };
    }, []);
    useEffect(() => {
        setEvaluatedExpression("");
        setExpression("");
        game.options && setUsedNumbers(game.options.reduce((acc, el) => (
            {...acc, [el]: false}
        ), {}));
    }, [game]);
    if (!Object.keys(game).length) {
        return <></>;
    }
    if (game.players.length < 2) {
        return (
            <GameContext.Provider value={game}>
                <Lobby />
            </GameContext.Provider>
        );
    }
    return (
        <div>
            <h2>{game.target}</h2>
            {Object.entries(usedNumbers).map(([option, isUsed]) => <Number key={option} number={option} isUsed={isUsed} addToExpression={useNumber} />)}
            {["+", "-", "*", "/", "(", ")"].map(operation => (
                <button onClick={() => addToExpression(operation)}>
                    {operation}
                </button> 
            ))}
            <div>
                {expression}
            </div>
            <div>
                <button onClick={evaluate}>Evaluate</button>
                <button onClick={clear}>Clear</button>
            </div>
            <div>{evaluatedExpression}</div>
        </div>
    );
}

function Home () {
    const navigate = useNavigate();
    const createGame = async () => {
        const response = await fetch('/api/game', {
            method: "POST",
        });
        const gameData = await response.json();
        navigate(gameData.game_id);
    };
    return (
        <button onClick={createGame}>New game</button>
    );
}

function App () {
    return (
        <BrowserRouter>
            <Routes>
                <Route path=":gameId" element={<Game />} />
                <Route path=":gameId/:activePlayerId" element={<Game />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);