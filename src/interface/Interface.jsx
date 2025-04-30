import useGame from '../stores/useGame';
import './interface.css';
// import Settings from '../assets/settings.png';

export default function Interface() {
  const score = useGame((state) => state.score);
  const phase = useGame((state) => state.phase);
  const isMobile = useGame((state) => state.isMobile);

  return (
    <div id="interface">
      {phase === 'ready' && (
        <div id="intro-screen">
          {/* <img id="settings" src={Settings} alt="Settings icon" /> */}
          <h1>ZIGZAG</h1>
          {isMobile ? (
            <p id="play-prompt">TAP TO PLAY</p>
          ) : (
            <p id="play-prompt">CLICK TO PLAY</p>
          )}
        </div>
      )}
      {phase === 'playing' && <div id="score">{score}</div>}
      {phase === 'gameover' && (
        <div id="gameover-screen">
          <h1>GAME OVER</h1>
          <div id="score-container">
            <p id="score-title">SCORE</p>
            <p>{score}</p>
          </div>
          <div className="gameover-button">RETRY</div>
        </div>
      )}
    </div>
  );
}
