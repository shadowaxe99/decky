// ShaderPass.js
import * as THREE from './three.min.js';
import { CopyShader } from './CopyShader.js';

const ShaderPass = function (shader, textureID) {
  this.textureID = (textureID !== undefined) ? textureID : "tDiffuse";

  this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

  this.material = new THREE.ShaderMaterial({
    defines: Object.assign({}, shader.defines),
    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader
  });

  this.fsQuad = new THREE.FullScreenQuad(this.material);
};

ShaderPass.prototype = {
  constructor: ShaderPass,

  render: function (renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    if (this.uniforms[this.textureID]) {
      this.uniforms[this.textureID].value = readBuffer.texture;
    }

    this.fsQuad.material = this.material;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  },

  setSize: function (width, height) {
    // This method can be used if the shader pass relies on screen size
  },

  setUniforms: function (values) {
    for (const key in values) {
      if (this.uniforms[key]) {
        this.uniforms[key].value = values[key];
      }
    }
  }
};

export { ShaderPass };