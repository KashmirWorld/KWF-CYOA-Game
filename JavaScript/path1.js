// path1.js
document.addEventListener('DOMContentLoaded', () => {
  RainforestGame.initState(100, 0);
  RainforestGame.updateUI();

  // Timer
  let timeLeft = 10;
  const timerElement = document.getElementById('timer');
  const exploreBtn = document.getElementById('explore-btn');
  const droneBtn = document.getElementById('drone-btn');
  const DRONE_COST = 50;

  const countdown = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdown);
      window.location.href = "story3.html";
    } else {
      timerElement.textContent = `00:0${timeLeft}`;
      timeLeft--;
    }
  }, 1000);

  // Explore (free)
  exploreBtn.addEventListener('click', () => {
    window.location.href = 'video2.html';
  });

  // Drone
  function refreshDroneButtonState() {
    const credits = RainforestGame.getCredits();
    droneBtn.disabled = credits < DRONE_COST;
    droneBtn.title = droneBtn.disabled ? 
      `Need ${DRONE_COST} credits (have ${credits})` : 
      `Costs ${DRONE_COST} (have ${credits})`;
  }

  refreshDroneButtonState();

  droneBtn.addEventListener('click', () => {
    if (!RainforestGame.canAfford(DRONE_COST)) {
      alert("Not enough credits!");
      return;
    }
    RainforestGame.spendCredits(DRONE_COST);
    RainforestGame.updateUI();
    window.location.href = 'video4.html';
  });
});
