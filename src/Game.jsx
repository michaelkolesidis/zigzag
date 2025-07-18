import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';

// Stores
import useGame from './stores/useGame';
import useSound from './stores/useSound.js';

// Constants and Utilities
import {
  OBJECT_REMOVAL_POSITION_Y,
  SPHERE_RADIUS,
  INITIAL_SPEED,
  SPEED_INCREMENT,
  SPEED_LIMIT,
  GRAVITY,
  CAMERA_OFFSET_X,
  CAMERA_OFFSET_Y,
  CAMERA_OFFSET_Z,
  UI_SOUND_VOLUME,
} from './constants/constants.js';

// Components
import Level from './level/Level.jsx';
import Lights from './Lights.jsx';
import Sphere from './Sphere.jsx';

// Sound Effects
const tapSound = new Audio('sounds/tap.mp3');
const fallSound = new Audio('sounds/fall.mp3');
const uiSound = new Audio('sounds/ui.mp3');
uiSound.volume = UI_SOUND_VOLUME;

export default function Game() {
  // Store
  const {
    score,
    bestScore,
    gamesPlayed,
    setGamesPlayed,
    phase,
    debug,
    setPhase,
    addPoints,
    resetScore,
    directions,
    performance,
    togglePerformance,
    isMobile,
    setSpherePos,
    isOnPlatform,
    setIsOnPlatform,
    setBestScore,
  } = useGame((state) => state);
  const { sound, toggleSound } = useSound((state) => state);

  // Camera
  const { camera } = useThree();

  // Sphere Movement
  const sphere = useRef();
  const speed = useRef(INITIAL_SPEED);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const directionIndex = useRef(0);
  const currentDirection = useRef(new THREE.Vector3(0, 0, -1));
  const targetDirection = useRef(new THREE.Vector3(0, 0, -1));

  // Auto Clicker Cheating Prevention
  // const lastActionTime = useRef(0);
  // const MIN_INTERVAL = 100; // minimum interval between actions in milliseconds

  // Camera Setup
  const setupCamera = useCallback(() => {
    if (!sphere.current) return;
    const spherePos = sphere.current.position;

    // Initial Camera Position
    camera.position.set(
      spherePos.x - CAMERA_OFFSET_X,
      spherePos.y + CAMERA_OFFSET_Y,
      spherePos.z + CAMERA_OFFSET_Z
    );
    camera.lookAt(
      new THREE.Vector3(-(CAMERA_OFFSET_X - CAMERA_OFFSET_Z), 0, 0)
    );
  }, [camera]);

  // Game Reset Logic
  const resetGame = useCallback(() => {
    setIsOnPlatform(true);
    resetScore(0);
    if (sphere.current) {
      sphere.current.position.set(0, SPHERE_RADIUS, 0);
      sphere.current.velocity = new THREE.Vector3(0, 0, 0);
    }

    setSpherePos(new THREE.Vector3(0, 0, 0)); // start sphere at origin
    speed.current = INITIAL_SPEED;
    velocity.current = new THREE.Vector3(0, 0, 0);
    directionIndex.current = 0;
    currentDirection.current = new THREE.Vector3(0, 0, -1);
    targetDirection.current = new THREE.Vector3(0, 0, -1);

    setupCamera();
  }, [setupCamera, resetScore, setIsOnPlatform, setSpherePos]);

  // Initial Setup
  useEffect(() => {
    if (phase === 'gameover' || phase === 'playing') return;
    resetGame();
  }, [resetGame, phase]);

  // Input Handling
  useEffect(() => {
    const handleInput = (e) => {
      // const now = Date.now();

      // Gameplay
      if (
        e.type === 'pointerdown' ||
        (e.type === 'keydown' &&
          (e.code === 'Enter' ||
            e.code === 'ArrowUp' ||
            e.code === 'ArrowDown'))
      ) {
        // Prevent rapid repeated inputs to avoid auto clicker cheating
        // if (now - lastActionTime.current < MIN_INTERVAL) {
          // return; // Skip input if too fast
        // }
        // lastActionTime.current = now;

        // Playing Phase
        if (phase === 'playing' && isOnPlatform) {
          if (sound) {
            tapSound.currentTime = 0;
            tapSound.play();
          }
          directionIndex.current =
            (directionIndex.current + 1) % directions.length;
          targetDirection.current.copy(directions[directionIndex.current]);
          addPoints(1);
        } else {
          // Ready Phase
          if (phase === 'ready') {
            if (
              e.target.alt === 'Sound toggle' ||
              e.target.alt === 'Dark toggle' ||
              e.target.closest('#copyright')
            ) {
              return;
            }
            if (sound) {
              uiSound.currentTime = 0;
              uiSound.play();
            }
            setPhase('playing');
            setGamesPlayed(gamesPlayed + 1);
            return;
          }
          // Game Over Phase
          if (phase === 'gameover') {
            return;
          }
        }
      }

      if (!isMobile) {
        // Toggle Sound
        if (e.type === 'keydown' && e.code === 'KeyM') {
          toggleSound();
        }

        if (
          e.type === 'keydown' &&
          e.code === 'Space' &&
          phase === 'gameover'
        ) {
          setPhase('ready');
        }
      }
    };

    window.addEventListener('pointerdown', handleInput);
    window.addEventListener('keydown', handleInput);
    return () => {
      window.removeEventListener('pointerdown', handleInput);
      window.removeEventListener('keydown', handleInput);
    };
  }, [
    phase,
    directions,
    resetGame,
    addPoints,
    setPhase,
    toggleSound,
    togglePerformance,
    isMobile,
    sound,
    gamesPlayed,
    isOnPlatform,
    setGamesPlayed,
  ]);

  // Game Loop
  useFrame((_, delta) => {
    if (phase === 'ready') return;

    const spherePos = sphere.current?.position;
    setSpherePos(spherePos);

    // Gameplay Logic (Playing State)
    if (phase === 'playing') {
      // Sphere Movement
      currentDirection.current.copy(targetDirection.current);
      const moveDelta = currentDirection.current
        .clone()
        .multiplyScalar(speed.current * delta);
      spherePos.add(moveDelta);
      velocity.current.copy(moveDelta.clone().divideScalar(delta));
      speed.current = Math.min(
        speed.current + SPEED_INCREMENT * delta,
        SPEED_LIMIT
      );

      // Camera Movement (only if sphere not falling)
      if (spherePos.y > OBJECT_REMOVAL_POSITION_Y) {
        const movementAverage = (spherePos.x - spherePos.z) / 2;
        camera.position.x = -CAMERA_OFFSET_X + movementAverage;
        camera.position.z = CAMERA_OFFSET_Z - movementAverage;
      }

      // Sphere Fall Detection
      if (!isOnPlatform) {
        if (!debug) {
          if (score > bestScore) {
            setBestScore(score);
          }
        }

        if (sound) {
          fallSound.currentTime = 0;
          fallSound.play();
        }
        setPhase('gameover');
      }
    } else if (phase === 'gameover') {
      // Sphere Falling Animation
      if (spherePos.y > OBJECT_REMOVAL_POSITION_Y) {
        velocity.current.y -= GRAVITY * delta;
        spherePos.add(velocity.current.clone().multiplyScalar(delta));
      }
    }
  });

  return (
    <>
      <Sphere ref={sphere} />
      <Level />
      <Lights />
      {performance && <Perf position="bottom-left" />}
    </>
  );
}
