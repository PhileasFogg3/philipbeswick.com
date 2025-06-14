function loadImage(imagePath, captionText) {
  const imageBox = document.getElementById('imageBox');
  const loadedImage = document.getElementById('loadedImage');
  const imageCaption = document.getElementById('imageCaption');
  const cameraEl = document.getElementById('cameraRig');

  loadedImage.src = imagePath;
  loadedImage.alt = captionText
  imageCaption.textContent = captionText;
  imageBox.style.display = 'block';

  if (cameraEl && cameraEl.components['inverted-look-controls']) {

    cameraEl.setAttribute('inverted-look-controls', 'enabled', false);

  }
}

function closeImageBox() {

  const cameraEl = document.getElementById('cameraRig');
  const imageBox = document.getElementById('imageBox');

  if (imageBox) {

    imageBox.style.display = 'none';
    if (cameraEl && cameraEl.components['inverted-look-controls']) {

      cameraEl.setAttribute('inverted-look-controls', 'enabled', true);

    }
  }

  imageBox.style.display = 'none';

}