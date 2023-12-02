/**
 * FXAAShader.js
 * Anti-aliasing shader for enhancing the visual quality of the 3D presentation in Three.js
 */

THREE.FXAAShader = {

	uniforms: {

		'tDiffuse': { type: 't', value: null },
		'resolution': { type: 'v2', value: new THREE.Vector2(1 / 1024, 1 / 768) }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",

		"void main() {",

			"vec2 invSize = 1.0 / resolution;",
			"vec4 fxaaColor = vec4(0.0);",

			/*
			 * FXAA Antialiasing Algorithm
			 * The algorithm is implemented based on the description and example code provided by NVIDIA.
			 * It smooths out the edges in the rendered scene to reduce the visual artifacts caused by aliasing.
			 */

			// This is a simplified version of the FXAA algorithm
			// For the complete algorithm, additional calculations and steps would be required

			"vec2 uvOffset = (vec2(0.5) / resolution) - (vUv / resolution);",
			"fxaaColor += texture2D(tDiffuse, vUv);",
			"fxaaColor += texture2D(tDiffuse, vUv + vec2(invSize.x, 0.0));",
			"fxaaColor += texture2D(tDiffuse, vUv - vec2(invSize.x, 0.0));",
			"fxaaColor += texture2D(tDiffuse, vUv + vec2(0.0, invSize.y));",
			"fxaaColor += texture2D(tDiffuse, vUv - vec2(0.0, invSize.y));",
			"fxaaColor /= 5.0;",

			"gl_FragColor = fxaaColor;",

		"}"

	].join("\n")

};