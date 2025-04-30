import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { getLocalStorage, setLocalStorage } from './utils';

const useSound = create(
  subscribeWithSelector((set) => ({
    sound: getLocalStorage('sound') ?? true,
    toggleSound: () => {
      set((state) => {
        const newSoundState = !state.sound;
        setLocalStorage('sound', newSoundState);
        return { sound: newSoundState };
      });
    },
  }))
);

export default useSound;
