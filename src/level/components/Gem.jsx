import * as THREE from 'three';
import { GEM_RADIUS, GEM_HEIGHT, GEM_COLOR } from '../../constants/constants';

// Geometries and materials
const coneGeometry = new THREE.ConeGeometry(GEM_RADIUS, GEM_HEIGHT, 4);
coneGeometry.translate(0, GEM_RADIUS * 0.75, 0); // move tip to y = +1.5, base to y = 0
const gemMaterial = new THREE.MeshStandardMaterial({
  color: GEM_COLOR,
  metalness: 0.3,
  roughness: 0.2,
});

export default function Gem({ gemData, gemRef }) {
  const { position, id, tileId } = gemData;
  return (
    <group
      ref={gemRef}
      position={position}
      userData={{ id: id, tileId: tileId, type: 'gem' }}
      rotation={[0, Math.PI / 4, 0]}
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
