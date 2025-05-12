import {
  AMBIENT_INTENSITY,
  DIRECTIONAL_INTENSITY,
  DIRECTIONAL_POSITION,
} from './constants/constants';

export default function Lights() {
  return (
    <>
      <ambientLight intensity={AMBIENT_INTENSITY} />
      <directionalLight
        position={DIRECTIONAL_POSITION}
        intensity={DIRECTIONAL_INTENSITY}
      />
    </>
  );
}
