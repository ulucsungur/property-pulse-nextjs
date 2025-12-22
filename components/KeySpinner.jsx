'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';

function KeyMesh() {
    const groupRef = useRef();

    // Animasyon: Kendi etrafında Y ekseninde (para gibi) döner
    useFrame((state, delta) => {
        groupRef.current.rotation.y += delta * 3;
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    });

    const materialProps = {
        color: '#F59E0B',
        metalness: 0.6,
        roughness: 0.2
    };

    return (
        <group ref={groupRef} dispose={null}>
            {/* 1. Model: Anahtar Başı (Torus) - Düz bakacak şekilde [0,0,0] */}
            <mesh position={[-1.4, 0, 0]} rotation={[0, 0, 0]}>
                <torusGeometry args={[0.5, 0.15, 16, 32]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>

            {/* 1. Model: Gövde (Cylinder) - Sağa doğru uzanacak */}
            <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <cylinderGeometry args={[0.1, 0.1, 3, 12]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>

            {/* 1. Model: Dişler (Box) - Gövdenin ucuna ve altına */}
            <mesh position={[1.5, -0.2, 0]}>
                <boxGeometry args={[0.2, 0.4, 0.1]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[1.1, -0.15, 0]}>
                <boxGeometry args={[0.2, 0.3, 0.1]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
        </group>
    );
}

export default function KeySpinner() {
    return (
        <div className="w-[180px] h-[180px] flex items-center justify-center mx-auto">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 60 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} />
                <spotLight position={[-5, -5, 5]} intensity={0.5} />
                <Center>
                    <KeyMesh />
                </Center>
            </Canvas>
        </div>
    );
}
