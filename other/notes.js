{
  /* <ambientLight
ref={ambientLightRef}
intensity={3}
// color={AMBIENT_COLORS[ambientColorIndex]}
/> */
}

// *** Ambient Light Colors ***
// const AMBIENT_COLORS = [
//   // 'purple',
//   // '#ff6347',
//   // '#1e90ff',
//   // '#32cd32',
//   // '#406ea3',
//   '#009cff',
//   // '#ffa500',
//   // '#ffff00',
// ]; // Tomato, DodgerBlue, LimeGreen, Orange, Yellow
// const AMBIENT_COLOR_CHANGE_INTERVAL = 10000; // 10 seconds in milliseconds

// const [ambientColorIndex, setAmbientColorIndex] = useState(0);

// *** Effect for Cycling Ambient Light Color ***
// useEffect(() => {
//   const intervalId = setInterval(() => {
//     setAmbientColorIndex((prevIndex) => {
//       const nextIndex = (prevIndex + 1) % AMBIENT_COLORS.length;
//       // Update light color directly via ref for smooth transition
//       if (ambientLightRef.current) {
//         ambientLightRef.current.color.set(AMBIENT_COLORS[nextIndex]);
//       }
//       return nextIndex;
//     });
//   }, AMBIENT_COLOR_CHANGE_INTERVAL);

//   return () => clearInterval(intervalId); // Cleanup interval
// }, []); // Run only on mount

// INSIDE RETURN
// generateInitialPlatform();
// generatePathSegment();
// setupCamera();
// Reset ambient light to initial color (optional)
// setAmbientColorIndex(0);
// if (ambientLightRef.current) {
//   ambientLightRef.current.color.set(AMBIENT_COLORS[0]);
