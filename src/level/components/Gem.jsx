import * as THREE from 'three';
import {
  GEM_RADIUS,
  GEM_HEIGHT,
  GEM_SEGMENTS,
  GEM_COLOR,
  GEM_METALNESS,
  GEM_ROUGHNESS,
  GEM_ROTATION,
} from '../../constants/constants';
import {
  useGLTF,
  AccumulativeShadows,
  RandomizedLight,
  Edges,
  OrbitControls,
  Outlines,
  Environment,
} from '@react-three/drei';

// Geometries and materials
const coneGeometry = new THREE.ConeGeometry(
  GEM_RADIUS,
  GEM_HEIGHT,
  GEM_SEGMENTS
);
coneGeometry.translate(0, GEM_RADIUS * 0.75, 0); // move tip to y = +1.5, base to y = 0

const gemMaterial = new THREE.MeshStandardMaterial({
  color: 'black',
  metalness: GEM_METALNESS,
  roughness: GEM_ROUGHNESS,
});

export default function Gem({ gemData, gemRef }) {
  const { position, id, tileId } = gemData;
  return (
    <group
      ref={gemRef}
      position={position}
      userData={{ id: id, tileId: tileId, type: 'gem' }}
      rotation={GEM_ROTATION}
    >
      {/* Top cone: points up, base at y = 0 */}
      <mesh geometry={coneGeometry} material={gemMaterial}>
        {' '}
        <Edges linewidth={3} threshold={15} color={'#06cf06'} />
      </mesh>

      {/* Bottom cone: points down */}
      <mesh
        geometry={coneGeometry}
        material={gemMaterial}
        rotation={[Math.PI, 0, 0]}
      >
        <Edges linewidth={3} threshold={15} color={'#06cf06'} />
      </mesh>
    </group>
  );
}
