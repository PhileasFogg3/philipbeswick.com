document.addEventListener('DOMContentLoaded', () => {
  const camera = document.querySelector('[camera]');
  const invertXCheckbox = document.getElementById('invertX');
  const invertYCheckbox = document.getElementById('invertY');
  const gyroCheckbox = document.getElementById('gyroToggle');

  if (!camera) return;

  invertXCheckbox.addEventListener('change', () => {
    camera.setAttribute('inverted-look-controls', 'invertX', invertXCheckbox.checked);
  });

  invertYCheckbox.addEventListener('change', () => {
    camera.setAttribute('inverted-look-controls', 'invertY', invertYCheckbox.checked);
  });

  gyroCheckbox.addEventListener('change', async () => {
    if (gyroCheckbox.checked && typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          camera.setAttribute('inverted-look-controls', 'gyroscopeEnabled', true);
        }
      } catch (e) {
        alert('Permission denied for gyroscope.');
        gyroCheckbox.checked = false;
      }
    } else {
      camera.setAttribute('inverted-look-controls', 'gyroscopeEnabled', gyroCheckbox.checked);
    }
  });
});
