import './App.css';
import { DisplayRound } from "./components/Round"
import GameInfo from "./components/GameInfo"


function App() {
  console.log('app ')

  return (
    <div className="App">
      <h1>Where Is Harry?</h1>
      <GameInfo />
      <DisplayRound />
    </div>
  );
}

export default App;
