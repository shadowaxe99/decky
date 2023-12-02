// js/threejs/animationMixer.js

import * as THREE from './three.min.js';

// Shared variables
let mixer, clock;

// Initialize the animation mixer and clock
function initAnimationMixer() {
  clock = new THREE.Clock();
  mixer = new THREE.AnimationMixer(scene);
}

// Update the mixer on each frame
function updateAnimationMixer() {
  if (mixer) {
    const delta = clock.getDelta();
    mixer.update(delta);
  }
}

// Create animations for a given object
function createAnimations(object, animations) {
  animations.forEach((clip) => {
    mixer.clipAction(clip, object).play();
  });
}

// Event listener for animation start
function onAnimationStart(callback) {
  mixer.addEventListener('loop', (e) => {
    if (e.action.getClip().name === 'start') {
      callback();
    }
  });
}

// Event listener for animation end
function onAnimationEnd(callback) {
  mixer.addEventListener('finished', (e) => {
    callback(e);
  });
}

export {
  initAnimationMixer,
  updateAnimationMixer,
  createAnimations,
  onAnimationStart,
  onAnimationEnd
};