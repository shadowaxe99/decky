// js/threejs/customization.js

// Import shared dependencies and variables
import { scene, avatarsData } from './sharedDependencies.js';

// Customization class to handle character and environment customization
class Customization {
  constructor() {
    this.customizationOptions = {
      characters: [],
      environments: []
    };
  }

  // Load customization options from external data
  loadCustomizationData() {
    // Load character customization options
    this.customizationOptions.characters = avatarsData.characters.map(character => {
      return {
        model: character.model,
        textures: character.textures
      };
    });

    // Load environment customization options
    // This could be expanded to include various environment themes
    this.customizationOptions.environments.push({
      texture: 'assets/textures/environment.jpg'
    });
  }

  // Apply customization to a character
  applyCharacterCustomization(character, options) {
    const loader = new THREE.GLTFLoader();
    loader.load(options.model, gltf => {
      character.model = gltf.scene;
      character.model.traverse(node => {
        if (node.isMesh) {
          node.material.map = new THREE.TextureLoader().load(options.textures.base);
          node.material.needsUpdate = true;
        }
      });
      scene.add(character.model);
    });
  }

  // Apply customization to the environment
  applyEnvironmentCustomization(options) {
    scene.background = new THREE.TextureLoader().load(options.texture);
  }

  // Initialize customization options
  init() {
    this.loadCustomizationData();
  }
}

// Instantiate the Customization class
const customization = new Customization();
customization.init();

// Export the customization class for use in other modules
export { customization };