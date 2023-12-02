// avatars.js - Handles the creation and management of avatars in the Elysium OS metaverse

import { GLTFLoader } from './GLTFLoader.js';
import { scene, interactiveObjects, avatarsData } from './sharedDependencies.js';

// Load avatar models and data
function loadAvatars() {
  const loader = new GLTFLoader();
  loader.load('assets/models/characters.glb', function (gltf) {
    const avatarModels = gltf.scene.children;
    createAvatars(avatarModels);
  }, undefined, function (error) {
    console.error('An error happened while loading avatars:', error);
  });
}

// Create avatars from loaded models
function createAvatars(avatarModels) {
  avatarsData.forEach(avatarData => {
    const avatarModel = avatarModels.find(model => model.name === avatarData.modelName).clone();
    avatarModel.position.set(avatarData.position.x, avatarData.position.y, avatarData.position.z);
    avatarModel.scale.set(avatarData.scale.x, avatarData.scale.y, avatarData.scale.z);
    scene.add(avatarModel);

    // Add interactive functionality to avatars
    interactiveObjects.push(avatarModel);
    avatarModel.userData = { ...avatarData.interactiveData };
  });
}

// Update avatars - this function can be expanded to include animations and interactions
function updateAvatars(deltaTime) {
  // Placeholder for avatar update logic
}

export { loadAvatars, updateAvatars };