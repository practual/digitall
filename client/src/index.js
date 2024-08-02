import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

function Number ({number, isUsed, addToExpression}) {
    if (isUsed) {
        return <span>{number}</span>;
    }
    return <button onClick={() => addToExpression(number)}>{number}</button>;
}

function Game ({game}) {
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
        setEvaluatedExpression("");
        setExpression("");
        setUsedNumbers(game.options.reduce((acc, el) => (
            {...acc, [el]: false}
        ), {}));
    }, [game]);
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

function App () {
    const [game, setGame] = useState({});
    const createGame = async () => {
        const response = await fetch('http://localhost:5000/api/game', {
            method: "POST",
        });
        const gameData = await response.json();
        setGame(gameData);
    };
    return (
        <>
            <button onClick={createGame}>New game</button>
            {!!game.game_id && <Game game={game} />}
        </>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);