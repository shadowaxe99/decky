// specialEffects.js
import * as THREE from './three.min.js';
import { scene, camera, renderer, hologramMaterial, interactiveObjects } from './sharedDependencies.js';
import { GLTFLoader } from './GLTFLoader.js';
import { TweenMax, Power2 } from './TweenMax.min.js';

// Function to create holographic effects
function createHolographicEffect() {
  const loader = new GLTFLoader();
  loader.load('assets/models/hologram.glb', function (gltf) {
    const hologram = gltf.scene;
    hologram.traverse(function (node) {
      if (node.isMesh) {
        node.material = hologramMaterial;
      }
    });
    scene.add(hologram);
    interactiveObjects.push(hologram);
  });
}

// Function to animate holograms
function animateHolograms() {
  interactiveObjects.forEach(obj => {
    TweenMax.to(obj.rotation, 5, {
      y: Math.PI * 2,
      repeat: -1,
      ease: Power2.easeInOut
    });
  });
}

// Function to create special lighting effects
function createSpecialLighting() {
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
}

// Function to create particle effects
function createParticleEffects() {
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCnt = 5000;
  const posArray = new Float32Array(particlesCnt * 3);

  for (let i = 0; i < particlesCnt * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 'white'
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
}

// Initialize all special effects
function initSpecialEffects() {
  createHolographicEffect();
  animateHolograms();
  createSpecialLighting();
  createParticleEffects();
}

// Export the initialization function
export { initSpecialEffects };