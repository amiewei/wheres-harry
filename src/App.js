import "./App.css";
import { DisplayRound } from "./components/Round";
import GameInfo from "./components/GameInfo";

function App() {
    return (
        <div className="App">
            <h1>Where Is Harry?</h1>
            <GameInfo />
            <DisplayRound />
        </div>
    );
}

export default App;
