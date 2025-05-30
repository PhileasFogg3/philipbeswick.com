AFRAME.registerComponent('raycast-target-setup', {
  init: function () {
    const geometry = new THREE.SphereGeometry(500, 64, 64);
    geometry.scale(-1, 1, 1); // Flip normals inward
    const material = new THREE.MeshBasicMaterial({ visible: false });
    this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
  }
});

AFRAME.registerComponent('look-point-debugger', {
  init: function () {
    this.cameraEl = document.querySelector('#cam');
    this.targetEl = document.querySelector('#raycast-target');
    this.hitPointEl = document.querySelector('#hitPoint');
    this.raycaster = new THREE.Raycaster();
  },
  tick: function () {
    if (!this.cameraEl || !this.targetEl) return;

    const cameraObj = this.cameraEl.object3D;
    const targetObj = this.targetEl.object3D;

    const origin = new THREE.Vector3();
    const direction = new THREE.Vector3();

    cameraObj.getWorldPosition(origin);
    cameraObj.getWorldDirection(direction);

    this.raycaster.set(origin, direction);

    const intersects = this.raycaster.intersectObject(targetObj, true);

    if (intersects.length > 0) {
      const pt = intersects[0].point.clone();  // Use raw intersection point
      this.hitPointEl.setAttribute('position', pt);
      this.hitPointEl.setAttribute('visible', true);

      const roomRot = currentRoom ? rooms[currentRoom].rotation : [0, 0, 0];
      const inverseEuler = new THREE.Euler(
      THREE.MathUtils.degToRad(-roomRot[0]),
      THREE.MathUtils.degToRad(-roomRot[1]),
      THREE.MathUtils.degToRad(-roomRot[2]),
      'YXZ'
    );

    pt.applyEuler(inverseEuler);

    const correctX = -pt.x;  // Because of .scale(-1, 1, 1)
    const correctY = -pt.y;
    const correctZ = -pt.z;

    document.getElementById('coordsBox').innerHTML =
      `x: ${correctX.toFixed(2)}<br>` +
      `y: ${correctY.toFixed(2)}<br>` +
      `z: ${correctZ.toFixed(2)}`;

      // console.log('Intersect at:', pt);
    } else {
      this.hitPointEl.setAttribute('visible', false);
      document.getElementById('coordsBox').innerHTML = 'No intersection';
      // console.log('No intersection');
    }
  }
});