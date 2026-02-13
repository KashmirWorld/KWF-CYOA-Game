// game-state.js
window.RainforestGame = window.RainforestGame || {};

(function(game) {
  const CREDITS_KEY = 'rainforest_credits';
  const DATA_KEY = 'rainforest_data';

  game.initState = function(defaultCredits = 100, defaultData = 0) {
    if (localStorage.getItem(CREDITS_KEY) === null) {
      localStorage.setItem(CREDITS_KEY, String(defaultCredits));
    }
    if (localStorage.getItem(DATA_KEY) === null) {
      localStorage.setItem(DATA_KEY, String(defaultData));
    }
  };

  game.getCredits = function() {
    return parseInt(localStorage.getItem(CREDITS_KEY) || '0', 10);
  };

  game.getData = function() {
    return parseInt(localStorage.getItem(DATA_KEY) || '0', 10);
  };

  game.setCredits = function(value) {
    localStorage.setItem(CREDITS_KEY, String(value));
  };

  game.setData = function(value) {
    localStorage.setItem(DATA_KEY, String(value));
  };

  game.addCredits = function(delta) {
    game.setCredits(game.getCredits() + delta);
  };

  game.addData = function(delta) {
    game.setData(game.getData() + delta);
  };

  game.canAfford = function(cost) {
    return game.getCredits() >= cost;
  };

  game.spendCredits = function(cost) {
    if (!game.canAfford(cost)) return false;
    game.setCredits(game.getCredits() - cost);
    return true;
  };

  game.updateUI = function() {
    const creditsEl = document.getElementById('credits-readout');
    const dataEl = document.getElementById('data-readout');
    if (creditsEl) creditsEl.textContent = `Credits: ${game.getCredits()}`;
    if (dataEl) dataEl.textContent = `Data: ${game.getData()}`;
  };

})(window.RainforestGame);
