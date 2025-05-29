import { useEffect, useState } from 'react';
import useGame from '../stores/useGame';
import useSound from '../stores/useSound';
import '../styles/interface.css';
import SoundOn from '../assets/icons/sound-on.svg';
import SoundOff from '../assets/icons/sound-off.svg';
import Dark from '../assets/icons/dark.svg';

// Sound effects
const uiSound = new Audio('sounds/ui.mp3');
uiSound.volume = 0.75;

export default function Interface() {
  const {
    score,
    bestScore,
    gamesPlayed,
    phase,
    setPhase,
    isMobile,
    dark,
    toggleDark,
  } = useGame((state) => state);
  const { sound, toggleSound } = useSound((state) => state);

  const [isNewBest, setIsNewBest] = useState(false);
  const [animateIntro, setAnimateIntro] = useState(false);
  const [animateGameOver, setAnimateGameOver] = useState(false);

  useEffect(() => {
    if (score > bestScore && bestScore > 0 && !isNewBest) {
      setIsNewBest(true);
    }
  }, [score, bestScore]);

  useEffect(() => {
    if (phase === 'ready') {
      setIsNewBest(false);
      setAnimateIntro(true);
      setAnimateGameOver(false);
    } else if (phase === 'playing') {
      setAnimateIntro(false);
    } else if (phase === 'gameover') {
      setAnimateGameOver(true);
    }
  }, [phase]);

  const playPromptText = isMobile ? 'TAP TO PLAY' : 'CLICK TO PLAY';

  return (
    <div id="interface">
      {/* Intro Screen */}
      {phase === 'ready' && (
        <div id="intro-screen" className={`${animateIntro ? 'animate' : ''}`}>
          <img
            id="settings"
            className={dark ? 'dark-btn' : ''}
            src={sound ? SoundOn : SoundOff}
            alt="Sound icon"
            onClick={() => {
              toggleSound();
              if (!sound) {
                uiSound.currentTime = 0;
                uiSound.play();
              }
            }}
          />
          <img
            id="dark-button"
            className={dark ? 'dark-btn' : ''}
            src={Dark}
            alt="Dark icon"
            onClick={() => {
              toggleDark();
              console.log('Dark mode toggled:', dark);
            }}
          />
          <h1
            id="title"
            className={`slide-item-intro-top${dark ? ' dark' : ''}`}
          >
            ZIGZAG
          </h1>
          <p
            id="play-prompt"
            className={`slide-item-intro-top${dark ? ' dark' : ''}`}
          >
            {playPromptText}
          </p>
          <div id="intro-data-container" className="slide-item-intro-bottom">
            <p className={`intro-data${dark ? ' dark' : ''}`}>
              BEST SCORE: {bestScore}
            </p>
            <p className={`intro-data${dark ? ' dark' : ''}`}>
              GAMES PLAYED: {gamesPlayed}
            </p>
          </div>
          <div id="copyright" className="slide-item-intro-bottom">
            <a
              className={dark ? 'dark' : ''}
              href="https://michaelkolesidis.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              © Michael Kolesidis
            </a>
            <p className={dark ? 'dark' : ''}>
              Licensed under AGPLv3 •{' '}
              <a
                className={dark ? 'dark' : ''}
                href="https://github.com/michaelkolesidis/zigzag"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Score */}
      {phase === 'playing' && <div id="score">{score}</div>}

      {/* Game Over Screen */}
      {(phase === 'ready' || phase === 'gameover') && (
        <div id="gameover-screen">
          <div
            className={`gameover-content ${animateGameOver ? 'animate' : ''}`}
          >
            <h1
              id="gameover-title"
              className={`slide-item-gameover${dark ? ' dark' : ''}`}
            >
              GAME OVER
            </h1>

            {isNewBest && (
              <p
                id="new-high-score"
                className={`slide-item-gameover${dark ? ' dark' : ''}`}
              >
                NEW HIGH SCORE!
              </p>
            )}

            <div
              id="gameover-score-container"
              className={`slide-item-gameover ${dark ? ' dark-container' : ''}`}
              style={
                isNewBest ? { background: dark ? '#c435b6' : '#fd44e9' } : {}
              }
            >
              <p
                className={`gameover-score-title ${dark ? ' dark' : ''}`}
                style={isNewBest ? { color: '#ffffff' } : {}}
              >
                SCORE
              </p>
              <p
                className={`gameover-score ${dark ? ' dark' : ''}`}
                style={isNewBest ? { color: '#ffffff' } : {}}
              >
                {score}
              </p>
              <p
                className={`gameover-score-title ${dark ? ' dark' : ''}`}
                style={isNewBest ? { color: '#ffffff' } : {}}
              >
                BEST SCORE
              </p>
              <p
                className={`gameover-score ${dark ? ' dark' : ''}`}
                style={isNewBest ? { color: '#ffffff' } : {}}
              >
                {bestScore}
              </p>
            </div>

            <div
              className={`slide-item-gameover ${
                dark ? 'dark-gameover-button' : ' '
              } gameover-button`}
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
        </div>
      )}
    </div>
  );
}
