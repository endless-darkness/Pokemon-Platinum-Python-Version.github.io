// Background GIF URL
const backgroundGif = 'images/0kkvgt5iqby61.gif';

// Handle Pokeball click to enter site
function initPokeballOverlay() {
    const overlay = document.getElementById('pokeballOverlay');
    const container = document.querySelector('.container');
    const bgMusic = document.getElementById('bgMusic');
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            // Fade out overlay
            overlay.classList.add('fade-out');
            
            // Show main content
            if (container) {
                container.style.display = 'flex';
            }
            
            // Play background music
            if (bgMusic) {
                bgMusic.play().catch(error => {
                    console.log('Failed to play audio:', error);
                });
            }
            
            // Remove overlay after animation
            setTimeout(() => {
                overlay.remove();
            }, 500);
        });
    }
}

// Function to preload the GIF
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
    });
}

// Function to set background with cache-busting to ensure GIF plays on every refresh
function setBackground() {
    const backgroundElement = document.getElementById('background');
    
    if (backgroundElement) {
        // Add timestamp to force reload the GIF on every page refresh
        const cacheBustedUrl = `${backgroundGif}?t=${Date.now()}`;
        
        console.log('Loading background GIF:', cacheBustedUrl);
        
        // Preload the GIF first
        preloadImage(cacheBustedUrl)
            .then(() => {
                backgroundElement.style.backgroundImage = `url('${cacheBustedUrl}')`;
                backgroundElement.style.opacity = '1';
                console.log('Background GIF successfully loaded');
            })
            .catch(() => {
                console.error('Failed to load background GIF:', backgroundGif);
                console.log('Falling back to solid color background');
            });
    } else {
        console.error('Background element not found');
    }
}

// Function to play background music
function playBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        // Attempt to play music (may require user interaction due to browser autoplay policies)
        bgMusic.play().catch(error => {
            console.log('Autoplay prevented. Music will play on user interaction:', error);
            // Play music on first user interaction
            document.body.addEventListener('click', () => {
                bgMusic.play().catch(e => console.error('Failed to play music:', e));
            }, { once: true });
        });
    }
}

// Set background when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setBackground();
        initPokeballOverlay();
    });
} else {
    // DOM is already ready
    setBackground();
    initPokeballOverlay();
}
