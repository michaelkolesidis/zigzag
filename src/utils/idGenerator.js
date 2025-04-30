// Tile and gem ID Generator
const createIdGenerator = () => {
  let counter = 0;
  return {
    generate: () => counter++,
    reset: () => {
      counter = 0;
    },
  };
};

export default createIdGenerator;
