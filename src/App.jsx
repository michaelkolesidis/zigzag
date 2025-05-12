import { Canvas } from '@react-three/fiber';
import useGame from './stores/useGame';
import Interface from './interface/Interface';
import Game from './Game';
import { fancyLog } from './utils/fancyLog';
import { useEffect } from 'react';
import { ZOOM_LEVEL_DESKTOP, ZOOM_LEVEL_MOBILE } from './constants/constants';

export default function App() {
  const { isMobile } = useGame((state) => state);

  useEffect(() => {
    // Prevent right click
    const preventContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);

    // Fancy log message
    fancyLog();

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  return (
    <>
      <Interface />
      <Canvas
        orthographic
        camera={{ zoom: isMobile ? ZOOM_LEVEL_MOBILE : ZOOM_LEVEL_DESKTOP }}
      >
        <Game />
      </Canvas>
    </>
  );
}
