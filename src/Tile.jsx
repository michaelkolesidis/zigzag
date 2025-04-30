import * as THREE from 'three';
import { TILE_SIZE, TILE_DEPTH, TILE_COLOR } from './constants/constants.js';

// Geometries and Materials
const boxGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_DEPTH, TILE_SIZE);
const standardMaterial = new THREE.MeshStandardMaterial({ color: TILE_COLOR });

export default function Tile({ tileData, tileRef }) {
  const { position, id, status } = tileData;
  return (
    <mesh
      ref={tileRef}
      geometry={boxGeometry}
      material={standardMaterial}
      position={position}
      userData={{ status: status, id: id }}
    ></mesh>
  );
}
Tile.displayName = 'Tile';
