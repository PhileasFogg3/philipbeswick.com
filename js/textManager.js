let animationFrameId = null;
let textBox = null;

function showTextBox(hotspot, room) {
    const scene = document.querySelector('a-scene');
    const cameraEl = scene.camera.el;

    // Create the text box
    textBox = document.createElement('div');
    textBox.id = 'hover-text';
    textBox.innerText = hotspot.info;
    textBox.style.position = 'absolute';
    textBox.style.color = 'black';
    textBox.style.background = 'rgba(255, 255, 255, 0.8)';
    textBox.style.padding = '5px 10px';
    textBox.style.borderRadius = '8px';
    textBox.style.fontFamily = 'sans-serif';
    textBox.style.pointerEvents = 'none';
    textBox.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(textBox);

    // Start updating position
    function updatePosition() {
        const position = getHotspotPosition(hotspot, room);
        const vector = new THREE.Vector3(position.x, position.y, position.z);
        vector.project(cameraEl.getObject3D('camera'));

        const width = window.innerWidth / 2;
        const height = window.innerHeight / 2;
        const x = vector.x * width + width;
        const y = -vector.y * height + height;

        if (vector.z < 1) {
            textBox.style.display = 'block';
            textBox.style.left = `${x}px`;
            textBox.style.top = `${y}px`;
        } else {
            textBox.style.display = 'none';
        }

        animationFrameId = requestAnimationFrame(updatePosition);
    }

    updatePosition();
}

function hideTextBox() {
    if (textBox) {
        textBox.remove();
        textBox = null;
    }

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}