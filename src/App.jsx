import { Canvas } from '@react-three/fiber';
import useGame from './stores/useGame';
import Interface from './interface/Interface';
import Game from './Game';
import { fancyLog } from './utils/fancyLog';
import { useEffect } from 'react';
import {
  ZOOM_LEVEL_DESKTOP,
  ZOOM_LEVEL_MOBILE,
  CAMERA_FAR,
  BACKGROUND_COLOR,
  BACKGROUND_COLOR_DARK,
} from './constants/constants';

export default function App() {
  const { isMobile, dark } = useGame((state) => state);

  useEffect(() => {
    // Handle debug mode
    const handleHashChange = () => {
      const isDebug = window.location.hash === '#debug';
      useGame.setState({
        debug: isDebug,
        performance: isDebug,
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check

    // Prevent right click
    const preventContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);

    // Fancy log message
    fancyLog();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  return (
    <>
      <Interface className="dark" />
      <Canvas
        orthographic
        camera={{
          zoom: isMobile ? ZOOM_LEVEL_MOBILE : ZOOM_LEVEL_DESKTOP,
          far: CAMERA_FAR,
        }}
      >
        <color
          attach="background"
          args={[dark ? BACKGROUND_COLOR_DARK : BACKGROUND_COLOR]}
        />
        <Game />
      </Canvas>
    </>
  );
}
