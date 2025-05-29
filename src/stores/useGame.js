import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as THREE from 'three';
import { getLocalStorage, setLocalStorage } from './utils';
import { SPHERE_RADIUS } from '../constants/constants';

export default create(
  subscribeWithSelector((set) => {
    return {
      // Is the game running on mobile
      isMobile: window.innerWidth < 768,

      // Show performance
      performance: window.location.hash === '#debug',
      togglePerformance: () => {
        set((state) => {
          return {
            performance: !state.performance,
          };
        });
      },

      // Dark mode
      dark: getLocalStorage('dark') ?? true,
      toggleDark: () => {
        set((state) => {
          const newDarkState = !state.dark;
          setLocalStorage('dark', newDarkState);
          return { dark: newDarkState };
        });
      },

      // Phases
      phase: 'ready', // ready, playing, gameover
      setPhase: (phase) => set({ phase }),

      // Directions
      directions: [
        new THREE.Vector3(0, 0, -1), // - z-axis
        new THREE.Vector3(1, 0, 0), // + x-axis
      ],

      // Sphere position
      spherePos: new THREE.Vector3(0, SPHERE_RADIUS, 0),
      setSpherePos: (pos) => set({ spherePos: pos.clone() }),

      // Is shpere on platform?
      isOnPlatform: true,
      setIsOnPlatform: (isOnPlatform) => set({ isOnPlatform }),

      // Tiles
      tiles: [],
      setTiles: (tilesUpdater) =>
        set((state) => ({
          tiles:
            typeof tilesUpdater === 'function'
              ? tilesUpdater(state.tiles)
              : tilesUpdater,
        })),

      // Gems
      gems: [],
      setGems: (gemsUpdater) =>
        set((state) => ({
          gems:
            typeof gemsUpdater === 'function'
              ? gemsUpdater(state.gems)
              : gemsUpdater,
        })),

      // Floating texts
      floatingTexts: [],
      setFloatingTexts: (updater) =>
        set((state) => ({
          floatingTexts:
            typeof updater === 'function'
              ? updater(state.floatingTexts)
              : updater,
        })),

      // Score
      score: 0,
      addPoints: (points) => set((state) => ({ score: state.score + points })),
      resetScore: () => set(() => ({ score: 0 })),

      // Best score
      bestScore: getLocalStorage('bestScore') ?? 0,
      setBestScore: (score) => {
        set({ bestScore: score });
        setLocalStorage('bestScore', score);
      },
      resetBestScore: () => {
        set({ bestScore: 0 });
        setLocalStorage('bestScore', 0);
      },

      // Games played
      gamesPlayed: getLocalStorage('gamesPlayed') ?? 0,
      setGamesPlayed: (gamesPlayed) => {
        set({ gamesPlayed });
        setLocalStorage('gamesPlayed', gamesPlayed);
      },
      resetGamesPlayed: () => {
        set({ gamesPlayed: 0 });
        setLocalStorage('gamesPlayed', 0);
      },
    };
  })
);
