import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';

export default function FloatingText({ position, content, onComplete }) {
  const text = useRef();
  const lifetime = useRef(0);

  useFrame((_, delta) => {
    lifetime.current += delta;

    if (text.current) {
      text.current.position.y += delta * 0.75;
      const material = text.current.material;
      if (material) {
        material.opacity = material.opacity - delta * 2;
      }
    }

    if (lifetime.current > 0.5 && typeof onComplete === 'function') {
      onComplete();
    }
  });

  return (
    <Billboard position={position}>
      <Text
        ref={text}
        fontSize={0.5}
        fontWeight={500}
        color="#f283c0"
        anchorX="center"
        anchorY="middle"
        material-toneMapped={false}
        material-transparent
        material-opacity={1.25}
      >
        {content}
      </Text>
    </Billboard>
  );
}
