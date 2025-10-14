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
    
    backgroundElement.style.backgroundImage = `url('${selectedImage}')`;
}

// Set background when page loads
window.addEventListener('load', setRandomBackground);

// Optional: Change background every 30 seconds
// Uncomment the following lines if you want the background to rotate automatically
/*
setInterval(() => {
    setRandomBackground();
}, 30000);
*/
