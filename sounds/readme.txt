SOUND EFFECTS DIRECTORY

This directory is reserved for future sound effect files.

To add real sound effects to the game:

1. Download or create sound effect files in .mp3 or .wav format
2. Name them according to their use:
   - button.mp3 - Button click sounds
   - whistle.mp3 - Referee whistle
   - kick.mp3 - Kicking the ball
   - pass.mp3 - Passing the ball
   - shoot.mp3 - Shooting at goal
   - goal.mp3 - Goal celebration
   - crowd.mp3 - Crowd cheering
   - selection.mp3 - Item selection
   - success.mp3 - Success notification

3. Add the following code to script.js to play actual sounds:

function playSound(soundType) {
    const soundFile = `sounds/${soundType}.mp3`;
    const audio = new Audio(soundFile);
    audio.volume = 0.5; // Adjust volume
    audio.play().catch(e => console.log('Sound play error:', e));
}

For now, the game uses console.log to simulate sound effects.
