import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Canvas = ({ sizes, manualRotation, lightOn, lightColor, intensity }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true; 
    scene.add(cube);

    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load("/sol.jpg");
    const wallpaperTexture = textureLoader.load("/papier.jpg");

    const floorMaterial = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.6,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true; 
    scene.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({ map: wallpaperTexture });
    const createWall = (width, height, pos, rot) => {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMaterial);
      wall.position.set(...pos);
      wall.rotation.set(...rot);
      wall.receiveShadow = true;
      scene.add(wall);
    };

    createWall(10, 5, [-5, 1.5, 0], [0, Math.PI / 2, 0]);
    createWall(10, 5, [5, 1.5, 0], [0, -Math.PI / 2, 0]);
    createWall(10, 5, [0, 1.5, -5], [0, 0, 0]);

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 1.5, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const dirLight = new THREE.DirectionalLight(lightColor, lightOn ? intensity : 0);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 20;
    scene.add(dirLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01 + manualRotation.x;
      cube.rotation.y += 0.01 + manualRotation.y;
      controls.update(); 
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [sizes.width, sizes.height, manualRotation.x, manualRotation.y, lightOn, lightColor, intensity]);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default Canvas;
