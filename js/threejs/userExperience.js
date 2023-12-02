// js/threejs/userExperience.js

// Import shared dependencies and styles
import { scene, camera, renderer, mixer, clock, controls, composer, hologramMaterial, interactiveObjects } from './threejs/three.min.js';
import { presentationData } from './threejs/presentationControls.js';
import { AvatarSchema, LearningModuleSchema, CompetitorSchema, TechnologicalAdvancementSchema } from './threejs/avatars.js';
import { init, animate, onWindowResize } from './threejs/environment.js';

// Function to enhance user experience with interactive moments
function enhanceUserExperience() {
  // Create interactive moments for users to engage with the presentation
  interactiveObjects.forEach(object => {
    object.on('click', () => {
      // Trigger an interactive experience, such as a hologram or special effect
      showHologram(object);
    });
  });

  // Add event listeners for user interaction
  window.addEventListener('resize', onWindowResize, false);
  document.getElementById('playButton').addEventListener('click', startPresentation);
  document.getElementById('muteButton').addEventListener('click', toggleSound);
  document.getElementById('fullscreenButton').addEventListener('click', toggleFullscreen);
}

// Function to start the presentation and animations
function startPresentation() {
  // Start the presentation from the beginning or resume from current state
  mixer.clipAction(presentationData.animations[0]).play();
  animate();
}

// Function to show holograms and special effects
function showHologram(object) {
  // Apply hologram material and effects to the selected object
  object.material = hologramMaterial;
  // Add additional effects as needed
}

// Function to toggle sound on and off
function toggleSound() {
  // Mute or unmute the background music and interaction sounds
  const backgroundSound = document.getElementById('background.mp3');
  backgroundSound.muted = !backgroundSound.muted;
}

// Function to toggle fullscreen mode
function toggleFullscreen() {
  // Enter or exit fullscreen mode
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Initialize the user experience enhancements
init();
enhanceUserExperience();