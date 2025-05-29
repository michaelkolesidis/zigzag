import useGame from './stores/useGame';
import {
  AMBIENT_INTENSITY,
  AMBIENT_INTENSITY_DARK,
  DIRECTIONAL_INTENSITY,
  DIRECTIONAL_INTENSITY_DARK,
  DIRECTIONAL_POSITION,
} from './constants/constants';

export default function Lights() {
  const { dark } = useGame((state) => state);

  return (
    <>
      <ambientLight
        intensity={dark ? AMBIENT_INTENSITY_DARK : AMBIENT_INTENSITY}
      />
      <directionalLight
        position={DIRECTIONAL_POSITION}
        intensity={dark ? DIRECTIONAL_INTENSITY_DARK : DIRECTIONAL_INTENSITY}
      />
    </>
  );
}
