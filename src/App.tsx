import { animated, useSpring } from "@react-spring/three";
import { Html, Loader, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { easing } from "maath";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

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

const NUMBER_RADIUS = 5;

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
        position: new THREE.Vector3(0, 0, -NUMBER_RADIUS),
      },
      {
        linkTo: 2,
        position: new THREE.Vector3(NUMBER_RADIUS, 0, 0),
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
        position: new THREE.Vector3(0, 0, -NUMBER_RADIUS),
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
        position: new THREE.Vector3(0, 0, -NUMBER_RADIUS),
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
        position: new THREE.Vector3(0, 0, -NUMBER_RADIUS),
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
        position: new THREE.Vector3(0, 0, -NUMBER_RADIUS),
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
        position: new THREE.Vector3(0, 0, -NUMBER_RADIUS),
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
        position: new THREE.Vector3(0, 0, -NUMBER_RADIUS),
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
        position: new THREE.Vector3(0, 0, -NUMBER_RADIUS),
      },
    ],
  },
];

const vertextShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;

    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    
    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      
      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }

    void main() {
      vec2 uv = vUv;

      float noiseFactor = noise(gl_FragCoord.xy * 0.4);

      vec2 distortedPosition = vec2(uv.x + dispFactor * noiseFactor, uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * noiseFactor, uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <colorspace_fragment>

    }
`;

function Demo() {
  const [indexTexture, setIndexTexture] = useState<number>(0);
  const prevState = useRef<number>(0);
  const prevTexture = useRef<THREE.Texture[]>([
    new THREE.Texture(),
    new THREE.Texture(),
    new THREE.Texture(),
    new THREE.Texture(),
    new THREE.Texture(),
    new THREE.Texture(),
  ]);
  const [springs, api] = useSpring(() => ({ scale: 1 }));
  const elRefs = useRef<THREE.ShaderMaterial[]>([]);

  const texture = useLoader(THREE.TextureLoader, data[indexTexture].texture);
  // const texturePrevLoad = useLoader(THREE.TextureLoader, data.map((val)=>{...texture}));
  useLoader(
    THREE.TextureLoader,
    data.map((val) => val.texture).reduce((prev, val) => [...prev, ...val], [])
  );

  // console.log(
  //   data.map((val) => val.texture).reduce((prev, val) => [...prev, ...val], [])
  // );

  useEffect(() => {
    texture.map((val, index) => prevTexture.current[index].copy(val));
    prevState.current = indexTexture;
    api.start({
      scale: 1.5,
    });
  }, [indexTexture, api]);

  // console.log(prevTexture.current);

  useFrame((_state, delta) => {
    if (!elRefs.current) return;
    elRefs.current.map((val) => {
      easing.damp(val.uniforms.dispFactor, "value", 1, 0.5, delta);
    });
  });

  return (
    <animated.group scale={springs.scale}>
      <Suspense
        fallback={
          <mesh dispose={null}>
            <boxGeometry args={[10, 10, 10]} />

            {prevTexture.current.map((_value, index) => {
              // console.log(
              //   "run here",
              //   prevTexture.current[index].uuid,
              //   texture[index].uuid,
              //   prevState.current,
              //   indexTexture
              // );

              return (
                <meshBasicMaterial
                  key={index}
                  attach={`material-${index}`}
                  map={prevTexture.current[index]}
                  side={THREE.DoubleSide}
                />
              );
            })}
          </mesh>
        }
      >
        <mesh dispose={null}>
          <boxGeometry args={[10, 10, 10]} />
          {/* {data[indexTexture].texture.map((_value, index) => (
            <meshBasicMaterial
              key={texture[index].uuid}
              attach={`material-${index}`}
              map={texture[index]}
              side={THREE.DoubleSide}
            />
          ))} */}
          {texture.map((value, index) => {
            value.mapping = THREE.EquirectangularReflectionMapping;
            value.minFilter = THREE.LinearFilter;
            value.magFilter = THREE.LinearFilter;

            return (
              <shaderMaterial
                ref={(el) => (el ? (elRefs.current[index] = el) : el)}
                key={value.uuid}
                attach={`material-${index}`}
                // map={value}
                side={THREE.DoubleSide}
                vertexShader={vertextShader}
                fragmentShader={fragmentShader}
                uniforms={{
                  effectFactor: { value: 1.2 },
                  dispFactor: { value: 0 },
                  tex: { value: value },
                  tex2: { value: value },
                }}
              />
            );
          })}
        </mesh>
        {data[indexTexture].buttons.map((value, index) => (
          <mesh
            key={
              value.position.toArray.toString() +
              index +
              data[indexTexture].name
            }
            position={value.position}
          >
            <sphereGeometry args={[0.5, 32, 32]} />
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
      <Canvas
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        linear
        // frameloop="demand"
        camera={{ position: [0, 0, 0.1] }}
      >
        <OrbitControls
          // enableZoom={false}
          // enablePan={false}
          // enableDamping
          // dampingFactor={0.2}
          autoRotate={false}
          rotateSpeed={-0.5}
        />
        {/* <axesHelper args={[5]} /> */}

        {/* <Preload all /> */}
        <EffectComposer>
          {/* <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          /> */}
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={500}
          />
          {/* <Noise opacity={0.02} /> */}
          {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
        </EffectComposer>
        <Demo />
      </Canvas>
      <Loader />
    </>
  );
}

export default App;
