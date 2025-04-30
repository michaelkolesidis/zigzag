import useGame from '../stores/useGame';
import './interface.css';
// import Settings from '../assets/settings.png';
import SoundOn from '../assets/sound-on.svg';
import SoundOff from '../assets/sound-off.svg';
import useSound from '../stores/useSound';

export default function Interface() {
  const score = useGame((state) => state.score);
  const bestScore = useGame((state) => state.bestScore);
  const gamesPlayed = useGame((state) => state.gamesPlayed);
  const phase = useGame((state) => state.phase);
  const isMobile = useGame((state) => state.isMobile);
  const sound = useSound((state) => state.sound);
  const toggleSound = useSound((state) => state.toggleSound);

  return (
    <div id="interface">
      {phase === 'ready' && (
        <div id="intro-screen">
          <img
            id="settings"
            src={sound ? SoundOn : SoundOff}
            alt="Settings icon"
            onClick={toggleSound}
          />
          <h1 id="title">ZIGZAG</h1>
          {isMobile ? (
            <p id="play-prompt">TAP TO PLAY</p>
          ) : (
            <p id="play-prompt">CLICK TO PLAY</p>
          )}
          <div id="intro-data-container">
            <p className="intro-data">BEST SCORE: {bestScore}</p>
            <p className="intro-data">GAMES PLAYED: {gamesPlayed}</p>
          </div>
        </div>
      )}
      {phase === 'playing' && <div id="score">{score}</div>}
      {phase === 'gameover' && (
        <div id="gameover-screen">
          <h1 id="gameover-title">GAME OVER</h1>
          <div id="gameover-score-container">
            <p className="gameover-score-title">SCORE</p>
            <p className="gameover-score">{score}</p>
            <p className="gameover-score-title">BEST SCORE</p>
            <p className="gameover-score">{bestScore}</p>
          </div>
          <div className="gameover-button">RETRY</div>
        </div>
      )}
    </div>
  );
}
