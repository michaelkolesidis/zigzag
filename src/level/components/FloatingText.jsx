import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import useGame from '../../stores/useGame';

export default function FloatingText({ position, content, onComplete }) {
  const text = useRef();
  const lifetime = useRef(0);
  const { dark } = useGame((state) => state);

  useFrame((_, delta) => {
    lifetime.current += delta;

    if (text.current) {
      text.current.position.y += delta * 4;
      const material = text.current.material;
      if (material) {
        material.opacity = material.opacity - delta * 3;
      }
    }

    if (lifetime.current > 0.75 && typeof onComplete === 'function') {
      onComplete();
    }
  });

  return (
    <Billboard position={position}>
      <Text
        ref={text}
        fontSize={0.5}
        fontWeight={500}
        color={dark ? '#cb24b8' : '#fd44e9'}
        anchorX="center"
        anchorY="middle"
        material-toneMapped={false}
        material-transparent
        material-opacity={2}
      >
        {content}
      </Text>
    </Billboard>
  );
}
