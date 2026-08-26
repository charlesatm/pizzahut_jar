import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const DOUGH = "#b9682c";
const CRUST = "#d8893f";
const CRUST_LIGHT = "#eca85e";
const SAUCE = "#c83b31";
const CHEESE = "#f2d166";
const CHEESE_EDGE = "#dba946";
const PEPPERONI = "#a92f2a";
const PEPPERONI_EDGE = "#7c201f";
const PEPPER = "#4d7f48";
const SHADOW = "#09090a";

function sliceShape(tip = -1.52, shoulder = 0.74, halfWidth = 1.02, crown = 1.02) {
  const shape = new THREE.Shape();
  shape.moveTo(0, tip);
  shape.lineTo(-halfWidth, shoulder);
  shape.quadraticCurveTo(0, crown, halfWidth, shoulder);
  shape.lineTo(0, tip);
  return shape;
}

function makeSliceGeometry(shape: THREE.Shape, depth: number, bevelSize: number) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize,
    bevelThickness: bevelSize * 0.75,
    curveSegments: 3,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -depth / 2, 0);
  geometry.computeVertexNormals();
  return geometry;
}

function CameraRig() {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    camera.lookAt(0, 0.12, 0);
  }, [camera]);

  return null;
}

function SparkleDust() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 42;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const turn = index * 2.399963;
      const radius = 1.15 + ((index * 17) % 20) / 18;
      positions[index * 3] = Math.cos(turn) * radius;
      positions[index * 3 + 1] = -0.1 + ((index * 13) % 17) / 10;
      positions[index * 3 + 2] = Math.sin(turn) * radius * 0.72;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return result;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += Math.min(delta, 0.1) * 0.08;
  });

  return (
    <points ref={points} geometry={geometry} position={[0, 0.25, -0.15]}>
      <pointsMaterial
        color="#ffd8ad"
        size={0.045}
        transparent
        opacity={0.72}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function PizzaMesh({ pulse }: { pulse: number }) {
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);
  const bounce = useRef(0);

  const baseGeometry = useMemo(() => makeSliceGeometry(sliceShape(), 0.24, 0.045), []);
  const cheeseGeometry = useMemo(
    () => makeSliceGeometry(sliceShape(-1.4, 0.6, 0.88, 0.84), 0.1, 0.035),
    [],
  );
  const herbGeometry = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.2, 0, 0.06),
      new THREE.Vector3(0, 0.05, -0.08),
      new THREE.Vector3(0.22, 0, 0.02),
    );
    return new THREE.TubeGeometry(curve, 6, 0.032, 5, false);
  }, []);

  useEffect(() => {
    if (pulse > 0) bounce.current = 1;
  }, [pulse]);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.1);
    time.current += step;
    bounce.current = Math.max(0, bounce.current - step * 1.7);
    if (!group.current) return;

    const kick = Math.sin((1 - bounce.current) * Math.PI) * bounce.current;
    group.current.position.y = 0.36 + Math.sin(time.current * 1.15) * 0.065 + kick * 0.12;
    group.current.rotation.y = -0.34 + Math.sin(time.current * 0.42) * 0.055;
    group.current.rotation.z = -0.045 + Math.sin(time.current * 0.55) * 0.018;
    const scale = 1 + kick * 0.045;
    group.current.scale.setScalar(scale);
  });

  const pepperoni: Array<[number, number, number]> = [
    [-0.48, -0.28, -0.12],
    [0.46, -0.2, 0.16],
    [-0.34, 0.32, -0.2],
    [0.31, 0.38, 0.12],
    [0.02, 0.83, -0.08],
  ];

  return (
    <group ref={group} rotation={[0.02, -0.34, -0.045]}>
      <mesh geometry={baseGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={DOUGH} roughness={0.82} flatShading />
      </mesh>

      <mesh geometry={cheeseGeometry} position={[0, 0.155, 0.01]} castShadow>
        <meshStandardMaterial
          color={CHEESE}
          emissive={CHEESE_EDGE}
          emissiveIntensity={0.055}
          roughness={0.66}
          flatShading
        />
      </mesh>

      <mesh position={[0, 0.21, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.075, 1.54, 2, 8]} />
        <meshStandardMaterial color={SAUCE} roughness={0.72} flatShading />
      </mesh>

      <mesh position={[0, 0.3, -0.79]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.2, 1.62, 3, 8]} />
        <meshStandardMaterial
          color={CRUST}
          emissive={CRUST_LIGHT}
          emissiveIntensity={0.035}
          roughness={0.78}
          flatShading
        />
      </mesh>

      {pepperoni.map(([x, z, turn]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.255, z]} rotation={[0, turn, 0]} castShadow>
          <cylinderGeometry args={[0.185, 0.17, 0.065, 8]} />
          <meshStandardMaterial
            color={PEPPERONI}
            emissive={PEPPERONI_EDGE}
            emissiveIntensity={0.045}
            roughness={0.7}
            flatShading
          />
        </mesh>
      ))}

      <mesh geometry={herbGeometry} position={[-0.05, 0.27, 0.05]} castShadow>
        <meshStandardMaterial color={PEPPER} roughness={0.8} flatShading />
      </mesh>

      <mesh position={[-0.27, -0.07, 1.03]} castShadow>
        <capsuleGeometry args={[0.075, 0.24, 2, 6]} />
        <meshStandardMaterial color={CHEESE_EDGE} roughness={0.72} flatShading />
      </mesh>
      <mesh position={[0.38, -0.02, 0.58]} castShadow>
        <capsuleGeometry args={[0.085, 0.32, 2, 6]} />
        <meshStandardMaterial color={CHEESE_EDGE} roughness={0.72} flatShading />
      </mesh>
    </group>
  );
}

export default function PizzaScene({ pulse = 0 }: { pulse?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 3.55, 5.35], fov: 34 }}
      dpr={[1, 1.75]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="absolute inset-0 h-full w-full"
    >
      <CameraRig />
      <ambientLight intensity={0.52} color="#fff1df" />
      <hemisphereLight args={["#ffe5c7", "#1a1b1e", 1.35]} />
      <directionalLight
        position={[-2.5, 5, 4]}
        intensity={2.8}
        color="#fff0d5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
      />
      <pointLight position={[2.3, 1.4, 2.2]} intensity={2.2} color="#d93a32" />
      <pointLight position={[-2.2, 0.8, -1]} intensity={1.2} color="#f2b36d" />
      <SparkleDust />
      <PizzaMesh pulse={pulse} />
      <mesh position={[0.25, -0.66, 0.15]} rotation={[-Math.PI / 2, 0, -0.14]} receiveShadow>
        <planeGeometry args={[3.6, 2.4]} />
        <shadowMaterial color={SHADOW} transparent opacity={0.44} />
      </mesh>
    </Canvas>
  );
}
