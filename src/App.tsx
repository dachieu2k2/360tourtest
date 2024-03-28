import { animated, useSpring } from "@react-spring/three";
import { Environment, Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface DataButton {
  position: THREE.Vector3;
  linkTo: number;
}

interface DataStore {
  link: number;
  name: string;
  texture: string[];
  buttons: DataButton[];
}

/**
px = left
nx = right
py = top
ny = bottom
pz = back
nz = front
 */

const data: DataStore[] = [
  {
    link: 0,
    name: "Cầu",
    texture: [
      "./hoian/bridge/r.jpeg",
      "./hoian/bridge/l.jpeg",
      "./hoian/bridge/u.jpeg",
      "./hoian/bridge/d.jpeg",
      "./hoian/bridge/f.jpeg",
      "./hoian/bridge/b.jpeg",
    ],
    buttons: [
      {
        linkTo: 1,
        position: new THREE.Vector3(0, 0, -10),
      },
      {
        linkTo: 2,
        position: new THREE.Vector3(10, 0, 0),
      },
    ],
  },
  {
    link: 1,
    name: "Buổi tối",
    texture: [
      "./hoian/night/r.jpeg",
      "./hoian/night/l.jpeg",
      "./hoian/night/u.jpeg",
      "./hoian/night/d.jpeg",
      "./hoian/night/f.jpeg",
      "./hoian/night/b.jpeg",
    ],
    buttons: [
      {
        linkTo: 0,
        position: new THREE.Vector3(0, 0, -10),
      },
    ],
  },
  {
    link: 2,
    name: "Đường cam nang",
    texture: [
      "./hoian/camnangst/r.jpeg",
      "./hoian/camnangst/l.jpeg",
      "./hoian/camnangst/u.jpeg",
      "./hoian/camnangst/d.jpeg",
      "./hoian/camnangst/f.jpeg",
      "./hoian/camnangst/b.jpeg",
    ],
    buttons: [
      {
        linkTo: 3,
        position: new THREE.Vector3(0, 0, -10),
      },
    ],
  },
  {
    link: 3,
    name: "Ferry",
    texture: [
      "./hoian/ferry/r.jpeg",
      "./hoian/ferry/l.jpeg",
      "./hoian/ferry/u.jpeg",
      "./hoian/ferry/d.jpeg",
      "./hoian/ferry/f.jpeg",
      "./hoian/ferry/b.jpeg",
    ],
    buttons: [
      {
        linkTo: 4,
        position: new THREE.Vector3(0, 0, -10),
      },
    ],
  },
  {
    link: 4,
    name: "japanesebridge",
    texture: [
      "./hoian/japanesebridge/r.jpeg",
      "./hoian/japanesebridge/l.jpeg",
      "./hoian/japanesebridge/u.jpeg",
      "./hoian/japanesebridge/d.jpeg",
      "./hoian/japanesebridge/f.jpeg",
      "./hoian/japanesebridge/b.jpeg",
    ],
    buttons: [
      {
        linkTo: 5,
        position: new THREE.Vector3(0, 0, -10),
      },
    ],
  },
  {
    link: 5,
    name: "tanky house",
    texture: [
      "./hoian/tankyhouse/r.jpeg",
      "./hoian/tankyhouse/l.jpeg",
      "./hoian/tankyhouse/u.jpeg",
      "./hoian/tankyhouse/d.jpeg",
      "./hoian/tankyhouse/f.jpeg",
      "./hoian/tankyhouse/b.jpeg",
    ],
    buttons: [
      {
        linkTo: 6,
        position: new THREE.Vector3(0, 0, -10),
      },
    ],
  },
  {
    link: 6,
    name: "thubonriver",
    texture: [
      "./hoian/thubonriver/r.jpeg",
      "./hoian/thubonriver/l.jpeg",
      "./hoian/thubonriver/u.jpeg",
      "./hoian/thubonriver/d.jpeg",
      "./hoian/thubonriver/f.jpeg",
      "./hoian/thubonriver/b.jpeg",
    ],
    buttons: [
      {
        linkTo: 7,
        position: new THREE.Vector3(0, 0, -10),
      },
    ],
  },
  {
    link: 7,
    name: "tranphustreet",
    texture: [
      "./hoian/tranphustreet/r.jpeg",
      "./hoian/tranphustreet/l.jpeg",
      "./hoian/tranphustreet/u.jpeg",
      "./hoian/tranphustreet/d.jpeg",
      "./hoian/tranphustreet/f.jpeg",
      "./hoian/tranphustreet/b.jpeg",
    ],
    buttons: [
      {
        linkTo: 1,
        position: new THREE.Vector3(0, 0, -10),
      },
    ],
  },
];

function Demo() {
  const [indexTexture, setIndexTexture] = useState<number>(0);
  const prevState = useRef<number>(0);
  const [springs, api] = useSpring(() => ({ scale: 1 }));

  useEffect(() => {
    prevState.current = indexTexture;
    api.start({
      scale: 1.5,
    });
  }, [indexTexture, api]);

  return (
    <animated.group scale={springs.scale}>
      <Suspense
        fallback={
          <Environment
            path="/"
            files={data[prevState.current].texture}
            background
            near={1}
            far={1000}
            resolution={256}
          />
        }
      >
        <Environment
          path="/"
          files={data[indexTexture].texture}
          background
          near={1}
          far={1000}
          resolution={256}
        />
        {data[indexTexture].buttons.map((value, index) => (
          <mesh
            key={
              value.position.toArray.toString() +
              index +
              data[indexTexture].name
            }
            position={value.position}
          >
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshBasicMaterial color="white" />
            <Html center>
              <div onClick={() => setIndexTexture(value.linkTo)}>
                <a href="#">{"Mở cửa"}</a>
              </div>
            </Html>
          </mesh>
        ))}
      </Suspense>
    </animated.group>
  );
}

function App() {
  return (
    <>
      <Canvas frameloop="demand" camera={{ position: [0, 0, 0.1] }}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.2}
          autoRotate={false}
          rotateSpeed={-0.5}
        />
        {/* <axesHelper args={[5]} /> */}

        {/* <Preload all /> */}
        <Demo />
      </Canvas>
    </>
  );
}

export default App;
