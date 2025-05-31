document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    const camera = scene.querySelector('[camera]');

    const invertXCheckbox = document.getElementById('invertX');
    const invertYCheckbox = document.getElementById('invertY');

    // Apply checkbox values to component when toggled
    invertXCheckbox.addEventListener('change', () => {
        camera.setAttribute('inverted-look-controls', 'invertX', invertXCheckbox.checked);
    });

    invertYCheckbox.addEventListener('change', () => {
        camera.setAttribute('inverted-look-controls', 'invertY', invertYCheckbox.checked);
    });
});

