import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// An illustration of an AI gateway: one core routes requests (teal pulses)
// out to many model-provider nodes, and responses (amber pulses) come back.

const NODE_COUNT = 64;
const PULSE_COUNT = 36;
const RADIUS = 3.1;
const REQUEST_COLOR = new THREE.Color("#2dd4bf");
const RESPONSE_COLOR = new THREE.Color("#f5b14c");

// Spread points evenly over a sphere (Fibonacci lattice)
function spherePoints(count: number, radius: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius);
  });
}

type Pulse = { node: number; progress: number; speed: number; isResponse: boolean };

const randomPulse = (): Pulse => ({
  node: Math.floor(Math.random() * NODE_COUNT),
  progress: Math.random(),
  speed: 0.35 + Math.random() * 0.5,
  isResponse: Math.random() < 0.5,
});

function Gateway({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const core = useRef<THREE.Mesh>(null!);
  const nodeMesh = useRef<THREE.InstancedMesh>(null!);
  const pulseMesh = useRef<THREE.InstancedMesh>(null!);
  const pointer = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => spherePoints(NODE_COUNT, RADIUS), []);
  const pulses = useMemo(() => Array.from({ length: PULSE_COUNT }, randomPulse), []);
  const temp = useMemo(() => new THREE.Object3D(), []);

  // One line segment from the core to every node
  const lines = useMemo(() => {
    const positions = new Float32Array(NODE_COUNT * 6);
    nodes.forEach((p, i) => positions.set([0, 0, 0, p.x, p.y, p.z], i * 6));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [nodes]);

  // Place the provider nodes once
  useLayoutEffect(() => {
    nodes.forEach((p, i) => {
      temp.position.copy(p);
      temp.scale.setScalar(0.6 + ((i * 37) % 10) / 20);
      temp.updateMatrix();
      nodeMesh.current.setMatrixAt(i, temp.matrix);
    });
    nodeMesh.current.instanceMatrix.needsUpdate = true;
    pulses.forEach((pulse, i) =>
      pulseMesh.current.setColorAt(i, pulse.isResponse ? RESPONSE_COLOR : REQUEST_COLOR)
    );
  }, [nodes, pulses, temp]);

  // The canvas sits behind other content, so track the mouse on the window
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (animate) group.current.rotation.y += dt * 0.08;
    // Ease the tilt toward the mouse
    group.current.rotation.x += (pointer.current.y * 0.25 - group.current.rotation.x) * 0.05;
    group.current.rotation.z += (-pointer.current.x * 0.12 - group.current.rotation.z) * 0.05;
    core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.04);

    pulses.forEach((pulse, i) => {
      if (animate) pulse.progress += pulse.speed * dt;
      if (pulse.progress >= 1) {
        // A request that reached its provider comes back as a response;
        // a finished response frees the pulse for a new request elsewhere
        if (pulse.isResponse) pulse.node = Math.floor(Math.random() * NODE_COUNT);
        pulse.isResponse = !pulse.isResponse;
        pulse.progress = 0;
        pulseMesh.current.setColorAt(i, pulse.isResponse ? RESPONSE_COLOR : REQUEST_COLOR);
        pulseMesh.current.instanceColor!.needsUpdate = true;
      }
      const t = pulse.isResponse ? 1 - pulse.progress : pulse.progress;
      temp.position.copy(nodes[pulse.node]).multiplyScalar(t);
      temp.scale.setScalar(1);
      temp.updateMatrix();
      pulseMesh.current.setMatrixAt(i, temp.matrix);
    });
    pulseMesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#2dd4bf" wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshBasicMaterial color="#e6fffb" />
      </mesh>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#5eead4" transparent opacity={0.12} />
      </lineSegments>
      <instancedMesh ref={nodeMesh} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#94a3b8" />
      </instancedMesh>
      <instancedMesh ref={pulseMesh} args={[undefined, undefined, PULSE_COUNT]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
    </group>
  );
}

export default function GatewayScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Only render frames while the scene is on screen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(wrapper.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} style={{ height: "100%" }}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        aria-hidden="true"
      >
        <Gateway animate={!reducedMotion} />
      </Canvas>
    </div>
  );
}
