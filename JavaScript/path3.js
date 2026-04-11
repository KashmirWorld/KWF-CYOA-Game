// path3.js (Drone crash path)
document.addEventListener('DOMContentLoaded', () => {
  // Apply drone crash effect: -50 credits, +2 data (one-time)
  if (RainforestGame.getCredits() > 50) {  // Avoid going negative
    RainforestGame.spendCredits(50);
    RainforestGame.addData(2);
  }

  RainforestGame.updateUI();

  // Timer
  let timeLeft = 10;
  const timerElement = document.getElementById('timer');
  const countdown = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdown);
      window.location.href = "video7.html";  // Default timeout
    } else {
      timerElement.textContent = `00:${String(timeLeft).padStart(2, '0')}`;
      timeLeft--;
    }
  }, 1000);

  // Costs for this path (adjust as needed from your Ink logic)
  const COSTS = {
    'monitor-terrain-btn': { credits: 20, data: 8, href: 'video7.html' },
    'create-map-btn': { credits: 15, data: 12, href: 'video8.html' },
    'sentinel-species-btn': { credits: 25, data: 6, href: 'video9.html' }
  };

  // Button handlers
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

    // Click: spend credits, gain data, navigate
    btn.addEventListener('click', () => {
      if (RainforestGame.spendCredits(cost.credits)) {
        RainforestGame.addData(cost.data);
        RainforestGame.updateUI();
        window.location.href = cost.href;
      } else {
        alert("Not enough credits!");
      }
    });
  });
});
