import { useContext, useEffect, useRef } from "react";
import uniqid from "uniqid";
import GameContext from "../context/GameContext";
import CharBank from "./CharBank";

let gameImg;
const NUM_GAME_CHAR = 2;

const DisplayRound = () => {
    const firstUpdate = useRef(true);
    // const [msg, setMsg] = useState(null);
    const {
        gameChars,
        setGameChars,
        roundNumber,
        charsFound,
        setCharsFound,
        currentImageId,
        setTimeTaken,
        setIsRoundOver,
        msg,
        setMsg,
    } = useContext(GameContext);
    const startTimeRef = useRef(Date.now());
    const isRoundOverRef = useRef(false);

    useEffect(() => {
        if (firstUpdate.current) {
            const selectedChars = placeChars(currentImageId);

            firstUpdate.current = false;
            isRoundOverRef.current = false;
            setGameChars(selectedChars);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roundNumber, currentImageId, setGameChars]);

    useEffect(() => {
        //how to kick this off the second round (after the 1st use effect?)
        if (isRoundOverRef.current === false) {
            determineCharLocation();
            evaluateisRoundOverRef();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameChars, firstUpdate]);

    function placeChars(currentImageId) {
        // for the selected image
        const selectedImage = CharBank.filter(
            (image) => image.imageId === currentImageId
        )[0];

        const selectedChars = selectedImage.chars
            .slice(0, NUM_GAME_CHAR)
            .map(function () {
                return this.splice(
                    Math.floor(Math.random() * this.length),
                    1
                )[0];
            }, selectedImage.chars.slice());

        selectedChars.unshift(selectedImage.harry);

        selectedChars.map((char) => (char.found = false));

        return selectedChars;
    }

    function FindPosition(oElement) {
        if (typeof oElement.offsetParent != "undefined") {
            for (
                var posX = 0, posY = 0;
                oElement;
                oElement = oElement.offsetParent
            ) {
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            return [posX, posY];
        } else {
            return [oElement.x, oElement.y];
        }
    }

    function GetCoordinates(e) {
        var PosX = 0;
        var PosY = 0;
        var ImgPos;
        ImgPos = FindPosition(gameImg);
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            PosX = e.pageX;
            PosY = e.pageY;
        } else if (e.clientX || e.clientY) {
            PosX =
                e.clientX +
                document.body.scrollLeft +
                document.documentElement.scrollLeft;
            PosY =
                e.clientY +
                document.body.scrollTop +
                document.documentElement.scrollTop;
        }
        PosX = PosX - ImgPos[0];
        PosY = PosY - ImgPos[1];

        evaluateClick(PosX, PosY);
    }

    function determineCharLocation() {
        gameImg = document.querySelector(".img-main-game");
        gameImg.onmousedown = GetCoordinates;
    }

    function evaluateClick(PosX, PosY) {
        const selectedImage = CharBank.filter(
            (image) => image.imageId === currentImageId
        )[0];

        //check if the click is within 10-15 pixels of any images
        let match = gameChars.filter(
            (char) =>
                Math.abs(Number(char.locationX) - Number(PosX)) <=
                    selectedImage.spacingX &&
                Math.abs(Number(char.locationY) - Number(PosY)) <=
                    selectedImage.spacingY
        );

        setGameMsg(match);
    }

    function setGameMsg(match) {
        if (match.length > 0 && !charsFound.includes(match[0].name)) {
            setMsg(`You Found ${match[0].name}!`);

            const newGameChars = [...gameChars];

            newGameChars
                .filter((char) => char.name === match[0].name)
                .map((char) => (char.found = true));

            setGameChars([...newGameChars]);
            setCharsFound((prevList) => [...prevList, match[0].name]);
        } else if (match.length > 0 && charsFound.includes(match[0].name)) {
            setMsg(`You Already Found ${match[0].name}! Try Again`);
        } else {
            setMsg("Not Quite");
        }
    }

    //when game over stop timer
    function disableClickOnGameImg() {
        gameImg = document.querySelector(".img-main-game");
        gameImg.onmousedown = null;
        console.dir(gameImg);
    }

    function evaluateisRoundOverRef() {
        if (charsFound.length === NUM_GAME_CHAR + 1) {
            isRoundOverRef.current = true;
            stopTimer();

            // TODO: find time taken per round
            // TODO: delay transition to next round. setting time out for setMsg doesn't work

            setMsg(`Nice Job - On To Round #${roundNumber + 1}!`);
            disableClickOnGameImg();

            setIsRoundOver(true);
            firstUpdate.current = true;
            setCharsFound([]);
        }
    }

    function stopTimer() {
        const endTime = Date.now();

        const calcTimeTaken = endTime - startTimeRef.current;

        const timeTakenMsg = getTimeTakenMsg(calcTimeTaken);
        setTimeTaken(calcTimeTaken);
        return timeTakenMsg;
    }

    return (
        <>
            <div className="container">
                <div className="img-container">
                    {/* <img className='img-main-game' src={`./assets/${currentImageId}.png`} alt={currentImageId} /> */}
                    <img
                        className="img-main-game"
                        src={`${process.env.PUBLIC_URL}/assets/${currentImageId}.png`}
                        alt={currentImageId}
                    />
                    <div className="game-msg">{msg}</div>
                </div>
                <div className="game-chars">
                    <h3>Find Harry and These Royal Faces</h3>
                    <ul>
                        {gameChars.map((char) => {
                            return (
                                <li
                                    className={
                                        char.found ? "game-char-found" : ""
                                    }
                                    found={char.found.toString()}
                                    key={uniqid()}
                                >
                                    {char.name}{" "}
                                    {char.found ? <span>✅</span> : ""}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </>
    );
};

const getTimeTakenMsg = (timeTaken) => {
    const minutes = Math.floor(timeTaken / 60000);
    const seconds = ((timeTaken % 60000) / 1000).toFixed(1);
    const timeTakenMsg =
        minutes > 0
            ? `${minutes} Minutes, ${seconds} Seconds`
            : `${seconds} Seconds`;
    return timeTakenMsg;
};
export { DisplayRound, getTimeTakenMsg };
