import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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

      // Phases
      phase: 'ready', // ready, playing, gameover
      setPhase: (phase) => set({ phase }),

      // Score
      score: 0,
      addPoints: (points) => set((state) => ({ score: state.score + points })),
    };
  })
);
