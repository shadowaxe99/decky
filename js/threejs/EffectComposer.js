// EffectComposer.js
import * as THREE from './three.min.js';
import { RenderPass } from './RenderPass.js';
import { ShaderPass } from './ShaderPass.js';
import { CopyShader } from './CopyShader.js';
import { FXAAShader } from './FXAAShader.js';
import { hologramShader } from './hologramShader.js';

class EffectComposer {
    constructor(renderer, renderTarget) {
        this.renderer = renderer;
        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();
        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;
        this.passes = [];
        this.copyPass = new ShaderPass(CopyShader);
    }

    swapBuffers() {
        const temp = this.readBuffer;
        this.readBuffer = this.writeBuffer;
        this.writeBuffer = temp;
    }

    addPass(pass) {
        this.passes.push(pass);
        pass.setSize(this.renderer.domElement.width, this.renderer.domElement.height);
    }

    insertPass(pass, index) {
        this.passes.splice(index, 0, pass);
    }

    render(delta) {
        let maskActive = false;

        for (let i = 0; i < this.passes.length; i++) {
            const pass = this.passes[i];

            if (pass.enabled === false) continue;

            pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

            if (pass.needsSwap) {
                if (maskActive) {
                    const context = this.renderer.context;
                    context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);
                    this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);
                    context.stencilFunc(context.EQUAL, 1, 0xffffffff);
                }

                this.swapBuffers();
            }

            if (THREE.MaskPass !== undefined) {
                if (pass instanceof THREE.MaskPass) {
                    maskActive = true;
                } else if (pass instanceof THREE.ClearMaskPass) {
                    maskActive = false;
                }
            }
        }
    }

    reset(renderTarget) {
        if (renderTarget === undefined) {
            const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
            renderTarget = this.renderTarget1.clone();
            renderTarget.setSize(size.width, size.height);
        }

        this.renderTarget1.dispose();
        this.renderTarget2.dispose();
        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;
    }

    setSize(width, height) {
        this.renderTarget1.setSize(width, height);
        this.renderTarget2.setSize(width, height);

        for (let i = 0; i < this.passes.length; i++) {
            this.passes[i].setSize(width, height);
        }
    }
}

// Setup the composer with the necessary passes
function setupComposer(renderer) {
    const composer = new EffectComposer(renderer);

    // Add render pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Add hologram effect
    const hologramPass = new ShaderPass(hologramShader);
    composer.addPass(hologramPass);

    // Add FXAA pass
    const fxaaPass = new ShaderPass(FXAAShader);
    composer.addPass(fxaaPass);

    // Ensure the last pass is a copy pass to write to the screen
    composer.addPass(composer.copyPass);

    return composer;
}

// Export the setup function to be used in the main application
export { setupComposer };