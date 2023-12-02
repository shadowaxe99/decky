import * as THREE from './three.min.js';

// OrbitControls.js
// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
// This is very similar to OrbitControls in three.js examples, but simplified for this context.

class OrbitControls {
  constructor(object, domElement) {
    this.object = object;
    this.domElement = domElement;

    // API
    this.enabled = true;
    this.center = new THREE.Vector3();
    this.userZoom = true;
    this.userZoomSpeed = 1.0;
    this.userRotate = true;
    this.userRotateSpeed = 1.0;
    this.userPan = true;
    this.userPanSpeed = 2.0;
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

    // internals
    this.rotateStart = new THREE.Vector2();
    this.rotateEnd = new THREE.Vector2();
    this.rotateDelta = new THREE.Vector2();
    this.zoomStart = new THREE.Vector2();
    this.zoomEnd = new THREE.Vector2();
    this.zoomDelta = new THREE.Vector2();
    this.phiDelta = 0;
    this.thetaDelta = 0;
    this.scale = 1;
    this.pan = new THREE.Vector3();

    // events
    this.changeEvent = { type: 'change' };

    // listeners
    domElement.addEventListener('contextmenu', event => event.preventDefault(), false);
    domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    domElement.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
    domElement.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), false); // firefox
  }

  rotateLeft(angle) {
    if (this.userRotate === false) return;
    this.thetaDelta -= angle;
  }

  rotateUp(angle) {
    if (this.userRotate === false) return;
    this.phiDelta -= angle;
  }

  // pass in distance in world space to move left
  panLeft(distance) {
    const te = this.object.matrix.elements;
    // get X column of matrix
    this.pan.set(te[0], te[1], te[2]);
    this.pan.multiplyScalar(-distance);
    this.center.add(this.pan);
  }

  // pass in distance in world space to move up
  panUp(distance) {
    const te = this.object.matrix.elements;
    // get Y column of matrix
    this.pan.set(te[4], te[5], te[6]);
    this.pan.multiplyScalar(distance);
    this.center.add(this.pan);
  }

  // pass in x,y of change desired in pixel space,
  // right and down are positive
  pan(deltaX, deltaY) {
    const element = this.domElement === document ? this.domElement.body : this.domElement;
    if (this.object.fov !== undefined) {
      // perspective
      const position = this.object.position;
      const offset = position.clone().sub(this.center);
      let targetDistance = offset.length();
      targetDistance *= Math.tan((this.object.fov / 2) * Math.PI / 180.0);
      this.panLeft(2 * deltaX * targetDistance / element.clientHeight);
      this.panUp(2 * deltaY * targetDistance / element.clientHeight);
    } else if (this.object.top !== undefined) {
      // orthographic
      this.panLeft(deltaX * (this.object.right - this.object.left) / element.clientWidth);
      this.panUp(deltaY * (this.object.top - this.object.bottom) / element.clientHeight);
    } else {
      // camera neither orthographic or perspective
      console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
    }
  }

  update() {
    const position = this.object.position;
    const offset = position.clone().sub(this.center);

    // angle from z-axis around y-axis
    let theta = Math.atan2(offset.x, offset.z);

    // angle from y-axis
    let phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);

    if (this.autoRotate) {
      this.rotateLeft(this.getAutoRotationAngle());
    }

    theta += this.thetaDelta;
    phi += this.phiDelta;

    // restrict phi to be between desired limits
    phi = Math.max(0, Math.min(Math.PI, phi));

    // restrict phi to be betwee EPS and PI-EPS
    const EPS = 0.000001;
    phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));

    let radius = offset.length() * this.scale;

    // move the camera to the new position
    position.x = this.center.x + radius * Math.sin(phi) * Math.sin(theta);
    position.y = this.center.y + radius * Math.cos(phi);
    position.z = this.center.z + radius * Math.sin(phi) * Math.cos(theta);

    this.object.lookAt(this.center);

    this.thetaDelta = 0;
    this.phiDelta = 0;
    this.scale = 1;

    if (this.lastPosition.distanceTo(this.object.position) > 0) {
      this.dispatchEvent(this.changeEvent);
      this.lastPosition.copy(this.object.position);
    }
  }

  getAutoRotationAngle() {
    return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
  }

  onMouseDown(event) {
    if (this.enabled === false) return;
    if (event.button === 0) {
      this.state = 'rotate';
      this.rotateStart.set(event.clientX, event.clientY);
    } else if (event.button === 1) {
      this.state = 'zoom';
      this.zoomStart.set(event.clientX, event.clientY);
    } else if (event.button === 2) {
      this.state = 'pan';
    }

    document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  }

  onMouseMove(event) {
    if (this.enabled === false) return;

    event.preventDefault();

    if (this.state === 'rotate') {
      this.rotateEnd.set(event.clientX, event.clientY);
      this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
      this.rotateLeft(2 * Math.PI * this.rotateDelta.x / this.domElement.clientWidth * this.userRotateSpeed);
      this.rotateUp(2 * Math.PI * this.rotateDelta.y / this.domElement.clientHeight * this.userRotateSpeed);
      this.rotateStart.copy(this.rotateEnd);
    } else if (this.state === 'zoom') {
      this.zoomEnd.set(event.clientX, event.clientY);
      this.zoomDelta.subVectors(this.zoomEnd, this.zoomStart);
      if (this.zoomDelta.y > 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
      this.zoomStart.copy(this.zoomEnd);
    } else if (this.state === 'pan') {
      const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
      this.pan(movementX, movementY);
    }
  }

  onMouseUp() {
    if (this.enabled === false) return;
    document.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
    document.removeEventListener('mouseup', this.onMouseUp.bind(this), false);
    this.state = 'none';
  }

  onMouseWheel(event) {
    if (this.enabled === false || this.userZoom === false) return;

    event.preventDefault();
    event.stopPropagation();

    let delta = 0;

    if (event.wheelDelta) {
      // WebKit / Opera / Explorer 9
      delta = event.wheelDelta;
    } else if (event.detail) {
      // Firefox
      delta = -event.detail;
    }

    if (delta > 0) {
      this.zoomOut();
    } else {
      this.zoomIn();
    }
  }

  zoomIn() {
    if (this.userZoom === false) return;
    this.scale /= this.userZoomSpeed;
  }

  zoomOut() {
    if (this.userZoom === false) return;
    this.scale *= this.userZoomSpeed;
  }

  dispose() {
    this.domElement.removeEventListener('contextmenu', this.onContextMenu, false);
    this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
    this.domElement.removeEventListener('mousewheel', this.onMouseWheel, false);
    this.domElement.removeEventListener('DOMMouseScroll', this.onMouseWheel, false); // firefox

    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);
  }

  onContextMenu(event) {
    event.preventDefault();
  }

  dispatchEvent(event) {
    // Placeholder for event dispatching logic
  }
}

export { OrbitControls };