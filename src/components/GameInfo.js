import { useContext, useEffect, useRef } from "react";
import GameContext from "../context/GameContext";
import { getTimeTakenMsg } from "./Round";

//Round and overall score info, changes round
const GameInfo = () => {
    const {
        roundNumber,
        increaseRoundNumber,
        selectRandomImageId,
        timeTaken,
        setPlayerScore,
        playerScore,
        totalTimeTakenMsg,
        setTotalTimeTakenMsg,
        isRoundOver,
        setIsRoundOver,
        setMsg,
    } = useContext(GameContext);

    const isGameOverRef = useRef(false);

    useEffect(() => {
        //time taken is cumulative
        setPlayerScore(timeTaken);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRoundOver]);

    useEffect(() => {
        if (isRoundOver) {
            let msg = getTimeTakenMsg(playerScore);
            setTotalTimeTakenMsg(msg);
            if (roundNumber >= 3) {
                isGameOverRef.current = true;
                setMsg(
                    "Game Over - You Found All The Royals In a Proper " +
                        msg +
                        ". Well Done!"
                );
            } else {
                setTimeout(() => initiateNewRound(), 1500);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerScore]);

    const initiateNewRound = () => {
        selectRandomImageId();
        increaseRoundNumber();
        setIsRoundOver(false);
    };

    return (
        <div className="container current-player-scoreboard">
            <div>
                <p>Round: </p>
                <p>{roundNumber} out of 3</p>
            </div>
            <div>
                <p>Total Time Taken: </p>
                <p>{timeTaken > 0 ? totalTimeTakenMsg : "-"}</p>
            </div>
        </div>
    );
};

export default GameInfo;
