// js/threejs/learningModules.js

import { GLTFLoader } from './GLTFLoader.js';
import { TweenMax, Power2 } from './TweenMax.min.js';

const learningModulesData = require('../data/learningModules.json');

class LearningModule {
  constructor(data) {
    this.data = data;
    this.module = null;
  }

  loadModule(scene) {
    const loader = new GLTFLoader();
    loader.load(this.data.model, (gltf) => {
      this.module = gltf.scene;
      this.module.name = this.data.name;
      scene.add(this.module);
      this.animateEntrance();
    });
  }

  animateEntrance() {
    if (this.module) {
      TweenMax.fromTo(this.module.position, 3, { y: -5 }, { y: 0, ease: Power2.easeOut });
      TweenMax.fromTo(this.module.rotation, 3, { y: Math.PI }, { y: 0, ease: Power2.easeOut });
    }
  }

  interact() {
    // Define interaction logic for learning modules here
    console.log(`Interacting with module: ${this.data.name}`);
  }
}

function setupLearningModules(scene) {
  learningModulesData.forEach((moduleData) => {
    const learningModule = new LearningModule(moduleData);
    learningModule.loadModule(scene);
  });
}

export { setupLearningModules };