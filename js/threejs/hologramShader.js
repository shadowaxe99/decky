const hologramVertexShader = `
  varying vec2 vUv;
  varying float noise;
  uniform float time;

  void main() {
    vUv = uv;
    // Add time to the noise parameters so it's animated
    noise = 10.0 *  -.10 * turbulence( .5 * normal + time );
    float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * time ), vec3( 100.0 ) );
    float displacement = - 10. * noise + b;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
  }
`;

const hologramFragmentShader = `
  varying vec2 vUv;
  varying float noise;
  uniform sampler2D baseTexture;
  uniform float time;
  uniform vec3 color;

  void main() {
    // Calculate color based on the uv coordinates and the noise parameter
    vec4 baseColor = texture2D( baseTexture, vUv );
    baseColor *= vec4( color, 1.0 );

    // Add some glow based on the noise value
    float alpha = 1.0 + noise * 0.1;
    baseColor *= alpha;

    // Output the final color
    gl_FragColor = baseColor;
  }
`;

const hologramMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    baseTexture: { value: new THREE.TextureLoader().load('assets/textures/specialEffects.png') },
    color: { value: new THREE.Color(0x00ff00) }
  },
  vertexShader: hologramVertexShader,
  fragmentShader: hologramFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

// Function to update the shader material time uniform
function updateHologramMaterial(time) {
  hologramMaterial.uniforms.time.value = time;
}

// Export the material and update function to be used in other parts of the application
export { hologramMaterial, updateHologramMaterial };