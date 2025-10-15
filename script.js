// Array of background image URLs
const backgroundImages = [
    'images/background1.png',
    'images/background2.png',
    'images/background3.png'
];

// Function to preload an image
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
    });
}

// Function to set random background
function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const backgroundElement = document.getElementById('background');
    const selectedImage = backgroundImages[randomIndex];
    
    if (backgroundElement) {
        console.log('Attempting to load background:', selectedImage);
        
        // Preload the image first
        preloadImage(selectedImage)
            .then(() => {
                backgroundElement.style.backgroundImage = `url('${selectedImage}')`;
                backgroundElement.style.opacity = '1';
                console.log('Background successfully loaded:', selectedImage);
            })
            .catch(() => {
                console.error('Failed to load background image:', selectedImage);
                console.log('Falling back to solid color background');
            });
    } else {
        console.error('Background element not found');
    }
}

// Set background when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setRandomBackground);
} else {
    // DOM is already ready
    setRandomBackground();
}

// Optional: Change background every 30 seconds
// Uncomment the following lines if you want the background to rotate automatically
/*
setInterval(() => {
    setRandomBackground();
}, 30000);
*/
