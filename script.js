// Global state
const gameState = {
    selectedTeam: null,
    customPlayers: [],
    savedPlayers: [],
    savedJerseys: [],
    scores: {
        your: 0,
        opponent: 0,
        goalCount: 0
    },
    matchTime: 0,
    currentHair: 1
};

// Game state variables
let matchInterval = null;
let playerAnimations = [];

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Stop match timer if leaving game
    if (screenId !== 'quickMatch' && matchInterval) {
        clearInterval(matchInterval);
        playerAnimations.forEach(anim => clearInterval(anim));
        playerAnimations = [];
    }
    
    // Show selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.add('fade-in');
    }
    
    // Play sound effect
    playSound('button');
}

// Team selection
function selectTeam(teamName, primaryColor) {
    gameState.selectedTeam = { name: teamName, color: primaryColor };
    
    const selectedInfo = document.getElementById('selectedTeam');
    selectedInfo.innerHTML = `
        <h3>✅ Selected: ${teamName}</h3>
        <p>Color: ${primaryColor}</p>
        <button class="save-btn" onclick="customizeJersey()">Customize Jersey</button>
    `;
    
    playSound('selection');
    
    // Show jersey customization option
    setTimeout(() => {
        selectedInfo.style.display = 'block';
    }, 100);
}

function customizeJersey() {
    showScreen('jerseyCustomization');
}

// Jersey customization
function updateJersey() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    
    const jerseyView = document.getElementById('jerseyView');
    jerseyView.innerHTML = `
        <div class="jersey-shirt" style="background: ${primaryColor};"></div>
        <div class="jersey-shorts" style="background: ${primaryColor};"></div>
    `;
}

function selectPattern(pattern) {
    document.querySelectorAll('.pattern-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const jerseyShirt = document.querySelector('.jersey-shirt');
    switch(pattern) {
        case 'stripes':
            jerseyShirt.style.background = `linear-gradient(90deg, #fff 0%, #fff 50%, ${document.getElementById('primaryColor').value} 50%, ${document.getElementById('primaryColor').value} 100%)`;
            break;
        case 'checker':
            jerseyShirt.style.background = `repeating-linear-gradient(45deg, ${document.getElementById('primaryColor').value}, ${document.getElementById('primaryColor').value} 20px, #fff 20px, #fff 40px)`;
            break;
        case 'gradient':
            jerseyShirt.style.background = `linear-gradient(135deg, ${document.getElementById('primaryColor').value}, ${document.getElementById('secondaryColor').value})`;
            break;
        default:
            jerseyShirt.style.background = document.getElementById('primaryColor').value;
    }
}

function selectShoe(shoeType) {
    document.querySelectorAll('.shoe-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    playSound('selection');
}

function saveJersey() {
    playSound('success');
    alert('✅ Jersey saved successfully!');
}

// Player customization
function updatePlayer() {
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const skinTone = document.getElementById('skinTone').value;
    const speed = document.getElementById('speed').value;
    const shooting = document.getElementById('shooting').value;
    const passing = document.getElementById('passing').value;
    
    // Update display values
    document.getElementById('heightValue').textContent = height;
    document.getElementById('weightValue').textContent = weight;
    document.getElementById('speedValue').textContent = speed;
    document.getElementById('shootingValue').textContent = shooting;
    document.getElementById('passingValue').textContent = passing;
    
    // Update skin tone
    const skinTones = ['#fdbcb4', '#e0ac9b', '#c68642', '#8d5524', '#654321'];
    const playerHead = document.querySelector('.player-head');
    playerHead.style.background = skinTones[parseInt(skinTone) - 1];
    
    // Update player size based on height/weight
    const playerAvatar = document.querySelector('.player-avatar');
    const scaleFactor = height / 175;
    playerAvatar.style.transform = `scale(${scaleFactor})`;
}

function selectHair(style) {
    gameState.currentHair = style;
    document.querySelectorAll('.hair-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const playerHair = document.querySelector('.player-hair');
    const hairColors = ['#2c1810', '#8b4513', '#ffd700', '#000000'];
    
    switch(style) {
        case 1: // Short
            playerHair.style.width = '110px';
            playerHair.style.height = '40px';
            playerHair.style.background = hairColors[0];
            playerHair.style.borderRadius = '50px 50px 0 0';
            break;
        case 2: // Bald
            playerHair.style.width = '100px';
            playerHair.style.height = '5px';
            playerHair.style.background = 'rgba(0,0,0,0)';
            break;
        case 3: // Long
            playerHair.style.width = '130px';
            playerHair.style.height = '60px';
            playerHair.style.background = hairColors[1];
            playerHair.style.borderRadius = '50px';
            break;
        case 4: // Dreads
            playerHair.style.width = '120px';
            playerHair.style.height = '70px';
            playerHair.style.background = hairColors[0];
            playerHair.style.borderRadius = '100%';
            break;
    }
}

function savePlayer() {
    const playerData = {
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        position: document.getElementById('position').value,
        speed: document.getElementById('speed').value,
        shooting: document.getElementById('shooting').value,
        passing: document.getElementById('passing').value,
        hair: gameState.currentHair
    };
    
    gameState.savedPlayers.push(playerData);
    playSound('success');
    alert('✅ Player saved successfully!');
}

// Game functions

function startQuickMatch() {
    showScreen('quickMatch');
    gameState.matchTime = 0;
    gameState.scores.your = 0;
    gameState.scores.opponent = 0;
    updateMatchDisplay();
    
    // Clear any existing intervals
    if (matchInterval) clearInterval(matchInterval);
    
    matchInterval = setInterval(() => {
        gameState.matchTime++;
        updateMatchDisplay();
    }, 1000);
    
    playSound('whistle');
    startGameAnimations();
    
    // Reset ball position
    resetBall();
}

function updateMatchDisplay() {
    const minutes = Math.floor(gameState.matchTime / 60);
    const seconds = gameState.matchTime % 60;
    document.getElementById('matchTime').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    document.getElementById('teamScore').textContent = 
        `${gameState.scores.your} - ${gameState.scores.opponent}`;
}

function startGameAnimations() {
    // Clear existing animations
    playerAnimations.forEach(anim => clearInterval(anim));
    playerAnimations = [];
    
    const players = document.querySelectorAll('.player');
    players.forEach(player => {
        const animId = animatePlayer(player);
        playerAnimations.push(animId);
    });
}

function animatePlayer(player) {
    const field = document.querySelector('.field');
    const fieldWidth = field.clientWidth;
    const fieldHeight = field.clientHeight;
    
    return setInterval(() => {
        const randomX = Math.random() * (fieldWidth - 50);
        const randomY = Math.random() * (fieldHeight - 50);
        
        player.style.transition = 'all 2s ease-in-out';
        player.style.left = randomX + 'px';
        player.style.top = randomY + 'px';
    }, 3000);
}

function kickBall() {
    const ball = document.getElementById('ball');
    const field = document.querySelector('.field');
    
    playSound('kick');
    
    ball.style.animation = 'ballMove 0.5s ease';
    setTimeout(() => {
        ball.style.left = Math.random() * (field.clientWidth - 40) + 'px';
        ball.style.top = Math.random() * (field.clientHeight - 40) + 'px';
        ball.style.animation = '';
        
        // Add some visual feedback
        ball.style.transform = 'scale(1.2)';
        setTimeout(() => {
            ball.style.transform = 'scale(1)';
        }, 200);
    }, 500);
}

function passBall() {
    const ball = document.getElementById('ball');
    const players = document.querySelectorAll('.player');
    
    playSound('pass');
    
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    const playerRect = randomPlayer.getBoundingClientRect();
    const fieldRect = document.querySelector('.field').getBoundingClientRect();
    
    const x = playerRect.left - fieldRect.left + 25;
    const y = playerRect.top - fieldRect.top + 25;
    
    ball.style.transition = 'all 0.5s ease';
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';
    
    setTimeout(() => {
        ball.style.transition = '';
    }, 500);
}

function shootGoal() {
    playSound('shoot');
    
    const ball = document.getElementById('ball');
    const goal = document.querySelector('.goal.right');
    const goalRect = goal.getBoundingClientRect();
    const fieldRect = document.querySelector('.field').getBoundingClientRect();
    
    // Calculate goal position
    const x = goalRect.left - fieldRect.left + 75;
    const y = goalRect.top - fieldRect.top + 50;
    
    ball.style.transition = 'all 1s ease-out';
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';
    
    setTimeout(() => {
        // Randomly decide if goal is scored
        const isGoal = Math.random() > 0.3;
        
        if (isGoal) {
            gameState.scores.your++;
            playSound('goal');
            celebrateGoal();
            showGoalMessage('🎉 GOAL!');
        } else {
            playSound('whistle');
            showGoalMessage('❌ Saved by the goalkeeper!');
            resetBall();
        }
        
        updateMatchDisplay();
        ball.style.transition = '';
        
        // Auto reset ball after 2 seconds
        setTimeout(() => {
            resetBall();
        }, 2000);
    }, 1000);
    
    // Occasionally opponent scores
    setTimeout(() => {
        if (Math.random() > 0.8 && gameState.matchTime > 10) {
            gameState.scores.opponent++;
            updateMatchDisplay();
            showGoalMessage('😞 Opponent scored!');
        }
    }, 2000);
}

function celebrateGoal() {
    const field = document.getElementById('field');
    field.style.animation = 'goal 0.5s';
    
    // Create confetti particles
    createConfetti();
    
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            z-index: 9999;
            pointer-events: none;
            border-radius: 50%;
            animation: confettiFall ${2 + Math.random()}s linear;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000 + Math.random() * 1000);
    }
}

function resetBall() {
    const ball = document.getElementById('ball');
    ball.style.left = '50%';
    ball.style.top = '50%';
}

function showGoalMessage(message) {
    // Create message element
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(50,50,50,0.9));
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 2rem;
        font-weight: bold;
        z-index: 1000;
        animation: fadeIn 0.3s;
        box-shadow: 0 10px 40px rgba(255,255,255,0.3);
        border: 3px solid rgba(255,255,255,0.5);
    `;
    document.body.appendChild(msg);
    
    // Add pulse animation
    msg.style.animation = 'fadeIn 0.3s, pulse 2s infinite';
    
    setTimeout(() => {
        msg.style.animation = 'fadeOut 0.3s';
        setTimeout(() => msg.remove(), 300);
    }, 1500);
}

// Penalty shootout
function shootPenalty() {
    const power = parseInt(document.getElementById('powerRange').value);
    const direction = parseFloat(document.getElementById('directionRange').value);
    
    playSound('shoot');
    
    const ball = document.getElementById('penaltyBall');
    const goal = document.querySelector('.penalty-goal');
    const goalRect = goal.getBoundingClientRect();
    
    // Calculate shot direction
    const goalWidth = 400;
    const targetX = goalWidth / 2 + (direction * goalWidth / 2);
    
    ball.style.transition = 'all 0.8s ease-out';
    ball.style.left = '50%';
    ball.style.top = 'calc(60% - ' + power + 'px)';
    
    setTimeout(() => {
        const isGoal = Math.random() > 0.2;
        
        if (isGoal) {
            gameState.scores.your++;
            playSound('goal');
            document.getElementById('yourScore').textContent = gameState.scores.your;
            alert('🎉 GOAL!');
        } else {
            playSound('whistle');
            alert('❌ Saved by the goalkeeper!');
        }
        
        resetPenaltyBall();
    }, 800);
}

function resetPenaltyBall() {
    const ball = document.getElementById('penaltyBall');
    ball.style.left = '50%';
    ball.style.top = '60%';
}

document.getElementById('powerRange').addEventListener('input', (e) => {
    document.getElementById('powerDisplay').textContent = e.target.value;
});

document.getElementById('directionRange').addEventListener('input', (e) => {
    const direction = e.target.value;
    const directions = ['Left', 'Center-Left', 'Center', 'Center-Right', 'Right'];
    const index = Math.floor((parseFloat(direction) + 1) * 2.5);
    document.getElementById('directionDisplay').textContent = directions[index] || 'Center';
});

// Tournament
function startTournament() {
    playSound('whistle');
    alert('🏆 Tournament starting! Get ready for intense matches!');
    // In a full implementation, this would trigger actual tournament matches
}

// Sound effects with Web Audio API
let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Generate sound with Web Audio API
function generateSound(frequency, duration, type = 'sine', volume = 0.3) {
    if (!audioContext) initAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Sound effects
function playSound(soundType) {
    initAudioContext();
    
    switch(soundType) {
        case 'button':
            generateSound(800, 0.1, 'sine', 0.2);
            break;
        case 'selection':
            generateSound(1000, 0.15, 'triangle', 0.25);
            break;
        case 'success':
            generateSound(523, 0.1, 'sine', 0.3);
            setTimeout(() => generateSound(659, 0.1, 'sine', 0.3), 100);
            setTimeout(() => generateSound(784, 0.2, 'sine', 0.3), 200);
            break;
        case 'whistle':
            generateSound(1500, 0.3, 'sawtooth', 0.4);
            setTimeout(() => generateSound(2000, 0.2, 'sawtooth', 0.4), 300);
            break;
        case 'kick':
            generateSound(100, 0.15, 'square', 0.5);
            break;
        case 'pass':
            generateSound(300, 0.1, 'triangle', 0.3);
            break;
        case 'shoot':
            generateSound(400, 0.2, 'triangle', 0.6);
            setTimeout(() => generateSound(600, 0.15, 'triangle', 0.4), 200);
            break;
        case 'goal':
            // Crowd cheer sound
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    generateSound(300 + Math.random() * 200, 0.3, 'sawtooth', 0.3);
                }, i * 100);
            }
            // Whistle after goal
            setTimeout(() => {
                generateSound(1500, 0.5, 'sawtooth', 0.5);
            }, 600);
            break;
        case 'crowd':
            generateSound(200 + Math.random() * 100, 0.5, 'sawtooth', 0.2);
            break;
    }
    
    // Add visual feedback
    document.body.style.animation = 'none';
    setTimeout(() => {
        document.body.style.animation = 'goal 0.3s';
    }, 10);
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen) return;
    
    // Check if we're in quick match screen
    if (activeScreen.id === 'quickMatch') {
        switch(event.key) {
            case ' ': // Space bar
                event.preventDefault();
                kickBall();
                break;
            case 'p':
            case 'P':
                event.preventDefault();
                passBall();
                break;
            case 's':
            case 'S':
                event.preventDefault();
                shootGoal();
                break;
            case 'Escape':
                event.preventDefault();
                showScreen('mainMenu');
                break;
        }
    }
    
    // Check if we're in penalty screen
    if (activeScreen.id === 'penalty') {
        switch(event.key) {
            case ' ': // Space bar
                event.preventDefault();
                shootPenalty();
                break;
            case 'Escape':
                event.preventDefault();
                showScreen('mainMenu');
                break;
        }
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen) return;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    // Only process swipes in game screens
    if (activeScreen.id === 'quickMatch') {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    kickBall();
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    passBall();
                } else {
                    shootGoal();
                }
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 FOOTBALL MANIA - Game initialized!');
    
    // Set up event listeners
    document.getElementById('height').addEventListener('input', updatePlayer);
    document.getElementById('weight').addEventListener('input', updatePlayer);
    document.getElementById('skinTone').addEventListener('input', updatePlayer);
    document.getElementById('speed').addEventListener('input', updatePlayer);
    document.getElementById('shooting').addEventListener('input', updatePlayer);
    document.getElementById('passing').addEventListener('input', updatePlayer);
    
    // Initialize player preview
    updatePlayer();
    
    // Auto-update penalty displays
    document.getElementById('powerDisplay').textContent = document.getElementById('powerRange').value;
    document.getElementById('directionDisplay').textContent = 'Center';
    
    // Show controls info
    showControlsInfo();
});

function showControlsInfo() {
    // Add controls info to quick match screen
    const quickMatchScreen = document.getElementById('quickMatch');
    const controlsInfo = document.createElement('div');
    controlsInfo.className = 'controls-info';
    controlsInfo.innerHTML = `
        <div class="controls-title">🎮 Controls</div>
        <div class="controls-row">
            <span>💻 <strong>Keyboard:</strong></span>
            <span>SPACE = Kick</span>
            <span>P = Pass</span>
            <span>S = Shoot</span>
            <span>ESC = Menu</span>
        </div>
        <div class="controls-row">
            <span>📱 <strong>Touch:</strong></span>
            <span>Swipe ↔️ = Kick</span>
            <span>Swipe ⬆️ = Shoot</span>
            <span>Swipe ⬇️ = Pass</span>
        </div>
    `;
    quickMatchScreen.appendChild(controlsInfo);
}
