import { Canvas } from '@react-three/fiber';
import useGame from './stores/useGame';
import Interface from './interface/Interface';
import Game from './Game';
import { fancyLog } from './utils/fancyLog';
import { useEffect } from 'react';

export default function App() {
  const { isMobile } = useGame((state) => state);

  useEffect(() => {
    // Prevent right click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Fancy log message
    fancyLog();
  }, []);

  return (
    <>
      <Interface />
      <Canvas orthographic camera={{ zoom: isMobile ? 35 : 70 }}>
        <Game />
      </Canvas>
    </>
  );
}
