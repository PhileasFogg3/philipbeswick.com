document.addEventListener("DOMContentLoaded", () => {
    customizeWelcomeBox();
});

function customizeWelcomeBox() {
    const box = document.getElementById('welcomeBox');
    const hero = document.getElementById('hero');
    const text = document.getElementById('welcomeText');
    const bgImg = document.getElementById('backgroundImage');
    const data = welcomeInfo;

    // Clear any old background styles on the box
    box.style.backgroundImage = 'none';
    box.style.backgroundColor = '';

    // Set hero text
    if (data.hero && data.hero.length > 0) {
        const heroData = data.hero[0];
        hero.innerText = heroData.text || '';

        if (heroData.color) {
            hero.style.color = heroData.color;
        }
        if (heroData.size) {
            hero.style.fontSize = `${heroData.size}`;
        }
        if (heroData.font) {
            hero.style.fontFamily = heroData.font;
        }
    }

    // Set image src, height, width
    if (data.backgroundImg && data.backgroundImg.length > 0) {
        const imgData = data.backgroundImg[0];
        bgImg.src = imgData.src || '';

        if (imgData.height) {
            bgImg.style.height = imgData.height;
        } else {
            bgImg.style.height = 'auto';
        }

        if (imgData.width) {
            bgImg.style.width = imgData.width;
            box.style.width = `calc(${imgData.width} + 40vw)`; // image width + 40px padding
        } else {
            bgImg.style.width = 'auto';
            box.style.width = 'auto';
        }
    } else {
        bgImg.style.display = 'none';
        box.style.width = 'auto';
    }


    // Set welcome text below image
    if (data.text && data.text.length > 0) {
        const textData = data.text[0];
        text.innerText = textData.text || '';

        if (textData.color) {
            text.style.color = textData.color;
        }
        if (textData.size) {
            text.style.fontSize = `${textData.size}`;
        }
        if (textData.font) {
            text.style.fontFamily = textData.font;
        }
    }
}