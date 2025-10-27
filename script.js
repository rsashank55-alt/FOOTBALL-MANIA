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

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
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
let matchInterval;

function startQuickMatch() {
    showScreen('quickMatch');
    gameState.matchTime = 0;
    updateMatchDisplay();
    
    matchInterval = setInterval(() => {
        gameState.matchTime++;
        updateMatchDisplay();
    }, 1000);
    
    playSound('whistle');
    startGameAnimations();
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
    const players = document.querySelectorAll('.player');
    players.forEach(player => {
        animatePlayer(player);
    });
}

function animatePlayer(player) {
    const field = document.querySelector('.field');
    const fieldWidth = field.clientWidth;
    const fieldHeight = field.clientHeight;
    
    setInterval(() => {
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
        } else {
            playSound('whistle');
            resetBall();
        }
        
        updateMatchDisplay();
        ball.style.transition = '';
    }, 1000);
}

function celebrateGoal() {
    document.getElementById('field').style.animation = 'goal 0.5s';
    setTimeout(() => {
        document.getElementById('field').style.animation = '';
    }, 500);
}

function resetBall() {
    const ball = document.getElementById('ball');
    ball.style.left = '50%';
    ball.style.top = '50%';
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

// Sound effects simulation
const sounds = {
    button: () => console.log('🔊 Button sound'),
    selection: () => console.log('🔊 Selection sound'),
    success: () => console.log('🔊 Success sound'),
    whistle: () => console.log('🔊 Whistle sound'),
    kick: () => console.log('🔊 Kick sound'),
    pass: () => console.log('🔊 Pass sound'),
    shoot: () => console.log('🔊 Shoot sound'),
    goal: () => console.log('🔊 GOAL! Crowd erupts!'),
    crowd: () => console.log('🔊 Crowd cheering')
};

function playSound(soundType) {
    if (sounds[soundType]) {
        sounds[soundType]();
    }
    
    // Add visual feedback
    document.body.style.animation = 'none';
    setTimeout(() => {
        document.body.style.animation = 'goal 0.3s';
    }, 10);
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
});

// Quick match button handler
document.querySelectorAll('.menu-btn').forEach(btn => {
    if (btn.textContent.includes('QUICK MATCH')) {
        btn.addEventListener('click', startQuickMatch);
    }
});
