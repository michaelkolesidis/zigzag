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

// Geometries and materials
const coneGeometry = new THREE.ConeGeometry(
  GEM_RADIUS,
  GEM_HEIGHT,
  GEM_SEGMENTS
);
coneGeometry.translate(0, GEM_RADIUS * 0.75, 0); // move tip to y = +1.5, base to y = 0

const gemMaterial = new THREE.MeshStandardMaterial({
  color: GEM_COLOR,
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
      <mesh geometry={coneGeometry} material={gemMaterial} />

      {/* Bottom cone: points down */}
      <mesh
        geometry={coneGeometry}
        material={gemMaterial}
        rotation={[Math.PI, 0, 0]}
      />
    </group>
  );
}
