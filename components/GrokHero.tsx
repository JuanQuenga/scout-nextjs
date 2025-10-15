"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

// Smoke shader material
const smokeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const smokeFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uMouseX;
  uniform float uMouseY;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Improved noise function for more organic smoke
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  void main() {
    vec2 st = vUv;
    
    // Create more dynamic horizontal flow
    st.x += uTime * 0.03;
    st.y += sin(uTime * 0.01 + st.x * 3.0) * 0.15;
    
    // Mouse interaction with more influence
    vec2 mouse = vec2(uMouseX, uMouseY);
    float mouseDist = distance(st, mouse);
    float mouseInfluence = 1.0 - smoothstep(0.0, 0.7, mouseDist);
    
    // Create smoke using fbm for more organic look
    float smoke = fbm(st * 3.0 + uTime * 0.01);
    
    // Create horizontal flow with fade
    smoke *= (1.0 - st.x * 0.6);
    
    // Add vertical variation
    smoke *= 0.7 + 0.3 * sin(st.y * 3.14159);
    
    // Add mouse influence
    smoke += mouseInfluence * 0.4;
    
    // Create color gradient from black to deep blue
    vec3 color = mix(
      vec3(0.0, 0.0, 0.0), 
      vec3(0.0, 0.05, 0.2), 
      smoke
    );
    
    // Add stronger glow on the right side (like x.ai)
    float glow = 1.0 - smoothstep(0.3, 1.0, st.x);
    vec3 glowColor = vec3(0.1, 0.2, 0.5);
    color += glowColor * glow * 0.8;
    
    // Add some blue tint to the smoke
    color += vec3(0.0, 0.01, 0.05) * smoke;
    
    float alpha = smoke * 0.6;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Background gradient shader
const backgroundVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const backgroundFragmentShader = `
  uniform float uTime;
  
  varying vec2 vUv;
  
  void main() {
    // Create gradient from black to deep blue (darker)
    vec3 color1 = vec3(0.0, 0.0, 0.0);
    vec3 color2 = vec3(0.0, 0.02, 0.08);
    
    // Diagonal gradient
    float gradient = (vUv.y * 0.8 + vUv.x * 0.2);
    vec3 color = mix(color1, color2, gradient);
    
    // Add subtle animated variation
    color += sin(uTime * 0.05 + vUv.x * 2.0) * 0.005;
    color += cos(uTime * 0.03 + vUv.y * 2.0) * 0.005;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Smoke plane component
function SmokePlane({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uMouseX: { value: 0.5 },
        uMouseY: { value: 0.5 },
      },
      vertexShader: smokeVertexShader,
      fragmentShader: smokeFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouseX.value = mousePosition.x;
      materialRef.current.uniforms.uMouseY.value = mousePosition.y;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -0.5]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial ref={materialRef} {...material} />
    </mesh>
  );
}

// Background component
function Background() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
    });
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={[30, 30, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={materialRef} {...material} />
    </mesh>
  );
}

// Scene component
function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <>
      <Background />
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />
      <pointLight position={[5, 0, 5]} intensity={0.5} color="#4488ff" />
      <SmokePlane mousePosition={mousePosition} />
    </>
  );
}

// Main component
export default function GrokHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX / window.innerWidth,
        y: 1 - event.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Scene mousePosition={mousePosition} />
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Canvas>

      {/* Overlay content - Grok text and description */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-none tracking-tight"
          style={{
            textShadow:
              "0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 90px rgba(255, 255, 255, 0.2)",
            letterSpacing: "-0.05em",
            fontWeight: 900,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Grok
        </h1>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl text-center px-6">
          Understand the universe with AI
        </p>
      </div>
    </div>
  );
}
