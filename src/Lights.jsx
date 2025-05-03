export default function Lights() {
  return (
    <>
      <directionalLight position={[15, 30, 10]} intensity={4} />
      <ambientLight intensity={3} />
    </>
  );
}
