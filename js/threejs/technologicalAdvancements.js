// technologicalAdvancements.js

// Import shared dependencies and variables
import { scene, camera, renderer, mixer, clock, controls, composer, hologramMaterial, interactiveObjects, technologicalAdvancementsData } from './sharedDependencies.js';

// Function to create technological advancements visualizations
function createTechnologicalAdvancements() {
  // Load the technological advancements data
  const advancements = technologicalAdvancementsData;

  // Iterate through each technological advancement and create visual elements
  advancements.forEach(advancement => {
    const { name, description, hasElysium } = advancement;

    // Create a 3D object for each technological advancement
    const object = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: hasElysium ? 0x00ff00 : 0xff0000 })
    );

    // Add custom properties to the object
    object.userData = {
      name,
      description,
      interactive: true
    };

    // Position the object randomly in the scene
    object.position.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );

    // Add the object to the scene
    scene.add(object);

    // Add the object to the list of interactive objects
    interactiveObjects.push(object);
  });

  // Add special effects like holograms to the advancements
  advancements.forEach(advancement => {
    // Create hologram effect for each advancement
    const hologram = createHologramEffect(advancement);
    scene.add(hologram);
  });
}

// Function to create hologram effect
function createHologramEffect(advancement) {
  const geometry = new THREE.PlaneGeometry(5, 5);
  const hologram = new THREE.Mesh(geometry, hologramMaterial);

  // Set position and rotation to make it look like a floating hologram
  hologram.position.set(advancement.position.x, advancement.position.y, advancement.position.z);
  hologram.rotation.x = Math.PI / 2;

  return hologram;
}

// Function to animate technological advancements
function animateTechnologicalAdvancements() {
  // Update the mixer for animations
  if (mixer) {
    const delta = clock.getDelta();
    mixer.update(delta);
  }

  // Rotate holograms or other special effects
  interactiveObjects.forEach(object => {
    if (object.userData.hologram) {
      object.rotation.y += 0.01;
    }
  });

  // Render the scene with all advancements
  renderer.render(scene, camera);
}

// Initialize and animate technological advancements
createTechnologicalAdvancements();
animateTechnologicalAdvancements();

// Export functions for use in other modules
export { createTechnologicalAdvancements, animateTechnologicalAdvancements };