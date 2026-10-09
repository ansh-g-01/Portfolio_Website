import { useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// A stylized developer at a desk, built only from Three.js primitives.
// The rig faces +z; everything is positioned in that local space.

const COLORS = {
  skin: "#e3b08d",
  hair: "#2b1d14",
  hoodie: "#14b8a6",
  hoodieDark: "#0f766e",
  pants: "#1f2937",
  shoe: "#e5e7eb",
  desk: "#8a5a3b",
  metal: "#2a2f36",
  chair: "#26303b",
  laptop: "#c9ced6",
  glow: "#2dd4bf",
  mug: "#f5b14c",
};

type Vec3 = [number, number, number];
type Pointer = MutableRefObject<{ x: number; y: number }>;

const UP = new THREE.Vector3(0, 1, 0);
const clamp = THREE.MathUtils.clamp;

// A capsule stretched from one joint to the next; children sit at the far joint
function Limb({
  from,
  to,
  radius,
  color,
  typingPhase,
  animate,
  children,
}: {
  from: Vec3;
  to: Vec3;
  radius: number;
  color: string;
  typingPhase?: number;
  animate?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null!);
  const { quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3(...to).sub(new THREE.Vector3(...from));
    return {
      length: dir.length(),
      quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()),
    };
  }, [from, to]);

  // Forearms tap up and down from the elbow to "type"
  useFrame(({ clock }) => {
    if (typingPhase === undefined || !animate) return;
    ref.current.quaternion.copy(quaternion);
    ref.current.rotateX(Math.max(0, Math.sin(clock.elapsedTime * 13 + typingPhase)) * 0.08);
  });

  return (
    <group ref={ref} position={from} quaternion={quaternion}>
      <mesh position={[0, length / 2, 0]}>
        <capsuleGeometry args={[radius, length, 6, 14]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <group position={[0, length, 0]}>{children}</group>
    </group>
  );
}

function Box({ size, position, color, rotation }: { size: Vec3; position: Vec3; color: string; rotation?: Vec3 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

function Desk() {
  const legs: Vec3[] = [
    [-0.8, 0.76, 0.88],
    [1.3, 0.76, 0.88],
    [-0.8, 0.76, 1.82],
    [1.3, 0.76, 1.82],
  ];
  return (
    <group>
      <Box size={[2.3, 0.08, 1.1]} position={[0.25, 1.55, 1.35]} color={COLORS.desk} />
      {legs.map((p) => (
        <Box key={p.join()} size={[0.07, 1.5, 0.07]} position={p} color={COLORS.metal} />
      ))}
      {/* Mug */}
      <group position={[1.05, 1.59, 1.55]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.09, 0.08, 0.2, 20]} />
          <meshStandardMaterial color={COLORS.mug} roughness={0.5} />
        </mesh>
        <mesh position={[0.1, 0.1, 0]}>
          <torusGeometry args={[0.055, 0.015, 8, 16]} />
          <meshStandardMaterial color={COLORS.mug} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function Laptop({ animate }: { animate: boolean }) {
  const light = useRef<THREE.PointLight>(null!);
  // The screen glow flickers slightly, like changing code on screen
  useFrame(({ clock }) => {
    if (animate) light.current.intensity = 2.2 + Math.sin(clock.elapsedTime * 3) * 0.3;
  });
  return (
    <group position={[0, 1.59, 1.15]}>
      <Box size={[0.85, 0.035, 0.58]} position={[0, 0.0175, 0]} color={COLORS.laptop} />
      <Box size={[0.72, 0.005, 0.26]} position={[0, 0.037, -0.03]} color={COLORS.metal} />
      {/* Lid hinged at the back edge, tilted away from the character */}
      <group position={[0, 0.035, 0.29]} rotation={[-0.25, 0, 0]}>
        <Box size={[0.85, 0.56, 0.025]} position={[0, 0.28, 0]} color={COLORS.laptop} />
        <mesh position={[0, 0.28, -0.014]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.78, 0.5]} />
          <meshBasicMaterial color="#0f3d3a" />
        </mesh>
        <mesh position={[0, 0.3, 0.014]}>
          <circleGeometry args={[0.05, 24]} />
          <meshBasicMaterial color={COLORS.glow} />
        </mesh>
        <pointLight ref={light} position={[0, 0.3, -0.35]} color={COLORS.glow} intensity={2.2} distance={3} />
      </group>
    </group>
  );
}

function Chair() {
  return (
    <group position={[0, 0, -0.05]}>
      <Box size={[1.0, 0.12, 0.95]} position={[0, 1.0, 0]} color={COLORS.chair} />
      <Box size={[1.0, 1.0, 0.1]} position={[0, 1.62, -0.5]} rotation={[-0.1, 0, 0]} color={COLORS.chair} />
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.9, 12]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.06, 24]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
    </group>
  );
}

// Head profile from chin (bottom) to crown, spun around the y axis.
// It narrows toward the jaw so the face reads as a face, not a ball.
const HEAD_PROFILE = new THREE.SplineCurve(
  [
    [0, 0],
    [0.13, 0.01],
    [0.22, 0.07],
    [0.28, 0.16],
    [0.315, 0.27],
    [0.322, 0.36],
    [0.305, 0.46],
    [0.26, 0.54],
    [0.17, 0.61],
    [0, 0.64],
  ].map(([x, y]) => new THREE.Vector2(x, y))
).getPoints(40);

const HAIR_CENTER = new THREE.Vector3(0, 0.335, -0.01);

function Head() {
  const lens = useMemo(() => new RoundedBoxGeometry(0.18, 0.11, 0.025, 4, 0.03), []);

  return (
    <group>
      <mesh>
        <latheGeometry args={[HEAD_PROFILE, 40]} />
        <meshStandardMaterial color={COLORS.skin} roughness={0.7} />
      </mesh>
      {/* Chin */}
      <mesh position={[0, 0.075, 0.115]} scale={[1.25, 0.7, 0.9]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={COLORS.skin} roughness={0.7} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.315 * side, 0.3, 0]} scale={[0.6, 1, 0.9]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.24, 0.315]} scale={[0.9, 1.2, 1]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#d49a78" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.15, 0.27]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.055, 0.011, 8, 16, Math.PI]} />
        <meshBasicMaterial color="#7a3e2e" />
      </mesh>
      {[-1, 1].map((side) => (
        <Box
          key={side}
          size={[0.1, 0.022, 0.02]}
          position={[0.11 * side, 0.425, 0.29]}
          rotation={[0, 0, -0.1 * side]}
          color={COLORS.hair}
        />
      ))}

      {/* Shades: two lenses, a bridge, hinges angled along the head, and arms to the ears */}
      <group position={[0, 0.33, 0]}>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh geometry={lens} position={[0.105 * side, 0, 0.315]} rotation={[0, 0.15 * side, 0]}>
              <meshStandardMaterial color="#0c1416" metalness={0.5} roughness={0.12} />
            </mesh>
            <Box size={[0.174, 0.018, 0.015]} position={[0.257 * side, 0.015, 0.255]} rotation={[0, 0.68 * side, 0]} color="#111111" />
            <Box size={[0.012, 0.018, 0.2]} position={[0.325 * side, 0.015, 0.1]} color="#111111" />
          </group>
        ))}
        <Box size={[0.04, 0.018, 0.015]} position={[0, 0.015, 0.322]} color="#111111" />
      </group>

      {/* Headphones: a band arching over the hair to a cup on each ear */}
      <mesh position={[0, 0.33, -0.02]}>
        <torusGeometry args={[0.4, 0.025, 12, 48, Math.PI]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.35} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[0.39 * side, 0.3, -0.02]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.105, 0.105, 0.07, 28]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.35} />
          </mesh>
          <mesh position={[-0.04 * side, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.08, 0.028, 12, 28]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
          </mesh>
          <mesh position={[0.037 * side, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.065, 0.009, 8, 28]} />
            <meshStandardMaterial color={COLORS.mug} metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Hair: a short classic cut. A slightly raised crown for volume, and a
          shell over the sides and back that stays open at the face */}
      <mesh position={HAIR_CENTER} rotation={[-0.06, 0, 0.14]} scale={[1.03, 1.1, 1.06]}>
        <sphereGeometry args={[0.34, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.37]} />
        <meshStandardMaterial color={COLORS.hair} roughness={0.75} />
      </mesh>
      <mesh position={HAIR_CENTER}>
        <sphereGeometry args={[0.338, 64, 32, Math.PI / 2 + 0.85, Math.PI * 2 - 1.7, 0, Math.PI * 0.56]} />
        <meshStandardMaterial color={COLORS.hair} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.3, -0.07]} scale={[1, 0.95, 0.92]}>
        <sphereGeometry args={[0.31, 24, 18]} />
        <meshStandardMaterial color={COLORS.hair} roughness={0.75} />
      </mesh>
    </group>
  );
}

function Person({ animate, pointer, rigRotation }: { animate: boolean; pointer: Pointer; rigRotation: MutableRefObject<number> }) {
  const torso = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (animate) torso.current.position.y = 1.25 + Math.sin(t * 1.6) * 0.012;

    // Turn the head toward the viewer, then nudge it toward the mouse
    const lookY = clamp(-rigRotation.current * 0.8 + pointer.current.x * 0.45, -1.1, 1.1);
    const lookX = clamp(pointer.current.y * 0.3 + 0.05, -0.3, 0.4);
    head.current.rotation.y += (lookY - head.current.rotation.y) * 0.08;
    head.current.rotation.x += (lookX - head.current.rotation.x) * 0.08;
  });

  return (
    <group>
      {/* Hips and legs */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.28, 0.2, 6, 14]} />
        <meshStandardMaterial color={COLORS.pants} roughness={0.9} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Limb from={[0.17 * side, 1.18, 0.05]} to={[0.19 * side, 1.22, 0.68]} radius={0.14} color={COLORS.pants} />
          <Limb from={[0.19 * side, 1.22, 0.68]} to={[0.19 * side, 0.2, 0.74]} radius={0.12} color={COLORS.pants} />
        </group>
      ))}
      {[-1, 1].map((side) => (
        <Box key={side} size={[0.22, 0.14, 0.42]} position={[0.19 * side, 0.08, 0.84]} color={COLORS.shoe} />
      ))}

      {/* Upper body leans slightly toward the laptop */}
      <group ref={torso} position={[0, 1.25, 0]} rotation={[0.12, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.33, 0.55, 8, 18]} />
          <meshStandardMaterial color={COLORS.hoodie} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.0, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.07, 10, 24]} />
          <meshStandardMaterial color={COLORS.hoodieDark} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.1, 0.11, 0.22, 14]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.7} />
        </mesh>

        {/* Arms reach forward to the keyboard */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <Limb from={[0.42 * side, 0.85, 0]} to={[0.47 * side, 0.38, 0.35]} radius={0.11} color={COLORS.hoodie} />
            <Limb
              from={[0.47 * side, 0.38, 0.35]}
              to={[0.22 * side, 0.52, 0.89]}
              radius={0.095}
              color={COLORS.hoodie}
              typingPhase={side > 0 ? 0 : Math.PI}
              animate={animate}
            >
              <mesh>
                <sphereGeometry args={[0.085, 14, 14]} />
                <meshStandardMaterial color={COLORS.skin} roughness={0.7} />
              </mesh>
            </Limb>
          </group>
        ))}

        {/* Head pivots at the top of the neck */}
        <group ref={head} position={[0, 1.2, 0]}>
          <Head />
        </group>
      </group>
    </group>
  );
}

function Scene({ animate, pointer, progress }: { animate: boolean; pointer: Pointer; progress: MutableRefObject<number> }) {
  const rig = useRef<THREE.Group>(null!);
  const rigRotation = useRef(-0.9);

  // Scrolling turns the character aside and drifts it right
  useFrame(() => {
    const p = progress.current;
    const targetRotation = THREE.MathUtils.lerp(-0.9, -1.35, p);
    rig.current.rotation.y += (targetRotation - rig.current.rotation.y) * 0.08;
    rig.current.position.x += (THREE.MathUtils.lerp(0, 0.4, p) - rig.current.position.x) * 0.08;
    rigRotation.current = rig.current.rotation.y;
  });

  return (
    <>
      <hemisphereLight args={["#dfe9f3", "#0b0f14", 1.3]} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <directionalLight position={[-4, 3, -4]} intensity={1.4} color={COLORS.glow} />
      <group ref={rig} rotation={[0, -0.9, 0]}>
        <mesh position={[0.2, 0.002, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.5, 48]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.35} />
        </mesh>
        <Chair />
        <Desk />
        <Laptop animate={animate} />
        <Person animate={animate} pointer={pointer} rigRotation={rigRotation} />
      </group>
    </>
  );
}

export default function CharacterScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(true);
  const animate = useMemo(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");

    // On desktop the stage is fixed: it follows the hero into About, then fades
    // out before the Featured section. On mobile it simply sits in the hero.
    const onScroll = () => {
      const el = wrapper.current;
      const hero = document.getElementById("top");
      const featured = document.getElementById("featured");
      if (!el || !hero || !featured) return;
      const y = window.scrollY;
      if (!desktop.matches) {
        progress.current = 0;
        el.style.opacity = "";
        setActive(y < hero.offsetHeight);
        return;
      }
      progress.current = clamp(y / hero.offsetHeight, 0, 1);
      const fadeStart = featured.offsetTop - window.innerHeight * 0.95;
      const fadeEnd = featured.offsetTop - window.innerHeight * 0.45;
      const opacity = 1 - clamp((y - fadeStart) / (fadeEnd - fadeStart), 0, 1);
      el.style.opacity = String(opacity);
      setActive(opacity > 0);
    };
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={wrapper} className="character-stage" aria-hidden="true">
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 2.6, 9.2], fov: 34 }}
        onCreated={({ camera }) => camera.lookAt(0.3, 1.45, 0.5)}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene animate={animate} pointer={pointer} progress={progress} />
      </Canvas>
    </div>
  );
}
