import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

const texturePath1 = "/terre.jpg";
const starsTexture = "/stars.jpg";
const moonTexture = "/moon.jpg";
const soundPath = "/son.mp3";

const Canvas = ({ sizes, manualRotation, lightOn, lightColor, intensity }) => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const [showCube, setShowCube] = useState(true);
  const [sceneState, setSceneState] = useState({
    cube: null,
    moon: null,
    starSphere: null
  });

  useEffect(() => {
    audioRef.current = new Audio(soundPath);
    audioRef.current.load();
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 1.5, 5);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.shadowMap.enabled = true;

    const textureLoader = new THREE.TextureLoader();

    const colorMap = textureLoader.load(texturePath1);
    const bumpMap = textureLoader.load(texturePath1);
    const displacementMap = textureLoader.load(texturePath1);
    const cubeMaterial = new THREE.MeshStandardMaterial({
      map: colorMap,
      bumpMap: bumpMap,
      bumpScale: 0.1,
      displacementMap: displacementMap,
      displacementScale: 0.05
    });
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 128, 128, 128);
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    scene.add(cube);

    const moonMap = textureLoader.load(moonTexture);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      new THREE.MeshStandardMaterial({ map: moonMap })
    );
    moon.position.set(2, 1, -1);
    moon.visible = false;
    scene.add(moon);

    const starsMap = textureLoader.load(starsTexture);
    const starSphere = new THREE.Mesh(
      new THREE.SphereGeometry(50, 64, 64),
      new THREE.MeshBasicMaterial({ map: starsMap, side: THREE.BackSide })
    );
    starSphere.visible = false;
    scene.add(starSphere);

    const dirLight = new THREE.DirectionalLight(lightColor, lightOn ? intensity : 0);
    dirLight.position.set(5, 3, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(
      new UnrealBloomPass(new THREE.Vector2(sizes.width, sizes.height), 0.5, 0.4, 0.85)
    );

    setSceneState({ cube, moon, starSphere });

    const animate = () => {
      requestAnimationFrame(animate);
      if (cube.visible) cube.rotation.y += 0.002 + manualRotation.y;
      if (moon.visible) moon.rotation.y += 0.001;
      controls.update();
      composer.render();
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sizes.width, sizes.height, manualRotation.y, lightOn, lightColor, intensity]);

  const handleInteraction = () => {
    audioRef.current?.play().catch((err) => console.error("Audio error:", err));

    if (Math.random() > 0.5) {
      setShowCube(true);
    } else {
      setShowCube(false);
    }
  };

  useEffect(() => {
    const { cube, moon, starSphere } = sceneState;
    if (cube && moon && starSphere) {
      cube.visible = showCube;
      moon.visible = !showCube;
      starSphere.visible = !showCube;
    }
  }, [showCube, sceneState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleInteraction);
    canvas.addEventListener("touchstart", handleInteraction);

    return () => {
      canvas.removeEventListener("click", handleInteraction);
      canvas.removeEventListener("touchstart", handleInteraction);
    };
  }, [sceneState]);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default Canvas;
