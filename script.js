// Array of background image URLs
const backgroundImages = [
    'images/background1.png',
    'images/background2.png',
    'images/background3.png',
    'images/background4.png'
];

// Function to set random background
function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const backgroundElement = document.getElementById('background');
    const selectedImage = backgroundImages[randomIndex];
    
    if (backgroundElement) {
        backgroundElement.style.backgroundImage = `url('${selectedImage}')`;
        console.log('Background set to:', selectedImage);
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
