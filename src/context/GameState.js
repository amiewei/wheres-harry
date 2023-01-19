import GameContext from "./GameContext";
import { useEffect, useState } from "react";
import CharBank from "../components/CharBank";


const GameState = ({ children }) => {

    const selectRandomGameImage = () => {
      console.log('select random image')
        const selectedImage = CharBank.slice(1).map(function () { 
          return this.splice(Math.floor(Math.random() * this.length), 1)[0];
        }, CharBank.slice());

        console.log(selectedImage[0].imageId)
        return selectedImage[0].imageId
    }




    const [ gameChars, setGameChars ] = useState([]);
    const [ playerScore, setPlayerScore ] = useState(0);
    const [ charsFound, setCharsFound ]= useState([]);
    const [ timeTaken, setTimeTaken ] = useState(null);
    const [ roundNumber, setRoundNumber ] = useState(1)
    const [ totalTimeTakenMsg, setTotalTimeTakenMsg ] = useState("")
    const [ currentImageId, setCurrentImageId ] = useState(() => selectRandomGameImage());
    const [ isGameOver, setIsGameOver ] = useState(false)
    const [ isRoundOver, setIsRoundOver ] = useState(false)
    const [ msg, setMsg ] = useState(null);

    console.log(children)

    //https://blog.logrocket.com/deep-dive-iterating-context-children-react/
    // const increasePlayerScore = () => setPlayerScore(prevScore => prevScore+1)
    const increaseRoundNumber = () => setRoundNumber(prevRound => prevRound+1)
    const selectRandomImageId = () => setCurrentImageId(() => selectRandomGameImage())
    
    let stateValue = { gameChars, setGameChars, playerScore, setPlayerScore,
                     charsFound, setCharsFound, timeTaken, setTimeTaken, roundNumber, 
                     increaseRoundNumber, totalTimeTakenMsg, setTotalTimeTakenMsg,
                     currentImageId, setCurrentImageId, selectRandomImageId, isGameOver, setIsGameOver,
                     isRoundOver, setIsRoundOver, msg, setMsg
                    }
    return (
        //Add the functions that have been defined above into the Context provider, and pass on to the children
        <GameContext.Provider
          value={stateValue}
        >
          {children}
        </GameContext.Provider>
      );
}

export default GameState