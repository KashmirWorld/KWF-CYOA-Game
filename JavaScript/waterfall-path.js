// waterfall-path.js
// Handles Waterfall Decision branching logic

document.addEventListener('DOMContentLoaded', () => {
  console.log('Waterfall Path loaded');
  
  setupWaterfallChoices();
  setupTimer();
  setupAudioEffects();
  checkUnlocks();
});

function setupWaterfallChoices() {
  const bioacousticBtn = document.getElementById('bioacoustic-btn');
  const droneBtn = document.getElementById('drone-btn');
  const ignoreBtn = document.getElementById('ignore-btn');
  const followBtn = document.getElementById('follow-sound-btn');

  // Bioacoustic Recorder (-20 Credits, +2 Data)
  if (bioacousticBtn) {
    bioacousticBtn.addEventListener('click', () => {
      if (RainforestGame.canAfford(20)) {
        playAudio('bioacousticAudio');
        RainforestGame.spendCredits(20);
        RainforestGame.addData(2);
        showTransition('bioacoustic-recorder.html');
      } else {
        showInsufficientFunds();
      }
    });
  }

  // Deploy Drone (-20 Credits, +1 Data)
  if (droneBtn) {
    droneBtn.addEventListener('click', () => {
      if (RainforestGame.canAfford(20)) {
        playAudio('droneAudio');
        RainforestGame.spendCredits(20);
        RainforestGame.addData(1);
        showTransition('deploy-drone.html');
      } else {
        showInsufficientFunds();
      }
    });
  }

  // Ignore Sound (free)
  if (ignoreBtn) {
    ignoreBtn.addEventListener('click', () => {
      showTransition('ignore-sound.html');
    });
  }

  // Follow Sound (free, +3 Data)
  if (followBtn) {
    followBtn.addEventListener('click', () => {
      RainforestGame.addData(3);
      showTransition('follow-sound.html');
    });
  }
}

function checkUnlocks() {
  // Disable paid buttons if can't afford (updated for new layout)
  if (!RainforestGame.canAfford(20)) {
    ['bioacoustic-btn', 'drone-btn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.title = '20 Credits required';
      }
    });
  }
}

function setupTimer() {
  let timeLeft = 15;
  const timerEl = document.getElementById('timer');
  
  const timer = setInterval(() => {
    timeLeft--;
    if (timerEl) {
      timerEl.textContent = `${timeLeft.toString().padStart(2, '0')}:00`;
    }
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById('ignore-btn')?.click();
    }
  }, 1000);
}

function setupAudioEffects() {
  const ambient = document.getElementById('waterfallAmbient');
  if (ambient) {
    ambient.volume = 0.3;
    ambient.loop = true;
    ambient.play().catch(() => {});
  }
}

function playAudio(audioId, volume = 1.0) {
  const audio = document.getElementById(audioId);
  if (audio) {
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

function showTransition(destination) {
  const container = document.querySelector('.path-container');
  container.style.opacity = '0.7';
  
  setTimeout(() => {
    RainforestGame.updateUI();
    window.location.href = destination;
  }, 500);
}

function showInsufficientFunds() {
  const btn = event?.target;
  if (btn) {
    btn.style.animation = 'shake 0.5s';
    setTimeout(() => btn.style.animation = '', 500);
  }
}

// Inject shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }
`;
document.head.appendChild(style);
