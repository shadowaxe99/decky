// js/threejs/accessibility.js

// Ensure the Three.js scene is accessible on any device
function enhanceAccessibility() {
  // Adjust camera and renderer settings for different screen sizes
  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Enable keyboard controls for user interaction
  document.addEventListener('keydown', onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // Define key codes for interaction (e.g., space bar for play/pause)
    if (keyCode === 32) { // Space bar
      // Toggle play/pause of the presentation
      togglePlayPause();
    }
  }

  // Provide alternative text descriptions for non-text content
  function setAltTextForModels() {
    // Assuming each model has an associated DOM element for description
    presentationData.slides.forEach((slide, index) => {
      var altTextElement = document.querySelector(`#altTextSlide${index}`);
      if (altTextElement) {
        altTextElement.innerText = slide.description;
      }
    });
  }

  // Implement text-to-speech for descriptions and interactive elements
  function textToSpeech(description) {
    var msg = new SpeechSynthesisUtterance(description);
    window.speechSynthesis.speak(msg);
  }

  // Provide captions for audio content
  function createCaptions(audioDescriptions) {
    // Assuming a function that creates caption elements
    audioDescriptions.forEach(description => {
      createCaptionElement(description);
    });
  }

  // Ensure interactive elements are focusable and can be activated using keyboard
  function makeInteractiveElementsAccessible() {
    interactiveObjects.forEach(object => {
      // Assuming each interactive object has an associated DOM element
      var element = document.querySelector(`#${object.domElementId}`);
      if (element) {
        element.setAttribute('tabindex', '0'); // Make it focusable
        element.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            object.interact(); // Define an interact function for the object
          }
        });
      }
    });
  }

  // Call the functions to enhance accessibility
  setAltTextForModels();
  makeInteractiveElementsAccessible();
}

// Call the main function to enhance accessibility
enhanceAccessibility();