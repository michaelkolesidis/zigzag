import { forwardRef } from 'react';
import {
  SPHERE_RADIUS,
  SPHERE_SEGMENTS,
  SPHERE_COLOR,
  SPHERE_METALNESS,
  SPHERE_ROUGHNESS,
} from './constants/constants.js';
import { Edges } from '@react-three/drei';

const Sphere = forwardRef((props, ref) => {
  return (
    <mesh ref={ref} position={[0, SPHERE_RADIUS, 0]}>
      <sphereGeometry
        args={[SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS]}
      />
      <meshStandardMaterial color={0x000000} />
      <Edges linewidth={3} threshold={5} color={'#06cf06'} />
    </mesh>
  );
});

export default Sphere;
