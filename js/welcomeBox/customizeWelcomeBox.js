function initWelcomeBox(config) {
    const backgroundImg = config.backgroundImg?.[0];
    const hero = config.hero?.[0];
    const text = config.text?.[0];
    const attributions = config.attributions?.[0];

    const bgImg = document.getElementById('backgroundImage');
    const heroDiv = document.getElementById('hero');
    const textDiv = document.getElementById('welcomeText');
    const attributionsDiv = document.getElementById('attributions');

    // Set background image
    if (backgroundImg?.src) {
        bgImg.src = backgroundImg.src;
        bgImg.style.display = 'block';
    }

    // Set hero text
    if (hero?.text) {
        heroDiv.textContent = hero.text;
        heroDiv.style.color = hero.color || 'black';
        heroDiv.style.fontSize = hero.size ? `${hero.size}px` : '40px';
        if (hero.font) {
            heroDiv.style.fontFamily = hero.font;
        }
    }

    if (Array.isArray(config.text)) {
        textDiv.innerHTML = ''; // Clear previous content if any
        config.text.forEach(text => {
            if (text?.text) {
                const p = document.createElement('p');
                p.innerHTML = text.text;
                p.style.color = text.color || 'black';
                p.style.fontSize = text.size ? `${text.size}px` : '20px';
                if (text.font) {
                    p.style.fontFamily = text.font;
                }
                textDiv.appendChild(p);
            }
        });
    }

    if (Array.isArray(config.attributions)) {
        attributionsDiv.innerHTML = ''; // Clear previous content if any
        config.attributions.forEach(attr => {
            if (attr?.text) {
                const p = document.createElement('p');
                p.innerHTML = attr.text;
                p.style.color = attr.color || 'black';
                p.style.fontSize = attr.size ? `${attr.size}px` : '20px';
                if (attr.font) {
                    p.style.fontFamily = attr.font;
                }
                attributionsDiv.appendChild(p);
            }
        });
    }
}

function closeWelcomeBox() {
    document.getElementById('welcomeBox').style.display = 'none';
}

window.onload = () => initWelcomeBox(welcomeInfo);