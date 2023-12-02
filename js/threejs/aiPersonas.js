// aiPersonas.js - AI Personas interaction and behavior logic for Elysium OS in Three.js

import { GLTFLoader } from './GLTFLoader.js';
import { TweenMax, Power2 } from './TweenMax.min.js';

// Shared variables from dependencies
let scene, mixer, clock, interactiveObjects, avatarsData, presentationData;

// AI Persona class definition
class AIPersona {
  constructor(modelUrl, data) {
    this.modelUrl = modelUrl;
    this.data = data;
    this.mesh = null;
    this.mixer = null;
    this.animations = {};
    this.isInteracting = false;
  }

  loadModel(callback) {
    const loader = new GLTFLoader();
    loader.load(this.modelUrl, (gltf) => {
      this.mesh = gltf.scene;
      this.mixer = new THREE.AnimationMixer(this.mesh);
      gltf.animations.forEach((clip) => {
        this.animations[clip.name] = this.mixer.clipAction(clip);
      });
      callback(this);
    });
  }

  playAnimation(name, loop = true) {
    if (this.animations[name]) {
      const action = this.animations[name];
      action.reset();
      action.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
      action.clampWhenFinished = true;
      action.play();
    }
  }

  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
  }

  interact() {
    if (!this.isInteracting) {
      this.isInteracting = true;
      // Custom interaction logic can be implemented here
      // For example, play a specific animation
      this.playAnimation('Wave');
      // After interaction, set a timeout to reset the interaction flag
      setTimeout(() => {
        this.isInteracting = false;
      }, 2000);
    }
  }
}

// Initialize AI Personas
function initAIPersonas() {
  avatarsData.forEach((avatar) => {
    const aiPersona = new AIPersona(avatar.modelUrl, avatar);
    aiPersona.loadModel((persona) => {
      scene.add(persona.mesh);
      interactiveObjects.push(persona.mesh);
      persona.playAnimation('Idle', true);
    });
  });
}

// Update AI Personas
function updateAIPersonas() {
  const deltaTime = clock.getDelta();
  avatarsData.forEach((avatar) => {
    avatar.update(deltaTime);
  });
}

// Event listener for AI Persona interaction
function onPersonaInteraction(event) {
  interactiveObjects.forEach((object) => {
    if (object === event.intersectedObject) {
      object.userData.interact();
    }
  });
}

// Export functions to be used in the main application
export { initAIPersonas, updateAIPersonas, onPersonaInteraction };