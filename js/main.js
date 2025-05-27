pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const url = 'https://phileasfogg3.github.io/CV/main.pdf'; // Your PDF here
const container = document.getElementById('pdf-container');

pdfjsLib.getDocument(url).promise.then(pdf => {
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    pdf.getPage(pageNum).then(page => {
      const scale = window.innerWidth / 1000 * 1.5;
      const viewport = page.getViewport({ scale });

      // Create container for page canvas and links
      const pageWrapper = document.createElement('div');
      pageWrapper.className = 'page-wrapper';
      pageWrapper.style.position = 'relative'; // Important for overlay positioning
      pageWrapper.style.width = viewport.width + 'px';
      pageWrapper.style.height = viewport.height + 'px';

      // Canvas for rendering page
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      pageWrapper.appendChild(canvas);

      // Render PDF page into canvas
      page.render({ canvasContext: ctx, viewport }).promise.then(() => {
        // Once rendering done, add links
        page.getAnnotations().then(annotations => {
          const linkLayer = document.createElement('div');
          linkLayer.className = 'link-layer';
          linkLayer.style.position = 'absolute';
          linkLayer.style.top = '0';
          linkLayer.style.left = '0';
          linkLayer.style.width = viewport.width + 'px';
          linkLayer.style.height = viewport.height + 'px';
          linkLayer.style.pointerEvents = 'auto'; // Make links clickable

          annotations.forEach(annot => {
            if (annot.subtype === 'Link') {
              // Calculate link rectangle in viewport coordinates
              const rect = viewport.convertToViewportRectangle(annot.rect);
              const left = Math.min(rect[0], rect[2]);
              const top = Math.min(rect[1], rect[3]);
              const width = Math.abs(rect[0] - rect[2]);
              const height = Math.abs(rect[1] - rect[3]);

              // Create <a> element for link
              const link = document.createElement('a');
              link.style.position = 'absolute';
              link.style.left = left + 'px';
              link.style.top = top + 'px';
              link.style.width = width + 'px';
              link.style.height = height + 'px';
              link.style.backgroundColor = 'rgba(0,0,255,0.1)'; // Optional: highlight links

              if (annot.url) {
                // External URL
                link.href = annot.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
              } else if (annot.dest) {
                // Internal link to another page/destination
                link.href = '#'; // Prevent default jump for now
                link.style.cursor = 'pointer';

                link.addEventListener('click', (e) => {
                  e.preventDefault();
                  pdf.getDestination(annot.dest).then(destArray => {
                    if (destArray) {
                      const destRef = destArray[0];
                      let destPageNum = null;
                      if (typeof destRef === 'object' && destRef.num) {
                        // Destination is a reference to a page object
                        pdf.getPageIndex(destRef).then(pageIndex => {
                          destPageNum = pageIndex + 1;
                          scrollToPage(destPageNum);
                        });
                      } else if (typeof destRef === 'number') {
                        destPageNum = destRef + 1;
                        scrollToPage(destPageNum);
                      }
                    }
                  });
                });
              }

              linkLayer.appendChild(link);
            }
          });

          pageWrapper.appendChild(linkLayer);
        });
      });

      container.appendChild(pageWrapper);
    });
  }
});

function scrollToPage(pageNum) {
  // Scroll page into view smoothly
  const pages = document.getElementsByClassName('page-wrapper');
  if (pages[pageNum - 1]) {
    pages[pageNum - 1].scrollIntoView({ behavior: 'smooth' });
  }
}
