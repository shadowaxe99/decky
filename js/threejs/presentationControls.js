// presentationControls.js

import { camera, scene, renderer, interactiveObjects } from './three.min.js';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';
import { presentationData } from './presentation.json';
import { TweenMax, Power2 } from './TweenMax.min.js';

let currentSlideIndex = 0;
let slides = presentationData.slides;
let controls;

function initPresentationControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  loadSlide(currentSlideIndex);
}

function loadSlide(index) {
  if (index < 0 || index >= slides.length) return;

  const slide = slides[index];
  const loader = new GLTFLoader();

  loader.load(slide.model, function (gltf) {
    const slideScene = gltf.scene;
    slideScene.name = `slide_${index}`;
    scene.add(slideScene);
    setupSlideInteractions(slideScene);
    transitionToSlide(index);
  });
}

function setupSlideInteractions(slideScene) {
  slideScene.traverse(function (object) {
    if (object.isMesh) {
      interactiveObjects.push(object);
      object.cursor = 'pointer';
      object.on('click', function () {
        // Handle slide-specific interactions
      });
    }
  });
}

function transitionToSlide(index) {
  const previousSlide = scene.getObjectByName(`slide_${currentSlideIndex}`);
  const newSlide = scene.getObjectByName(`slide_${index}`);

  if (previousSlide) {
    TweenMax.to(previousSlide.position, 1, {
      x: -10,
      ease: Power2.easeInOut,
      onComplete: () => scene.remove(previousSlide)
    });
  }

  if (newSlide) {
    newSlide.position.set(10, 0, 0);
    TweenMax.to(newSlide.position, 1, {
      x: 0,
      ease: Power2.easeInOut
    });
  }

  currentSlideIndex = index;
}

function nextSlide() {
  loadSlide(currentSlideIndex + 1);
}

function previousSlide() {
  loadSlide(currentSlideIndex - 1);
}

// Event listeners for slide navigation
document.getElementById('nextSlide').addEventListener('click', nextSlide);
document.getElementById('previousSlide').addEventListener('click', previousSlide);

// Initialize the presentation controls
initPresentationControls();

// Export functions if they need to be used in other modules
export { nextSlide, previousSlide };