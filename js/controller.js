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

    // Wait for scene to fully load
    this.el.sceneEl.addEventListener('loaded', () => {
      this.addHotspotCursorListeners();
      this.addUIControls();
      this.delayGyroActivation(); // ensure camera/image is ready before using gyro
    });
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
      if (!this.mouseDown) {
        canvas.style.cursor = 'default';
      }
    });
  },

  addHotspotCursorListeners: function () {
    const hotspots = this.el.sceneEl.querySelectorAll('.clickable');
    hotspots.forEach(hotspot => {
      hotspot.style.cursor = 'pointer';
      hotspot.addEventListener('mouseenter', () => {
        this.el.sceneEl.canvas.style.cursor = 'pointer';
      });
      hotspot.addEventListener('mouseleave', () => {
        this.el.sceneEl.canvas.style.cursor = this.mouseDown ? 'grabbing' : 'grab';
      });
    });
  },

  addUIControls: function () {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.padding = '8px';
    container.style.background = 'rgba(0,0,0,0.6)';
    container.style.color = '#fff';
    container.style.zIndex = '999';

    const invertX = document.createElement('input');
    invertX.type = 'checkbox';
    invertX.id = 'invertX';
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
    invertY.addEventListener('change', () => {
      this.data.invertY = invertY.checked;
    });

    const labelY = document.createElement('label');
    labelY.htmlFor = 'invertY';
    labelY.textContent = 'Invert Y';
    labelY.style.marginRight = '10px';

    const gyroBtn = document.createElement('button');
    gyroBtn.textContent = 'Enable Gyroscope';
    gyroBtn.style.marginLeft = '10px';
    gyroBtn.onclick = () => {
      this.data.gyroscopeEnabled = true;
      window.addEventListener('deviceorientation', this.deviceOrientationHandler, true);
    };

    container.appendChild(invertX);
    container.appendChild(labelX);
    container.appendChild(invertY);
    container.appendChild(labelY);
    container.appendChild(gyroBtn);

    document.body.appendChild(container);
  },

  delayGyroActivation: function () {
    if (this.data.gyroscopeEnabled) {
      setTimeout(() => {
        window.addEventListener('deviceorientation', this.deviceOrientationHandler, true);
      }, 500); // wait for camera and image to stabilize
    }
  },

  deviceOrientationHandler: function (event) {
    if (!this.data.gyroscopeEnabled) return;
    if (typeof event.alpha !== 'number' || isNaN(event.alpha)) return;

    const yaw = THREE.MathUtils.degToRad(event.alpha);
    const pitch = THREE.MathUtils.degToRad(event.beta - 90);

    this.el.object3D.rotation.y = yaw;
    this.el.object3D.rotation.x = pitch;

    // Clamp pitch
    this.el.object3D.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.el.object3D.rotation.x)
    );
  },

  onMouseDown: function (e) {
    this.mouseDown = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.el.sceneEl.canvas.style.cursor = 'grabbing';
  },

  onMouseMove: function (e) {
    if (!this.mouseDown || !this.data.enabled) return;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;

    this.rotate(dx, dy);

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  },

  onMouseUp: function () {
    this.mouseDown = false;
    this.el.sceneEl.canvas.style.cursor = 'grab';
  },

  onTouchStart: function (e) {
    if (!this.data.enabled || e.touches.length !== 1) return;
    this.touching = true;
    this.lastX = e.touches[0].clientX;
    this.lastY = e.touches[0].clientY;
  },

  onTouchMove: function (e) {
    if (!this.touching || !this.data.enabled) return;
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

    // Clamp pitch
    this.el.object3D.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.el.object3D.rotation.x)
    );
  }
});