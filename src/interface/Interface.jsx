import { useEffect, useState } from 'react';
import useGame from '../stores/useGame';
import useSound from '../stores/useSound';
import '../styles/interface.css';
import SoundOn from '../assets/icons/sound-on.svg';
import SoundOff from '../assets/icons/sound-off.svg';

// Sound effects
const uiSound = new Audio('sounds/ui.mp3');
uiSound.volume = 0.75;

export default function Interface() {
  const score = useGame((state) => state.score);
  const bestScore = useGame((state) => state.bestScore);
  const gamesPlayed = useGame((state) => state.gamesPlayed);
  const phase = useGame((state) => state.phase);
  const setPhase = useGame((state) => state.setPhase);
  const isMobile = useGame((state) => state.isMobile);
  const sound = useSound((state) => state.sound);
  const toggleSound = useSound((state) => state.toggleSound);

  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    if (score > bestScore && bestScore > 0 && !isNewBest) {
      setIsNewBest(true);
    }
  }, [score, bestScore]);

  useEffect(() => {
    if (phase === 'ready') {
      setIsNewBest(false);
    }
  }, [phase]);

  return (
    <div id="interface">
      {phase === 'ready' && (
        <div id="intro-screen">
          <img
            id="settings"
            src={sound ? SoundOn : SoundOff}
            alt="Settings icon"
            onClick={() => {
              toggleSound();
              if (!sound) {
                uiSound.currentTime = 0;
                uiSound.play();
              }
            }}
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
          <div id="copyright">
            <p>© Michael Kolesidis</p>
            <p>Licensed under the AGPL-3.0-or-later</p>
          </div>
        </div>
      )}
      {phase === 'playing' && <div id="score">{score}</div>}
      {phase === 'gameover' && (
        <div id="gameover-screen">
          <h1 id="gameover-title">GAME OVER</h1>
          {isNewBest && <p id="new-high-score">NEW HIGH SCORE!</p>}
          <div
            id="gameover-score-container"
            style={isNewBest ? { background: '#f283c0' } : {}}
          >
            <p
              className="gameover-score-title"
              style={isNewBest ? { color: '#ffffff' } : {}}
            >
              SCORE
            </p>
            <p
              className="gameover-score"
              style={isNewBest ? { color: '#ffffff' } : {}}
            >
              {score}
            </p>
            <p
              className="gameover-score-title"
              style={isNewBest ? { color: '#ffffff' } : {}}
            >
              BEST SCORE
            </p>
            <p
              className="gameover-score"
              style={isNewBest ? { color: '#ffffff' } : {}}
            >
              {bestScore}
            </p>
          </div>
          <div
            className="gameover-button"
            onClick={() => {
              if (sound) {
                uiSound.currentTime = 0;
                uiSound.play();
              }
              setPhase('ready');
            }}
          >
            RETRY
          </div>
        </div>
      )}
    </div>
  );
}
