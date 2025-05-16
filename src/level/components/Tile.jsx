import * as THREE from 'three';
import { TILE_SIZE, TILE_DEPTH, TILE_COLOR } from '../../constants/constants';
import {
  useGLTF,
  AccumulativeShadows,
  RandomizedLight,
  Edges,
  OrbitControls,
  Outlines,
  Environment,
} from '@react-three/drei';

// Geometries and Materials
const boxGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_DEPTH, TILE_SIZE);
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000,
  // wireframe: true,
});

export default function Tile({ tileData, tileRef }) {
  const { position, id, status } = tileData;
  return (
    <mesh
      ref={tileRef}
      geometry={boxGeometry}
      material={standardMaterial}
      position={position}
      userData={{ status: status, id: id }}
    >
      <Edges linewidth={3} threshold={15} color={'#06cf06'} />
      {/* <Outlines thickness={0.1} color={'#c02040'} /> */}
    </mesh>
  );
}
Tile.displayName = 'Tile';
