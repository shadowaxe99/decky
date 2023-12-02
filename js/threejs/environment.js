// environment.js
import * as THREE from './three.min.js';
import { GLTFLoader } from './GLTFLoader.js';
import { scene, camera, renderer, hologramMaterial, presentationData } from './sharedDependencies.js';

function setupEnvironment() {
  // Set up the scene
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.001);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 0);
  scene.add(directionalLight);

  // Load environment model
  const loader = new GLTFLoader();
  loader.load('assets/models/environments.glb', function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.material.envMap = scene.environment;
      }
    });
    scene.add(gltf.scene);
  }, undefined, function (error) {
    console.error(error);
  });

  // Create holographic effect
  const hologramEffect = new THREE.ShaderPass(hologramMaterial);
  renderer.addPass(hologramEffect);

  // Load presentation data and create 3D text or holograms
  presentationData.forEach(data => {
    createHolographicText(data.title, data.position);
  });
}

function createHolographicText(text, position) {
  const textGeometry = new THREE.TextGeometry(text, {
    font: 'helvetiker',
    size: 1,
    height: 0.1
  });

  const textMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
  });

  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.copy(position);
  scene.add(textMesh);
}

// Call setupEnvironment on initialization
setupEnvironment();

// Export the setup function in case it needs to be called again
export { setupEnvironment };