// Component registration (your fixed component here)
AFRAME.registerComponent('inverted-look-controls', {
    schema: {
    enabled: { default: true },
    invertX: { default: true },
    invertY: { default: false },
    sensitivity: { default: 0.002 }
    },

    init: function () {
    this.mouseDown = false;
    this.touching = false;
    this.lastX = 0;
    this.lastY = 0;

    this.bindMethods();
    this.addEventListeners();
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

    canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);
    },

    onMouseDown: function (e) {
    this.mouseDown = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
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

    this.el.object3D.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, this.el.object3D.rotation.x)
    );
    }
});

// Hook UI to component
const cameraEl = document.querySelector('[camera]');
const invertXCheckbox = document.getElementById('invertX');
const invertYCheckbox = document.getElementById('invertY');

invertXCheckbox.addEventListener('change', () => {
    cameraEl.setAttribute('inverted-look-controls', 'invertX', invertXCheckbox.checked);
});

invertYCheckbox.addEventListener('change', () => {
    cameraEl.setAttribute('inverted-look-controls', 'invertY', invertYCheckbox.checked);
});