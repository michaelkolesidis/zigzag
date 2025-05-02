import { Canvas } from '@react-three/fiber';
import Interface from './interface/Interface';
import Game from './Game';
import useGame from './stores/useGame';

export default function App() {
  const isMobile = useGame((state) => state.isMobile);

  // Prevent right click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  return (
    <>
      <Interface />
      <Canvas orthographic camera={{ zoom: isMobile ? 35 : 70 }}>
        <Game />
      </Canvas>
    </>
  );
}
