import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';

// Stores
import useGame from './stores/useGame';
import useSound from './stores/useSound.js';

// Constants and utilities
import {
  OBJECT_REMOVAL_POSITION_Y,
  SPHERE_RADIUS,
  INITIAL_SPEED,
  SPEED_INCREMENT,
  GRAVITY,
  CAMERA_OFFSET_X,
  CAMERA_OFFSET_Y,
  CAMERA_OFFSET_Z,
} from './constants/constants.js';

// Components
import Level from './level/Level.jsx';
import Lights from './Lights.jsx';
import Sphere from './Sphere.jsx';

// Sound effects
const tapSound = new Audio('sounds/tap.mp3');
const fallSound = new Audio('sounds/fall.mp3');
const uiSound = new Audio('sounds/ui.mp3');
uiSound.volume = 0.75;

export default function Game() {
  // Store
  const {
    score,
    bestScore,
    gamesPlayed,
    setGamesPlayed,
    phase,
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

  // Sphere movement
  const sphere = useRef();
  const speed = useRef(INITIAL_SPEED);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const directionIndex = useRef(0);
  const currentDirection = useRef(new THREE.Vector3(0, 0, -1));
  const targetDirection = useRef(new THREE.Vector3(0, 0, -1));

  // Camera Setup
  const setupCamera = useCallback(() => {
    if (!sphere.current) return;
    const spherePos = sphere.current.position;

    // Initial camera position
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
      // Gameplay
      if (
        e.type === 'pointerdown' ||
        (e.type === 'keydown' &&
          (e.code === 'Enter' ||
            e.code === 'ArrowUp' ||
            e.code === 'ArrowDown'))
      ) {
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
              e.target.alt === 'Settings icon' ||
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
        // Toggle sound
        if (e.type === 'keydown' && e.code === 'KeyM') {
          toggleSound();
        }

        // Toggle performance panel
        if (e.type === 'keydown' && e.code === 'KeyP') {
          togglePerformance();
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
      speed.current += SPEED_INCREMENT * delta;

      // Camera Movement (only if sphere not falling)
      if (spherePos.y > OBJECT_REMOVAL_POSITION_Y) {
        camera.position.x = -CAMERA_OFFSET_X;
        camera.position.y = camera.position.y + (speed.current / 2.012) * delta; // TODO: elimate magic number, follow sphere world y position
        camera.position.z = CAMERA_OFFSET_Z;
      }

      // Sphere Fall Detection
      if (!isOnPlatform) {
        if (score > bestScore) {
          setBestScore(score);
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
