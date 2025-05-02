import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
// import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';

// Stores
import useGame from './stores/useGame';
import useSound from './stores/useSound.js';

// Constants and utilities
import {
  TILE_SIZE,
  TILE_DEPTH,
  TILE_STATUS,
  TARGET_LOOKAHEAD_DISTANCE,
  FALL_DELAY_SECONDS,
  OBJECT_REMOVAL_POSITION_Y,
  PLATFORM_WIDTH_TILES,
  PLATFORM_LENGTH_TILES,
  PLATFORM_TILE_COUNT,
  MAX_DIVERGENCE,
  SPHERE_RADIUS,
  INITIAL_SPEED,
  SPEED_INCREMENT,
  GEM_RADIUS,
  GEM_SPAWN_PROBABILITY,
  GEM_HEIGHT_OFFSET,
  GRAVITY,
  CAMERA_OFFSET_X,
  CAMERA_OFFSET_Y,
  CAMERA_OFFSET_Z,
} from './constants/constants.js';
import createIdGenerator from './utils/idGenerator.js';

// Components
import Tile from './Tile';
import Gem from './Gem';

// Sound effects
const tapSound = new Audio('sounds/tap.mp3');
const fallSound = new Audio('sounds/fall.mp3');
const gemSound = new Audio('sounds/gem.mp3');
const uiSound = new Audio('sounds/ui.mp3');
uiSound.volume = 0.75;

export default function Game() {
  const { camera } = useThree();

  const addPoints = useGame((state) => state.addPoints);
  const phase = useGame((state) => state.phase);
  const setPhase = useGame((state) => state.setPhase);
  const performance = useGame((state) => state.performance);
  const togglePerformance = useGame((state) => state.togglePerformance);
  const isMobile = useGame((state) => state.isMobile);
  const sound = useSound((state) => state.sound);
  const toggleSound = useSound((state) => state.toggleSound);

  // Create ID generators for tiles and gems
  const tileIdGenerator = useMemo(() => createIdGenerator(), []);
  const gemIdGenerator = useMemo(() => createIdGenerator(), []);

  const directions = useMemo(
    () => [
      new THREE.Vector3(0, 0, -1), // - z-axis
      new THREE.Vector3(1, 0, 0), // + x-axis
    ],
    []
  );

  const sphere = useRef();
  const speed = useRef(INITIAL_SPEED);
  const currentDirection = useRef(new THREE.Vector3(0, 0, -1)); // actual movement direction
  const targetDirection = useRef(new THREE.Vector3(0, 0, -1)); // intended direction after input

  const directionIndex = useRef(0);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  // Level Generation State
  const [tiles, setTiles] = useState([]);
  const tileMeshRefs = useRef({});
  const lastTilePosition = useRef(new THREE.Vector3(0, -TILE_DEPTH / 2, 0));
  const [gems, setGems] = useState([]);
  const gemMeshRefs = useRef({});

  // State for Tile Falling State
  const tileLastContactTime = useRef({}); // { tileId: timestamp }
  const currentTileIdRef = useRef(null); // ID of the tile sphere is currently on

  // Cleanup Refs on Unmount or Reset
  useEffect(() => {
    return () => {
      tileMeshRefs.current = {};
      gemMeshRefs.current = {};
      tileLastContactTime.current = {};
    };
  }, []);

  // Generate Initial Platform
  const generateInitialPlatform = useCallback(() => {
    const initialTilesData = [];
    const tileY = -TILE_DEPTH / 2;

    // Start at the top-right corner
    const halfWidthOffset = Math.floor(PLATFORM_WIDTH_TILES / 2) * TILE_SIZE;
    const startX = halfWidthOffset; // top-right corner
    let currentZ = 0;

    for (let l = 0; l < PLATFORM_LENGTH_TILES; l++) {
      currentZ = -l * TILE_SIZE;
      for (let w = 0; w < PLATFORM_WIDTH_TILES; w++) {
        const tileX = startX - w * TILE_SIZE; // set start
        const tilePos = new THREE.Vector3(tileX, tileY, currentZ);
        initialTilesData.push({
          id: tileIdGenerator.generate(),
          position: tilePos,
          status: TILE_STATUS.ACTIVE,
        });
      }
    }

    // Set the lastTilePosition to be the top-right corner
    lastTilePosition.current.set(startX, tileY, currentZ);

    // Set state in resetGame or useEffect after clearing previous state
    setTiles(initialTilesData);
  }, []);

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

  let divergenceX = useRef(0);
  let divergenceZ = useRef(0);

  // Path Generation
  const generatePathSegment = useCallback(() => {
    if (divergenceX.current >= MAX_DIVERGENCE) {
      currentDirection.current.set(0, 0, -1); // Moving forward (along -Z)
      divergenceZ.current += 1;
      divergenceX.current -= 1;
    } else if (divergenceZ.current >= MAX_DIVERGENCE) {
      currentDirection.current.set(1, 0, 0); // Moving to the right (along +X)
      divergenceX.current += 1;
      divergenceZ.current -= 1;
    } else {
      // Randomly choose to either move forward or turn right
      if (Math.random() < 0.5) {
        currentDirection.current.set(0, 0, -1); // Moving forward (along -Z)
        divergenceZ.current += 1;
        divergenceX.current -= 1;
      } else {
        currentDirection.current.set(1, 0, 0); // Moving to the right (along +X)
        divergenceX.current += 1;
        divergenceZ.current -= 1;
      }
    }

    // console.log(
    //   'Divergence X:',
    //   divergenceX.current,
    //   'Divergence Z:',
    //   divergenceZ.current
    // );

    // Create a path by continuously adding segments
    const nextPos = lastTilePosition.current
      .clone()
      .addScaledVector(currentDirection.current, TILE_SIZE);

    const newTile = {
      id: tileIdGenerator.generate(),
      position: nextPos.clone(),
      status: TILE_STATUS.ACTIVE,
    };

    setTiles((prevTiles) => [...prevTiles, newTile]);

    if (Math.random() < GEM_SPAWN_PROBABILITY) {
      const gemPos = new THREE.Vector3(
        nextPos.x, // center of the tile x
        nextPos.y + GEM_HEIGHT_OFFSET, // place gem on top surface
        nextPos.z // center of the tile z
      );
      const newGem = {
        id: gemIdGenerator.generate(),
        position: gemPos,
        tileId: newTile.id, // link gem to its tile
      };
      setGems((prevGems) => [...prevGems, newGem]);
    }

    lastTilePosition.current.copy(nextPos);
  }, []);

  // Game Reset Logic
  const resetGame = useCallback(() => {
    setPhase('ready');

    if (sphere.current) {
      sphere.current.position.set(0, SPHERE_RADIUS, 0); // start sphere at origin
      sphere.current.velocity = new THREE.Vector3(0, 0, 0);
    }

    lastTilePosition.current.set(0, -TILE_DEPTH / 2, 0);
    currentDirection.current.copy(directions[0]);
    targetDirection.current.copy(directions[0]);
    directionIndex.current = 0;
    speed.current = INITIAL_SPEED;
    tileIdGenerator.reset();
    gemIdGenerator.reset();
    tileMeshRefs.current = {};
    gemMeshRefs.current = {};
    tileLastContactTime.current = {}; // reset contact times
    currentTileIdRef.current = null; // reset current tile
    setTiles([]);
    setGems([]);
    generateInitialPlatform();
    for (let i = 0; i <= TARGET_LOOKAHEAD_DISTANCE; i++) {
      generatePathSegment();
    }
    setupCamera();
  }, [
    directions,
    generateInitialPlatform,
    setupCamera,
    generatePathSegment,
    setPhase,
    gemIdGenerator,
    tileIdGenerator,
  ]);

  // Initial Setup
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Input Handling
  useEffect(() => {
    const handleInput = (e) => {
      // Gameplay
      if (
        e.type === 'pointerdown' ||
        (e.type === 'keydown' && (e.code === 'Enter' || e.code === 'Space'))
      ) {
        // Playing Phase
        if (phase === 'playing') {
          document.body.style.cursor = 'none';
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
            document.body.style.cursor = 'auto';
            if (e.target.alt === 'Settings icon') {
              return;
            }
            if (sound) {
              uiSound.currentTime = 0;
              uiSound.play();
            }
            setPhase('playing');
            return;
          }
          // Game Over Phase
          if (phase === 'gameover') {
            document.body.style.cursor = 'auto';
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
  ]);

  // Game Loop
  useFrame((state, delta) => {
    const { clock } = state;
    if (phase === 'ready') return;

    const spherePos = sphere.current?.position;
    const tilesToRemove = [];
    const gemsToRemove = [];
    const tilesToUpdateStatus = []; // collect status updates

    // Animate Falling Tiles & Check for Removal
    tiles.forEach((tile) => {
      if (tile.status === TILE_STATUS.FALLING) {
        const tileMesh = tileMeshRefs.current[tile.id];

        if (tileMesh) {
          // The iniitial platform tiles are not removed
          if (tile.id < PLATFORM_TILE_COUNT - 1) return;

          // The iniitial platform tiles fall all together
          if (tile.id === PLATFORM_TILE_COUNT) {
            let id = 0;
            while (id < PLATFORM_TILE_COUNT) {
              const tileMesh = tileMeshRefs.current[id];
              if (tileMesh) {
                tileMesh.position.y -= GRAVITY * delta;
              }
              id++;
            }
          }

          tileMesh.position.y -= GRAVITY * delta;

          gems.forEach((gem) => {
            // Check if the gem belongs to the current falling tile AND is not already marked for removal (collected)
            if (gem.tileId === tile.id && !gemsToRemove.includes(gem.id)) {
              const gemMesh = gemMeshRefs.current[gem.id];
              if (gemMesh) {
                gemMesh.position.y -= GRAVITY * 0.9 * delta;
              }
            }
          });

          if (tileMesh.position.y < OBJECT_REMOVAL_POSITION_Y) {
            tilesToRemove.push(tile.id);
            gems.forEach((gem) => {
              if (gem.tileId === tile.id) {
                gemsToRemove.push(gem.id);
              }
            });
          }
        } else {
          tilesToRemove.push(tile.id);
          gems.forEach((gem) => {
            if (gem.tileId === tile.id) {
              gemsToRemove.push(gem.id);
            }
          });
        }
      }
    });

    // Remove Tiles That Finished Falling
    if (tilesToRemove.length > 0) {
      setTiles((prevTiles) =>
        prevTiles.filter((tile) => !tilesToRemove.includes(tile.id))
      );
      tilesToRemove.forEach((id) => {
        delete tileMeshRefs.current[id];
        delete tileLastContactTime.current[id]; // Clean up contact time entry
      });
    }

    if (gemsToRemove.length > 0) {
      setGems((prevGems) =>
        prevGems.filter((gem) => !gemsToRemove.includes(gem.id))
      );
      gemsToRemove.forEach((id) => {
        delete gemMeshRefs.current[id];
      });
    }

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

      // Level Generation
      while (
        spherePos.distanceTo(lastTilePosition.current) <
        TARGET_LOOKAHEAD_DISTANCE
      ) {
        generatePathSegment();
      }

      // Gem Collision Detection & Collection
      gems.forEach((gem) => {
        const gemMesh = gemMeshRefs.current[gem.id];
        if (gemMesh) {
          // Check if mesh exists (it might be pending removal)
          const gemPos = gemMesh.position;
          // Distance check
          if (spherePos.distanceTo(gemPos) < SPHERE_RADIUS + GEM_RADIUS) {
            if (sound) {
              gemSound.currentTime = 0;
              gemSound.play();
            }
            addPoints(1); // add score for collecting a gem
            gemsToRemove.push(gem.id); // mark gem for removal
          }
        }
      });

      // Update gems state after checking collisions
      if (gemsToRemove.length > 0) {
        setGems((prevGems) =>
          prevGems.filter((gem) => !gemsToRemove.includes(gem.id))
        );
        gemsToRemove.forEach((id) => {
          delete gemMeshRefs.current[id];
        });
        // Do we need to clear for next frame?
      }

      // Tile Interaction & Fall Trigger
      let isOnPlatform = false;
      let currentContactTileId = null;
      const halfTile = TILE_SIZE / 2;

      // Find current tile and update contact time
      for (const tile of tiles) {
        const mesh = tileMeshRefs.current[tile.id];
        // Check only ACTIVE tiles for support
        if (mesh && tile.status === TILE_STATUS.ACTIVE) {
          const meshPos = mesh.position;
          if (
            spherePos.x >= meshPos.x - halfTile &&
            spherePos.x <= meshPos.x + halfTile &&
            spherePos.z >= meshPos.z - halfTile &&
            spherePos.z <= meshPos.z + halfTile &&
            spherePos.y >= meshPos.y - SPHERE_RADIUS &&
            spherePos.y < meshPos.y + TILE_DEPTH + SPHERE_RADIUS
          ) {
            isOnPlatform = true;
            currentContactTileId = tile.id; // store ID of current tile
            // Update last contact time for the tile we are currently on
            tileLastContactTime.current[tile.id] = clock.elapsedTime;
            break; // found the supporting tile
          }
        }
      }
      currentTileIdRef.current = currentContactTileId; // update ref for global access

      // Check ACTIVE tiles to see if they should start falling (time-based)
      tiles.forEach((tile) => {
        if (
          tile.status === TILE_STATUS.ACTIVE &&
          tile.id !== currentTileIdRef.current
        ) {
          const lastContact = tileLastContactTime.current[tile.id];
          if (
            lastContact &&
            clock.elapsedTime - lastContact > FALL_DELAY_SECONDS
          ) {
            // Mark this tile to start falling
            tilesToUpdateStatus.push({
              id: tile.id,
              status: TILE_STATUS.FALLING,
            });
            // Remove from contact time map to prevent re-triggering
            delete tileLastContactTime.current[tile.id];
          }
        }
      });

      // Batch update tile statuses if any changed
      if (tilesToUpdateStatus.length > 0) {
        setTiles((prevTiles) =>
          prevTiles.map((tile) => {
            const update = tilesToUpdateStatus.find((u) => u.id === tile.id);
            return update ? { ...tile, status: update.status } : tile;
          })
        );

        tilesToUpdateStatus.forEach((update) => {
          const mesh = tileMeshRefs.current[update.id];
          if (mesh) mesh.userData.status = update.status;
        });
      }

      // Sphere Fall Detection
      if (!isOnPlatform) {
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
      {/* Sphere */}
      <mesh ref={sphere} position={[0, SPHERE_RADIUS, 0]}>
        <sphereGeometry args={[SPHERE_RADIUS, 32, 32]} />
        <meshStandardMaterial color="#888888" metalness={1} roughness={0.7} />
      </mesh>

      {/* Level Tiles */}
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          tileData={tile}
          tileRef={(el) => {
            if (el) tileMeshRefs.current[tile.id] = el;
            else delete tileMeshRefs.current[tile.id];
          }}
        />
      ))}

      {/* Gems */}
      {gems.map((gem) => (
        <Gem
          key={gem.id}
          gemData={gem}
          gemRef={(el) => {
            if (el) gemMeshRefs.current[gem.id] = el;
            else delete gemMeshRefs.current[gem.id];
          }}
        />
      ))}

      {/* Lights */}
      <directionalLight position={[15, 30, 10]} intensity={4} />
      <ambientLight intensity={3} />

      {/* Performance Panel */}
      {performance && <Perf position="bottom-left" />}
    </>
  );
}
