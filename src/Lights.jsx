export default function Lights() {
  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight position={[15, 30, 10]} intensity={3.5} />
    </>
  );
}
