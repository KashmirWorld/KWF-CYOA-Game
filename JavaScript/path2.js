// path2.js
document.addEventListener('DOMContentLoaded', () => {
  RainforestGame.initState(100, 0);
  RainforestGame.updateUI();

  // Timer - FIXED: store interval ID to clear it
  let timeLeft = 10;
  const timerElement = document.getElementById('timer');
  const countdown = setInterval(() => {  // Now 'countdown' is accessible
    if (timeLeft <= 0) {
      clearInterval(countdown);
      window.location.href = "story3.html";
    } else {
      timerElement.textContent = `00:${String(timeLeft).padStart(2, '0')}`;
      timeLeft--;
    }
  }, 1000);

  // Costs matching your Ink logic
  const COSTS = {
    'deploy-sensors-btn': { credits: 30, data: 10, href: 'video6.html' },     // Deploy Sensors
    'collect-data-btn': { credits: 5, data: 5, href: 'video3.html' },        // Collect Environmental Data
    'run-sim-btn': { credits: 10, data: 3, href: 'video5.html' }            // Run Simulations
  };

  // Button handlers - FIXED: add href to COSTS, disable logic
  Object.entries(COSTS).forEach(([btnId, cost]) => {
    const btn = document.getElementById(btnId);
    if (!btn) {
      console.warn(`Button #${btnId} not found`);
      return;
    }

    // Disable if can't afford
    if (!RainforestGame.canAfford(cost.credits)) {
      btn.disabled = true;
      btn.title = `Need ${cost.credits} credits (have ${RainforestGame.getCredits()})`;
      return;
    }

    // Click handler
    btn.addEventListener('click', () => {
      if (RainforestGame.spendCredits(cost.credits)) {
        RainforestGame.addData(cost.data);
        RainforestGame.updateUI();
        window.location.href = cost.href;  // FIXED: use actual href
      } else {
        alert("Not enough credits!");
      }
    });
  });

  // Hover audio - FIXED: moved inside DOMContentLoaded
  const hoverAudioMap = {
    'deploy-sensors-btn': 'DeploySensorsAudio',
    'collect-data-btn': 'CollectEnvironmentalDataAudio',
    'run-sim-btn': 'runSimulationsAudio'
  };

  Object.entries(hoverAudioMap).forEach(([btnId, audioId]) => {
    const btn = document.getElementById(btnId);
    const audio = document.getElementById(audioId);
    if (!btn || !audio) {
      console.warn(`Audio setup failed for ${btnId}: ${audioId}`);
      return;
    }

    btn.addEventListener('mouseenter', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });
    btn.addEventListener('mouseleave', () => {
      audio.pause();
      audio.currentTime = 0;
    });
  });

  // Sound overlay
  const soundOverlay = document.getElementById('enable-sound-container');
  if (soundOverlay) {
    soundOverlay.addEventListener('click', () => {
      document.querySelectorAll('audio').forEach(a => {
        a.play().then(() => {
          a.pause();
          a.currentTime = 0;
        }).catch(() => {});
      });
      soundOverlay.style.opacity = '0';
      setTimeout(() => soundOverlay.remove(), 400);
    });
  }
});
