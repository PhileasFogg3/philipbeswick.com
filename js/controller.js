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
    this.deviceOrientationControls = null;
    this._eventsAttached = false;

    this.bindMethods();
    this.addEventListeners();

    this.el.sceneEl.addEventListener('loaded', () => {
      this.addInteractiveCursorListeners();
    });

    this.addUIControls();

    const settingsButton = document.getElementById('settingsButton');
    this.settingsPanel = document.getElementById('settingsPanel');

    if (settingsButton && this.settingsPanel) {
      this.settingsPanel.style.display = 'none';
      settingsButton.addEventListener('click', () => {
        this.settingsPanel.style.display =
          this.settingsPanel.style.display === 'none' ? 'flex' : 'none';
      });
    }
  },

  update: function () {
    if (this.data.enabled) {
      this.addEventListeners();
    } else {
      this.removeEventListeners();
    }
  },

  bindMethods: function () {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  },

  addEventListeners: function () {
    const canvas = this.el.sceneEl.canvas;

    if (!canvas) {
      this.el.sceneEl.addEventListener('render-target-loaded', () => this.addEventListeners());
      return;
    }

    if (this._eventsAttached) return;
    this._eventsAttached = true;

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

  removeEventListeners: function () {
    const canvas = this.el.sceneEl.canvas;
    if (!canvas || !this._eventsAttached) return;
    this._eventsAttached = false;

    canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);

    canvas.removeEventListener('touchstart', this.onTouchStart);
    canvas.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  },

  addInteractiveCursorListeners: function () {
    const sceneEl = this.el.sceneEl;
    const canvas = sceneEl.canvas;

    const interactiveEls = sceneEl.querySelectorAll('.clickable, .hoverable');

    interactiveEls.forEach(el => {
      el.style.cursor = 'pointer';

      el.addEventListener('mouseenter', () => {
        if (canvas) canvas.style.cursor = 'pointer';
        if (el.classList.contains('hoverable')) {
          el.classList.add('hovering');
        }
      });

      el.addEventListener('mouseleave', () => {
        if (canvas) canvas.style.cursor = this.mouseDown ? 'grabbing' : 'grab';
        if (el.classList.contains('hoverable')) {
          el.classList.remove('hovering');
        }
      });
    });
  },

  addUIControls: function () {
    const container = document.createElement('div');
    container.id = 'settingsPanel';
    container.style.display = 'none';
    container.style.flexDirection = 'column';    // stack vertically
    container.style.flexWrap = 'wrap';            // wrap if needed
    container.style.gap = '12px';
    container.style.padding = '8px';
    container.style.background = 'rgba(0,0,0,0.6)';
    container.style.color = '#fff';
    container.style.zIndex = '1000';
    container.style.borderRadius = '8px';
    container.style.minWidth = '200px';
    container.style.position = 'fixed';
    container.style.top = '80px';   // some distance from top of viewport
    container.style.right = '10px'; // near right edge, or left if you prefer
    container.style.maxHeight = 'calc(100vh - 100px)'; // max height so it doesn’t go off bottom
    container.style.overflowY = 'auto'; // scroll if too tall
    container.style.boxSizing = 'border-box'; // padding included in size



    // Helper to create a checkbox with label wrapped in a flex container
    function createCheckbox(id, labelText, checked, onChange) {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = '6px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = id;
      checkbox.checked = checked;
      checkbox.addEventListener('change', onChange);

      const label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = labelText;

      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);

      return wrapper;
    }

    // Invert X checkbox
    container.appendChild(createCheckbox('invertX', 'Invert X', this.data.invertX, (e) => {
      this.data.invertX = e.target.checked;
    }));

    // Invert Y checkbox
    container.appendChild(createCheckbox('invertY', 'Invert Y', this.data.invertY, (e) => {
      this.data.invertY = e.target.checked;
    }));

    // Gyroscope toggle checkbox
    container.appendChild(createCheckbox('gyroToggle', 'Enable Gyroscope', this.data.gyroscopeEnabled, (e) => {
      this.data.gyroscopeEnabled = e.target.checked;

      if (e.target.checked) {
        console.log('[Gyro] Enabling THREE.DeviceOrientationControls');
        this.deviceOrientationControls = new THREE.DeviceOrientationControls(this.el.object3D);
        this.deviceOrientationControls.connect();
      } else {
        console.log('[Gyro] Disabling gyroscope controls');
        if (this.deviceOrientationControls) {
          this.deviceOrientationControls.disconnect();
          this.deviceOrientationControls = null;
        }
      }
    }));

    // Append the container to wherever it should go in your DOM
    document.getElementById('settingsPlace').appendChild(container);
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
    if (!this.data.enabled || this.data.gyroscopeEnabled || e.touches.length !== 1) return;

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

  tick: function () {
    if (this.data.gyroscopeEnabled && this.deviceOrientationControls) {
      this.deviceOrientationControls.update();
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const welcomeBox = document.getElementById("welcomeBox");
  const cameraEl = document.getElementById("cameraRig");

  function waitForScene(callback) {
    const scene = document.querySelector('a-scene');
    if (scene && scene.hasLoaded) {
      callback(scene);
    } else if (scene) {
      scene.addEventListener('loaded', () => callback(scene));
    } else {
      setTimeout(() => waitForScene(callback), 100);
    }
  }

  waitForScene(() => {
    // Poll until component is initialized
    const checkComponent = setInterval(() => {
      if (cameraEl && cameraEl.components['inverted-look-controls']) {
        clearInterval(checkComponent);

        // Disable look controls
        cameraEl.setAttribute('inverted-look-controls', 'enabled', false);

        // Show welcome box
        if (welcomeBox) {
          welcomeBox.style.display = "block";
        }
      }
    }, 100);
  });
});

function closeWelcomeBox() {
  const welcomeBox = document.getElementById('welcomeBox');
  const cameraEl = document.getElementById('cameraRig');

  if (welcomeBox) {
    welcomeBox.style.display = 'none';
    if (cameraEl && cameraEl.components['inverted-look-controls']) {
      cameraEl.setAttribute('inverted-look-controls', 'enabled', true);
    }
  }
}
