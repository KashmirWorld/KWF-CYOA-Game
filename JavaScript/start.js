// start.js (Game initialization)
document.addEventListener('DOMContentLoaded', () => {
  // RESET GAME: Exactly your Ink start (80 credits, 0 data)
  RainforestGame.setCredits(80);
  RainforestGame.setData(0);
  RainforestGame.updateUI();

  // Splash screen fade-out
  window.addEventListener('load', () => {
    const splash = document.getElementById('splash');
    setTimeout(() => {
      splash.style.opacity = '0';
      setTimeout(() => splash.style.display = 'none', 500);
    }, 8500);
  });

  // Start button → video1.html
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      RainforestGame.updateUI(); // Final confirmation
      window.location.href = 'video1.html';
    });
  } else {
    console.warn('Start button (#start-btn) not found');
  }
});
