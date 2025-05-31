AFRAME.registerComponent('inverted-look-controls', {
  schema: {
    enabled: { default: true },
    invertX: { default: false },
    invertY: { default: false },
    sensitivity: { default: 0.002 },
    gyroscopeEnabled: { default: false }
  },

  init: function () {
    this.mouseDown = false;
    this.touching = false;
    this.lastX = 0;
    this.lastY = 0;

    this.bindMethods();
    this.addEventListeners();

    this.el.sceneEl.addEventListener('loaded', () => {
      this.addHotspotCursorListeners();
    });

    this.addUIControls();
  },

  bindMethods: function () {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.deviceOrientationHandler = this.deviceOrientationHandler.bind(this);
  },

  addEventListeners: function () {
    const canvas = this.el.sceneEl.canvas;

    if (!canvas) {
      this.el.sceneEl.addEventListener('render-target-loaded', () => this.addEventListeners());
      return;
    }

    canvas.style.cursor = 'grab';

    canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);

    canvas.addEventListener('mouseleave', () => {
      if (!this.mouseDown) canvas.style.cursor = 'default';
    });
  },

  addHotspotCursorListeners: function () {
    const hotspots = this.el.sceneEl.querySelectorAll('.clickable');

    hotspots.forEach(hotspot => {
      hotspot.style.cursor = 'pointer';

      hotspot.addEventListener('mouseenter', () => {
        const canvas = this.el.sceneEl.canvas;
        if (canvas) canvas.style.cursor = 'pointer';
      });

      hotspot.addEventListener('mouseleave', () => {
        const canvas = this.el.sceneEl.canvas;
        if (canvas) {
          canvas.style.cursor = this.mouseDown ? 'grabbing' : 'grab';
        }
      });
    });
  },

  addUIControls: function () {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.padding = '8px';
    container.style.background = 'rgba(0,0,0,0.6)';
    container.style.color = '#fff';
    container.style.zIndex = '999';

    const invertX = document.createElement('input');
    invertX.type = 'checkbox';
    invertX.id = 'invertX';
    invertX.checked = this.data.invertX;
    invertX.addEventListener('change', () => {
      this.data.invertX = invertX.checked;
    });

    const labelX = document.createElement('label');
    labelX.htmlFor = 'invertX';
    labelX.textContent = 'Invert X';
    labelX.style.marginRight = '10px';

    const invertY = document.createElement('input');
    invertY.type = 'checkbox';
    invertY.id = 'invertY';
    invertY.checked = this.data.invertY;
    invertY.addEventListener('change', () => {
      this.data.invertY = invertY.checked;
    });

    const labelY = document.createElement('label');
    labelY.htmlFor = 'invertY';
    labelY.textContent = 'Invert Y';
    labelY.style.marginRight = '10px';

    const gyroCheckbox = document.createElement('input');
    gyroCheckbox.type = 'checkbox';
    gyroCheckbox.id = 'enableGyro';
    gyroCheckbox.checked = this.data.gyroscopeEnabled;
    gyroCheckbox.style.marginLeft = '10px';

    gyroCheckbox.addEventListener('change', () => {
      this.data.gyroscopeEnabled = gyroCheckbox.checked;

      if (gyroCheckbox.checked) {
        console.log('[Gyro] Enabled: Adding deviceorientation listener');
        window.addEventListener('deviceorientation', this.deviceOrientationHandler, true);
      } else {
        console.log('[Gyro] Disabled: Removing deviceorientation listener');
        window.removeEventListener('deviceorientation', this.deviceOrientationHandler, true);
      }
    });

    const gyroLabel = document.createElement('label');
    gyroLabel.htmlFor = 'enableGyro';
    gyroLabel.textContent = 'Enable Gyroscope';
    gyroLabel.style.marginLeft = '5px';
    gyroLabel.style.marginRight = '10px';

    container.appendChild(invertX);
    container.appendChild(labelX);
    container.appendChild(invertY);
    container.appendChild(labelY);
    container.appendChild(gyroCheckbox);
    container.appendChild(gyroLabel);

    document.body.appendChild(container);
  },

  onMouseDown: function (e) {
    this.mouseDown = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    const canvas = this.el.sceneEl.canvas;
    if (canvas) canvas.style.cursor = 'grabbing';
  },

  onMouseMove: function (e) {
    if (!this.mouseDown || !this.data.enabled || this.data.gyroscopeEnabled) return;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;

    this.rotate(dx, dy);

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  },

  onMouseUp: function () {
    this.mouseDown = false;

    const canvas = this.el.sceneEl.canvas;
    if (canvas) canvas.style.cursor = 'grab';
  },

  onTouchStart: function (e) {
    if (!this.data.enabled || e.touches.length !== 1 || this.data.gyroscopeEnabled) return;

    this.touching = true;
    this.lastX = e.touches[0].clientX;
    this.lastY = e.touches[0].clientY;
  },

  onTouchMove: function (e) {
    if (!this.touching || !this.data.enabled || this.data.gyroscopeEnabled) return;

    e.preventDefault();

    const touch = e.touches[0];
    const dx = touch.clientX - this.lastX;
    const dy = touch.clientY - this.lastY;

    this.rotate(dx, dy);

    this.lastX = touch.clientX;
    this.lastY = touch.clientY;
  },

  onTouchEnd: function () {
    this.touching = false;
  },

  rotate: function (dx, dy) {
    const { invertX, invertY, sensitivity } = this.data;

    this.el.object3D.rotation.y += (invertX ? -1 : 1) * dx * sensitivity;
    this.el.object3D.rotation.x += (invertY ? -1 : 1) * dy * sensitivity;

    this.el.object3D.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.el.object3D.rotation.x)
    );
  },

  deviceOrientationHandler: function (event) {
    if (!this.data.gyroscopeEnabled) return;

    const object3D = this.el.object3D;

    // Convert to radians
    let pitch = THREE.MathUtils.degToRad(event.beta);  // x-axis tilt
    let yaw = THREE.MathUtils.degToRad(event.alpha);   // compass heading

    // Clamp pitch
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    // Smooth interpolation
    object3D.rotation.x += (pitch - object3D.rotation.x) * 0.1;
    object3D.rotation.y += (yaw - object3D.rotation.y) * 0.1;
  }
});