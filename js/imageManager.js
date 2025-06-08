function loadImage(imagePath, captionText) {
  const imageBox = document.getElementById('imageBox');
  const loadedImage = document.getElementById('loadedImage');
  const imageCaption = document.getElementById('imageCaption');

  loadedImage.src = imagePath;
  loadedImage.alt = captionText
  imageCaption.textContent = captionText;
  imageBox.style.display = 'block';
}

function closeImageBox() {
  const imageBox = document.getElementById('imageBox');
  imageBox.style.display = 'none';
}
