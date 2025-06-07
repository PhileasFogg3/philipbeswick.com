function loadImage(imagePath) {
  const imageBox = document.getElementById('imageBox');
  const loadedImage = document.getElementById('loadedImage');

  loadedImage.src = imagePath;
  imageBox.style.display = 'block';
}

function closeImageBox() {
  const imageBox = document.getElementById('imageBox');
  imageBox.style.display = 'none';
}