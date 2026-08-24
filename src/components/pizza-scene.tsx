import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const CRUST = "#c47a32";
const CHEESE = "#f0c14a";
const PEPPERONI = "#9b1c1c";
const PEPPER = "#3f7d4e";

function wedgeShape(radius: number, angle: number) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.absarc(0, 0, radius, -angle / 2, angle / 2, false);
  s.lineTo(0, 0);
  return s;
}

function makeWedge(radius: number, angle: number, depth: number, lift: number) {
  const g = new THREE.ExtrudeGeometry(wedgeShape(radius, angle), {
    depth,
    bevelEnabled: false,
  });
  g.rotateX(Math.PI / 2);
  g.center();
  g.translate(0, lift, 0);
  return g;
}

const cheeseGeom = makeWedge(1.5, 0.95, 0.1, 0.08);
const crustGeom = makeWedge(1.62, 1.02, 0.18, 0);
const pepGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.035, 8);
const pepPos: [number, number][] = [
  [-0.25, 0.12],
  [0.15, -0.28],
  [0.35, 0.18],
  [-0.05, -0.08],
  [0.45, -0.05],
  [0.1, 0.32],
];

function SparkleDust() {
  const points = useRef<THREE.Points>(null);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 28;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = Math.random() * 2.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += Math.min(delta, 0.1) * 0.12;
  });

  return (
    <points ref={points} geometry={geom}>
      <pointsMaterial
        color="#ffe7b8"
        size={0.06}
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

function PizzaMesh({ pulse }: { pulse: number }) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(0);
  const spin = useRef(0.6);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    t.current += d;
    spin.current += d * (pulse > 0 ? 1.4 : 0.32);
    if (!group.current) return;
    group.current.rotation.y = spin.current;
    group.current.position.y = Math.sin(t.current * 1.3) * 0.07;
  });

  return (
    <group ref={group} rotation={[-0.72, 0.2, 0]}>
      <mesh geometry={crustGeom}>
        <meshStandardMaterial
          color={CRUST}
          roughness={0.7}
          emissive={CRUST}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh geometry={cheeseGeom}>
        <meshStandardMaterial
          color={CHEESE}
          roughness={0.4}
          emissive={CHEESE}
          emissiveIntensity={0.18}
        />
      </mesh>
      {pepPos.map(([x, z], i) => (
        <mesh
          key={i}
          geometry={pepGeom}
          position={[x, 0.16, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial
            color={PEPPERONI}
            roughness={0.5}
            emissive={PEPPERONI}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      <mesh position={[0.2, 0.16, 0.28]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <boxGeometry args={[0.26, 0.08, 0.03]} />
        <meshStandardMaterial color={PEPPER} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function PizzaScene({
  pulse = 0,
  onReady,
}: {
  pulse?: number;
  onReady?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 2.4, 3.4], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      className="absolute inset-0 h-full w-full"
      onCreated={() => onReady?.()}
    >
      <hemisphereLight args={["#ffe7c2", "#1a1a1c", 1.1]} />
      <directionalLight position={[2, 6, 3]} intensity={2.4} color="#fff1d6" />
      <pointLight position={[-2, 1.2, 2]} intensity={1.4} color="#e4002b" />
      <SparkleDust />
      <PizzaMesh pulse={pulse} />
    </Canvas>
  );
}
