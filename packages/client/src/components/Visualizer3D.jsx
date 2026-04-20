import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000;
const STAR_COUNT = 3000;

export default function Visualizer3D({ audioData }) {
  const mountRef = useRef(null);
  const sceneRef = useRef({});

  // Setup scene once
  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Central sphere
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x4488ff,
      emissive: 0x112244,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Sphere glow (wireframe overlay)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(1.02, 32, 32), glowMat);
    scene.add(glowSphere);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x111122, 2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x4488ff, 3, 20);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    // Orbiting particles (bass = outer ring, treble = inner ring)
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const particleData = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isBass = i < PARTICLE_COUNT / 2;
      const radius = isBass ? 2.5 + Math.random() * 1.5 : 1.8 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particleData.push({ radius, theta, phi, speed: (Math.random() * 0.3 + 0.1) * (isBass ? 1 : -1.5), isBass });
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.03, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 2] = -Math.random() * 100 - 10;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Resize handler
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    sceneRef.current = { renderer, scene, camera, sphere, glowSphere, sphereMat, glowMat, particles, particleGeo, particleData, particleMat, stars, pointLight };

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // Animation loop reacts to audioData
  useEffect(() => {
    const ref = sceneRef.current;
    if (!ref.renderer) return;

    const { renderer, scene, camera, sphere, glowSphere, sphereMat, glowMat, particles, particleGeo, particleData, particleMat, stars, pointLight } = ref;
    let frameId;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.01;

      const { bass = 0, mid = 0, treble = 0, overall = 0 } = audioData;

      // Sphere breathing with bass
      const scale = 1 + bass * 0.6;
      sphere.scale.setScalar(scale);
      glowSphere.scale.setScalar(scale + 0.05);
      sphere.rotation.y += 0.003 + bass * 0.02;
      sphere.rotation.x += 0.001;

      // Color shift: cold blue → hot orange/red
      const r = Math.min(overall * 3, 1);
      const g = Math.max(0, mid * 1.5 - 0.3);
      const b = Math.max(0, 1 - overall * 2.5);
      sphereMat.color.setRGB(r * 0.5 + 0.1, g * 0.3 + 0.1, b * 0.8 + 0.1);
      sphereMat.emissive.setRGB(r * 0.3, g * 0.1, b * 0.4);
      glowMat.color.setRGB(r * 0.5 + 0.1, g * 0.3 + 0.1, b * 0.8 + 0.1);
      pointLight.color.setRGB(r * 0.5 + 0.2, g * 0.2 + 0.1, b * 0.8 + 0.2);
      pointLight.intensity = 3 + overall * 8;

      // Particle orbits
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleData.length; i++) {
        const p = particleData[i];
        p.theta += p.speed * 0.01 + (p.isBass ? bass * 0.05 : treble * 0.08);
        const radiusMod = p.radius + (p.isBass ? bass * 0.5 : treble * 0.3);
        positions[i * 3] = radiusMod * Math.sin(p.phi) * Math.cos(p.theta);
        positions[i * 3 + 1] = radiusMod * Math.sin(p.phi) * Math.sin(p.theta);
        positions[i * 3 + 2] = radiusMod * Math.cos(p.phi);
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleMat.color.setRGB(r * 0.4 + 0.3, g * 0.3 + 0.3, b * 0.6 + 0.5);

      // Stars accelerate with music
      const starPos = stars.geometry.attributes.position.array;
      const speed = 0.05 + overall * 0.8;
      for (let i = 0; i < STAR_COUNT; i++) {
        starPos[i * 3 + 2] += speed;
        if (starPos[i * 3 + 2] > 5) starPos[i * 3 + 2] = -100;
      }
      stars.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [audioData]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
}
