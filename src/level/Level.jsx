import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Stores
import useGame from '../stores/useGame.js';
import useSound from '../stores/useSound.js';

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
  GEM_RADIUS,
  GEM_SPAWN_PROBABILITY,
  GEM_HEIGHT_OFFSET,
  GRAVITY,
} from '../constants/constants.js';
import createIdGenerator from '../utils/idGenerator.js';

// Components
import Tile from './components/Tile.jsx';
import Gem from './components/Gem.jsx';
import FloatingText from './components/FloatingText.jsx';

// Sound effects
const gemSound = new Audio('sounds/gem.mp3');

export default function Level() {
  // Store
  const addPoints = useGame((state) => state.addPoints);
  const phase = useGame((state) => state.phase);
  const directions = useGame((state) => state.directions);
  const sound = useSound((state) => state.sound);
  const tiles = useGame((state) => state.tiles);
  const setTiles = useGame((state) => state.setTiles);
  const gems = useGame((state) => state.gems);
  const setGems = useGame((state) => state.setGems);
  const spherePos = useGame((state) => state.spherePos);
  const isOnPlatform = useGame((state) => state.isOnPlatform);
  const setIsOnPlatform = useGame((state) => state.setIsOnPlatform);
  const floatingTexts = useGame((state) => state.floatingTexts);
  const setFloatingTexts = useGame((state) => state.setFloatingTexts);

  // Create ID generators for tiles and gems
  const tileIdGenerator = useMemo(() => createIdGenerator(), []);
  const gemIdGenerator = useMemo(() => createIdGenerator(), []);
  const floatingTextIdGenerator = useMemo(() => createIdGenerator(), []);

  // Level generation
  const tileMeshRefs = useRef({});
  const lastTilePosition = useRef(new THREE.Vector3(0, -TILE_DEPTH / 2, 0));
  const gemMeshRefs = useRef({});
  const currentDirection = useRef(new THREE.Vector3(0, 0, -1));
  const targetDirection = useRef(new THREE.Vector3(0, 0, -1));

  // Tile falling
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

  const resetLevel = useCallback(() => {
    lastTilePosition.current.set(0, -TILE_DEPTH / 2, 0);
    currentDirection.current.copy(directions[0]);
    targetDirection.current.copy(directions[0]);
    tileIdGenerator.reset();
    gemIdGenerator.reset();
    floatingTextIdGenerator.reset();
    tileMeshRefs.current = {};
    gemMeshRefs.current = {};
    tileLastContactTime.current = {}; // reset contact times
    currentTileIdRef.current = null; // reset current tile
    setTiles([]);
    setGems([]);
    setIsOnPlatform(true);

    divergenceX.current = 0;
    divergenceZ.current = 0;

    generateInitialPlatform();
    for (let i = 0; i <= TARGET_LOOKAHEAD_DISTANCE; i++) {
      generatePathSegment();
    }
  }, [
    generateInitialPlatform,
    generatePathSegment,
    directions,
    tileIdGenerator,
    gemIdGenerator,
    floatingTextIdGenerator,
    setGems,
    setTiles,
    setIsOnPlatform,
  ]);

  // Initial Setup
  useEffect(() => {
    if (phase === 'gameover' || phase === 'playing') return;
    resetLevel();
  }, [resetLevel, phase]);

  // Game Loop
  useFrame((state, delta) => {
    const { clock } = state;

    if (phase === 'ready') {
      return;
    }

    if (phase === 'playing' || phase === 'gameover') {
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
          if (
            (spherePos.distanceTo(gemPos) < SPHERE_RADIUS + GEM_RADIUS) &
            isOnPlatform
          ) {
            if (sound) {
              gemSound.currentTime = 0;
              gemSound.play();
            }
            addPoints(1); // add score for collecting a gem
            gemsToRemove.push(gem.id); // mark gem for removal

            const newFloatingText = {
              id: floatingTextIdGenerator.generate(),
              position: gemPos.clone(),
            };
            setFloatingTexts((prevFloatingTexts) => [
              ...prevFloatingTexts,
              newFloatingText,
            ]);
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
      setIsOnPlatform(false);
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
            setIsOnPlatform(true);
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
    }
  });

  return (
    <>
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

      {/* Floating Texts */}
      {floatingTexts.map((text) => (
        <FloatingText
          key={text.id}
          position={text.position}
          content="+1"
          onComplete={() => {
            setFloatingTexts((prev) => prev.filter((t) => t.id !== text.id));
          }}
        />
      ))}

      {/* To avoid screen flash caused by unsupported GPOS table LookupType log */}
      {/* TODO: Find the cause of the error and fix it */}
      <FloatingText key="for-error" position={[0, -1, 0]} content="" />
    </>
  );
}
