import React, { forwardRef } from 'react';
// import { Billboard } from '@react-three/drei';
import { SPHERE_RADIUS } from './constants/constants.js';

const Sphere = forwardRef((props, ref) => {
  return (
    <mesh ref={ref} position={[0, SPHERE_RADIUS, 0]}>
      {/* <circleGeometry args={[SPHERE_RADIUS, 32]} /> */}
      <sphereGeometry args={[SPHERE_RADIUS, 32, 32]} />
      <meshStandardMaterial color="#888888" metalness={1} roughness={0.7} />
    </mesh>
  );
});

export default Sphere;
