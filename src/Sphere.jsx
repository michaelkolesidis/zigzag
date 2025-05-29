import { forwardRef } from 'react';
import {
  SPHERE_RADIUS,
  SPHERE_SEGMENTS,
  SPHERE_COLOR,
  SPHERE_COLOR_DARK,
  SPHERE_METALNESS,
  SPHERE_ROUGHNESS,
} from './constants/constants.js';
import useGame from './stores/useGame.js';

const Sphere = forwardRef((props, ref) => {
  const { dark } = useGame((state) => state);

  return (
    <mesh ref={ref} position={[0, SPHERE_RADIUS, 0]}>
      <sphereGeometry
        args={[SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS]}
      />
      <meshStandardMaterial
        color={dark ? SPHERE_COLOR_DARK : SPHERE_COLOR}
        metalness={SPHERE_METALNESS}
        roughness={SPHERE_ROUGHNESS}
      />
    </mesh>
  );
});

export default Sphere;
