// visualization.js

import * as THREE from './three.min.js';
import { GLTFLoader } from './GLTFLoader.js';
import { presentationData } from './presentationControls.js';
import { hologramMaterial } from './specialEffects.js';

const visualization = (() => {
  let scene, renderer, camera;
  let presentationGroup;

  function initVisualization(container) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    presentationGroup = new THREE.Group();
    scene.add(presentationGroup);

    camera.position.z = 5;

    loadPresentation();
  }

  function loadPresentation() {
    const loader = new GLTFLoader();
    presentationData.slides.forEach((slide, index) => {
      loader.load(slide.model, (gltf) => {
        const slideMesh = gltf.scene.children[0];
        slideMesh.material = hologramMaterial; // Apply hologram effect
        slideMesh.position.x = index * 2; // Arrange slides next to each other
        presentationGroup.add(slideMesh);
      });
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    updateHolograms();
  }

  function updateHolograms() {
    presentationGroup.children.forEach((slideMesh) => {
      slideMesh.rotation.y += 0.005; // Rotate each slide for a dynamic effect
    });
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize, false);

  return {
    init: initVisualization,
    animate: animate
  };
})();

export default visualization;

// In the main application file, you would use visualization.init() to start the visualization and visualization.animate() to begin the animation loop.