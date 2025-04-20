// Game elements
const car = document.getElementById('car');
const map = document.getElementById('map');
const siteInfo = document.getElementById('site-info');
const destinations = document.querySelectorAll('.destination');

// Car properties
let carPos = { x: 400, y: 300 };
let carAngle = 0;
let carSpeed = 0;
const maxSpeed = 8;
const acceleration = 0.15;
const deceleration = 0.03;
const turningSpeed = 3;

// Game state
const keys = {};
let activeDestination = null;
let lastEffectTime = 0;

// Initialize car position
updateCarPosition();

// Event listeners
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

destinations.forEach(dest => {
    dest.addEventListener('click', () => {
        selectDestination(dest);
    });
});

// Game loop
function gameLoop() {
    moveCarByKeys();
    checkCollisions();
    createEffects();
    requestAnimationFrame(gameLoop);
}

function moveCarByKeys() {
    // Acceleration and deceleration
    if (keys['ArrowUp'] || keys['w']) {
        carSpeed = Math.min(carSpeed + acceleration, maxSpeed);
    } else if (keys['ArrowDown'] || keys['s']) {
        carSpeed = Math.max(carSpeed - acceleration, -maxSpeed);
    } else {
        // Gradually slow down when no key is pressed
        if (carSpeed > 0) {
            carSpeed = Math.max(0, carSpeed - deceleration);
        } else if (carSpeed < 0) {
            carSpeed = Math.min(0, carSpeed + deceleration);
        }
    }
    
    // Turn the car
    if (keys['ArrowLeft'] || keys['a']) {
        carAngle -= turningSpeed * (carSpeed / maxSpeed);
    }
    if (keys['ArrowRight'] || keys['d']) {
        carAngle += turningSpeed * (carSpeed / maxSpeed);
    }
    
    // Only move if there's speed
    if (carSpeed !== 0) {
        const radians = carAngle * Math.PI / 180;
        carPos.x += Math.sin(radians) * carSpeed;
        carPos.y -= Math.cos(radians) * carSpeed;
        
        // Map boundaries
        carPos.x = Math.max(20, Math.min(map.offsetWidth - 20, carPos.x));
        carPos.y = Math.max(10, Math.min(map.offsetHeight - 10, carPos.y));
        
        updateCarPosition();
    }
    
    // Enter key to select destination
    if (keys['Enter'] && activeDestination) {
        selectDestination(activeDestination);
        keys['Enter'] = false;
    }
}

function updateCarPosition() {
    car.style.left = `${carPos.x - car.offsetWidth / 2}px`;
    car.style.top = `${carPos.y - car.offsetHeight / 2}px`;
    car.style.transform = `rotate(${carAngle + 90}deg)`;
}

function checkCollisions() {
    // Reset active destination
    if (activeDestination) {
        activeDestination.classList.remove('active');
        activeDestination = null;
    }
    
    // Check for collisions with destinations
    destinations.forEach(dest => {
        const destRect = dest.getBoundingClientRect();
        const carRect = car.getBoundingClientRect();
        
        if (
            carRect.left < destRect.right &&
            carRect.right > destRect.left &&
            carRect.top < destRect.bottom &&
            carRect.bottom > destRect.top
        ) {
            dest.classList.add('active');
            activeDestination = dest;
            siteInfo.textContent = `Current location: ${dest.querySelector('div:last-child').textContent}`;
        }
    });
    
    if (!activeDestination) {
        siteInfo.textContent = 'Drive the car to a location to select it';
    }
}

function selectDestination(dest) {
    const destId = dest.getAttribute('data-id');
    const destName = dest.querySelector('div:last-child').textContent;
    
    // Show selection
    siteInfo.innerHTML = `<strong>Selected: ${destName}</strong><br>
                         (This is where site navigation would happen)`;
                         
    // Flash effect
    dest.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    setTimeout(() => {
        dest.style.backgroundColor = 'rgba(100, 100, 200, 0.9)';
    }, 200);
    
    // In a real app, you would navigate to the relevant page here
    console.log(`Selected destination: ${destId}`);
}

function createEffects() {
    // Create car movement effects (dust/smoke)
    if (Math.abs(carSpeed) > 1 && Date.now() - lastEffectTime > 100) {
        // Calculate position behind the car
        const radians = carAngle * Math.PI / 180;
        const effectX = carPos.x - Math.sin(radians) * 20;
        const effectY = carPos.y + Math.cos(radians) * 20;
        
        const effect = document.createElement('div');
        effect.className = 'car-effect';
        effect.style.left = `${effectX - 5}px`;
        effect.style.top = `${effectY - 5}px`;
        map.appendChild(effect);
        
        // Animation
        let opacity = 0.3;
        let size = 5;
        const effectInterval = setInterval(() => {
            size += 0.5;
            opacity -= 0.02;
            effect.style.width = `${size}px`;
            effect.style.height = `${size}px`;
            effect.style.left = `${effectX - size/2}px`;
            effect.style.top = `${effectY - size/2}px`;
            effect.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(effectInterval);
                effect.remove();
            }
        }, 50);
        
        lastEffectTime = Date.now();
    }
}

// Start the game
gameLoop();