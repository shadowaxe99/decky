// interactive.js - Handles interactive elements and user engagement in the 3D presentation

import { scene, camera, renderer, mixer, clock, controls, composer, hologramMaterial, interactiveObjects, presentationData } from './threejsDependencies.js';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';
import { EffectComposer } from './EffectComposer.js';
import { RenderPass } from './RenderPass.js';
import { ShaderPass } from './ShaderPass.js';
import { CopyShader } from './CopyShader.js';
import { FXAAShader } from './FXAAShader.js';
import { TweenMax } from './TweenMax.min.js';

// Event listeners for user interaction
function addEventListeners() {
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('click', onDocumentClick, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

// Handle click events
function onDocumentClick(event) {
  event.preventDefault();
  checkIntersect(event.clientX, event.clientY);
}

// Handle touch events
function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    checkIntersect(event.touches[0].pageX, event.touches[0].pageY);
  }
}

// Check if user interaction intersects with any interactive object
function checkIntersect(x, y) {
  let mouse = new THREE.Vector2();
  let raycaster = new THREE.Raycaster();
  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(interactiveObjects);
  if (intersects.length > 0) {
    handleInteraction(intersects[0]);
  }
}

// Handle the interaction with objects
function handleInteraction(intersect) {
  const object = intersect.object;
  // Custom interaction logic based on the object
  if (object.userData && object.userData.onClick) {
    object.userData.onClick();
  }
}

// Initialize interactive elements
function initInteractiveElements() {
  // Load presentation data and create interactive elements
  loadPresentationData(presentationDataUrl).then(data => {
    presentationData = data;
    createInteractiveElements(presentationData);
  });
}

// Load presentation data from a JSON file
function loadPresentationData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error loading presentation data:', error));
}

// Create interactive elements based on presentation data
function createInteractiveElements(data) {
  // Example: Create holographic slides
  data.slides.forEach(slide => {
    let texture = new THREE.TextureLoader().load(slide.image);
    let material = hologramMaterial.clone();
    material.map = texture;
    let geometry = new THREE.PlaneGeometry(1, 1);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(slide.position);
    mesh.userData.onClick = () => {
      // Define what happens when a slide is clicked
      TweenMax.to(camera.position, 1, { x: slide.cameraPosition.x, y: slide.cameraPosition.y, z: slide.cameraPosition.z });
    };
    scene.add(mesh);
    interactiveObjects.push(mesh);
  });
}

// Start the interactive experience
function startInteractiveExperience() {
  initInteractiveElements();
  addEventListeners();
  animate();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  let delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  controls.update();
  composer.render();
}

// Start the experience
startInteractiveExperience();