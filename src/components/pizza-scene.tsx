import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const DEFAULT_PITCH = 0.02;
const DEFAULT_YAW = -0.34;

type PizzaSceneProps = {
  pulse?: number;
  onDraggingChange?: (dragging: boolean) => void;
};

type DragState = {
  dragging: boolean;
  pointerId: number | null;
  lastX: number;
  lastY: number;
  lastTime: number;
  pitch: number;
  yaw: number;
  pitchVelocity: number;
  yawVelocity: number;
  hoverX: number;
  hoverY: number;
};

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

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

function SparkleDust({ reducedMotion }: { reducedMotion: boolean }) {
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

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!points.current || reducedMotion) return;
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

function PizzaMesh({
  pulse,
  reducedMotion,
  onDraggingChange,
}: {
  pulse: number;
  reducedMotion: boolean;
  onDraggingChange: (dragging: boolean) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);
  const bounce = useRef(0);
  const press = useRef(0);
  const drag = useRef<DragState>({
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    pitch: DEFAULT_PITCH,
    yaw: DEFAULT_YAW,
    pitchVelocity: 0,
    yawVelocity: 0,
    hoverX: 0,
    hoverY: 0,
  });

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

  useEffect(
    () => () => {
      baseGeometry.dispose();
      cheeseGeometry.dispose();
      herbGeometry.dispose();
    },
    [baseGeometry, cheeseGeometry, herbGeometry],
  );

  useEffect(() => {
    if (pulse > 0) bounce.current = 1;
  }, [pulse]);

  useEffect(() => () => onDraggingChange(false), [onDraggingChange]);

  const finishDrag = (event: ThreeEvent<PointerEvent>) => {
    const state = drag.current;
    if (!state.dragging || state.pointerId !== event.pointerId) return;
    state.dragging = false;
    state.pointerId = null;
    if (reducedMotion) {
      state.pitchVelocity = 0;
      state.yawVelocity = 0;
    }
    onDraggingChange(false);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const state = drag.current;
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastTime = event.timeStamp;
    state.pitchVelocity = 0;
    state.yawVelocity = 0;
    press.current = 1;
    const captureTarget = event.target as
      | (EventTarget & {
          setPointerCapture?: (pointerId: number) => void;
        })
      | null;
    captureTarget?.setPointerCapture?.(event.pointerId);
    onDraggingChange(true);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const state = drag.current;
    state.hoverX = event.pointer.x;
    state.hoverY = event.pointer.y;
    if (!state.dragging || state.pointerId !== event.pointerId) return;

    event.stopPropagation();
    const elapsed = Math.max((event.timeStamp - state.lastTime) / 1000, 1 / 240);
    const yawDelta = (event.clientX - state.lastX) * 0.009;
    const pitchDelta = (event.clientY - state.lastY) * 0.006;
    state.yaw += yawDelta;
    state.pitch = THREE.MathUtils.clamp(state.pitch + pitchDelta, -0.48, 0.5);
    state.yawVelocity = THREE.MathUtils.clamp(yawDelta / elapsed, -5.5, 5.5);
    state.pitchVelocity = THREE.MathUtils.clamp(pitchDelta / elapsed, -3.2, 3.2);
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastTime = event.timeStamp;
  };

  const handlePointerOut = () => {
    if (drag.current.dragging) return;
    drag.current.hoverX = 0;
    drag.current.hoverY = 0;
  };

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.1);
    time.current += step;
    bounce.current = Math.max(0, bounce.current - step * 1.7);
    press.current = THREE.MathUtils.damp(
      press.current,
      drag.current.dragging ? 1 : 0,
      drag.current.dragging ? 18 : 10,
      step,
    );
    if (!group.current) return;

    const state = drag.current;
    if (!state.dragging && !reducedMotion) {
      state.yaw += state.yawVelocity * step;
      state.pitch = THREE.MathUtils.clamp(state.pitch + state.pitchVelocity * step, -0.48, 0.5);
      const inertia = Math.exp(-5.5 * step);
      state.yawVelocity *= inertia;
      state.pitchVelocity *= inertia;
    }

    const kick = Math.sin((1 - bounce.current) * Math.PI) * bounce.current;
    const idleLift = reducedMotion ? 0 : Math.sin(time.current * 1.15) * 0.065;
    const idleYaw = reducedMotion ? 0 : Math.sin(time.current * 0.42) * 0.035;
    const idleRoll = reducedMotion ? 0 : Math.sin(time.current * 0.55) * 0.018;
    const hoverPitch = !state.dragging && !reducedMotion ? state.hoverY * 0.045 : 0;
    const hoverYaw = !state.dragging && !reducedMotion ? state.hoverX * 0.055 : 0;
    const smoothing = state.dragging ? 24 : 11;

    group.current.position.y = 0.36 + idleLift + kick * 0.12 + press.current * 0.035;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      state.pitch - hoverPitch,
      smoothing,
      step,
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      state.yaw + idleYaw + hoverYaw,
      smoothing,
      step,
    );
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      -0.045 + idleRoll,
      11,
      step,
    );
    const scale = 1 + kick * 0.045 + press.current * 0.025;
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
    <group
      ref={group}
      rotation={[DEFAULT_PITCH, DEFAULT_YAW, -0.045]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onLostPointerCapture={finishDrag}
      onPointerOut={handlePointerOut}
    >
      <mesh position={[0, 0.08, -0.1]}>
        <boxGeometry args={[2.4, 0.72, 3.15]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

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

export default function PizzaScene({ pulse = 0, onDraggingChange }: PizzaSceneProps) {
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useReducedMotion();

  const updateDragging = useCallback(
    (nextDragging: boolean) => {
      setDragging(nextDragging);
      onDraggingChange?.(nextDragging);
    },
    [onDraggingChange],
  );

  return (
    <Canvas
      aria-label="Interactive 3D pizza slice. Drag or swipe to rotate it."
      camera={{ position: [0, 3.55, 5.35], fov: 34 }}
      dpr={[1, 1.75]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className={`pizza-canvas absolute inset-0 h-full w-full${dragging ? " is-dragging" : ""}`}
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
      <SparkleDust reducedMotion={reducedMotion} />
      <PizzaMesh pulse={pulse} reducedMotion={reducedMotion} onDraggingChange={updateDragging} />
      <mesh position={[0.25, -0.66, 0.15]} rotation={[-Math.PI / 2, 0, -0.14]} receiveShadow>
        <planeGeometry args={[3.6, 2.4]} />
        <shadowMaterial color={SHADOW} transparent opacity={0.44} />
      </mesh>
    </Canvas>
  );
}
