// === Minigame 2: Audio Moth Placement ===
(function (game) {
  const gameRoot = document.getElementById("audio-moth-game");
  const timerEl = document.getElementById("am-timer-value");
  let remainingSeconds = 5 * 60; // 5 minutes
  let timerInterval = null;

  if (!gameRoot) return;

  const recorders = Array.from(
    gameRoot.querySelectorAll(".am-recorder")
  );
  const zones = Array.from(
    gameRoot.querySelectorAll(".am-drop-zone")
  );
  const feedbackEl = document.getElementById("am-feedback");
  const resetBtn = document.getElementById("am-reset-btn");
  const finishBtn = document.getElementById("am-finish-btn");
  const localDataEl = document.getElementById("am-data-value");

  // Popup
  const popup = document.getElementById("am-popup");
  const popupTitle = document.getElementById("am-popup-title");
  const popupBody = document.getElementById("am-popup-body");
  const popupClose = document.getElementById("am-popup-close");

  let draggedRecorder = null;
  const placements = new Map(); // zoneId -> recorderId
  const optimalZones = zones.filter(z => z.dataset.eval === "optimal");
  let localData = 0;

  function syncGlobalData(delta) {
    if (typeof game.addData === "function") {
      game.addData(delta);
    }
    if (typeof game.updateUI === "function") {
      game.updateUI();
    }
    localData += delta;
    if (localDataEl) {
      localDataEl.textContent = String(localData);
    }
  }

  // Initialize drag events
  recorders.forEach(rec => {
    rec.addEventListener("dragstart", onDragStart);
    rec.addEventListener("dragend", onDragEnd);
  });

  zones.forEach(zone => {
    zone.addEventListener("dragover", onDragOver);
    zone.addEventListener("dragenter", onDragEnter);
    zone.addEventListener("dragleave", onDragLeave);
    zone.addEventListener("drop", onDrop);
  });

  resetBtn.addEventListener("click", resetGame);
  finishBtn.addEventListener("click", finishGame);

  popupClose.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  startTimer();

  function onDragStart(e) {
    draggedRecorder = e.target;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedRecorder.id);
  }

  function onDragEnd() {
    zones.forEach(z => z.classList.remove("am-hover"));
    draggedRecorder = null;
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onDragEnter(e) {
    e.preventDefault();
    if (!draggedRecorder) return;
    e.currentTarget.classList.add("am-hover");
  }

  function onDragLeave(e) {
    e.currentTarget.classList.remove("am-hover");
  }

  function onDrop(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.remove("am-hover");

    if (!draggedRecorder) {
      const id = e.dataTransfer.getData("text/plain");
      draggedRecorder = document.getElementById(id);
      if (!draggedRecorder) return;
    }

    const zoneId = zone.dataset.zoneId;

    // Remove prior recorder from this zone, if any
    const existingRecorderId = placements.get(zoneId);
    if (existingRecorderId) {
      const existingRecorder = document.getElementById(existingRecorderId);
      if (existingRecorder) {
        existingRecorder.classList.remove("am-placed");
      }
    }

    // Place recorder into zone
    zone.innerHTML = "";
    zone.appendChild(draggedRecorder);
    draggedRecorder.classList.add("am-placed");
    placements.set(zoneId, draggedRecorder.id);

    evaluateSinglePlacement(zone, draggedRecorder);
  }

  function evaluateSinglePlacement(zone, recorder) {
    const evalType = zone.dataset.eval;
    const issue = zone.dataset.issue || "";
    zone.classList.remove("am-correct", "am-wrong");

    if (evalType === "optimal") {
      zone.classList.add("am-correct");
      const dataReward = Number(recorder.dataset.points || "1");
      syncGlobalData(dataReward);
      showPopup(
        "Excellent choice!",
        "This location captures wildlife corridors while staying protected from weather and out of sight from poachers."
      );
      feedbackEl.textContent =
        "Great placement! You’re balancing animal activity, weather protection, and safety.";
    } else if (evalType === "suboptimal") {
      zone.classList.add("am-wrong");
      showPopup(
        "Not ideal.",
        "This spot is only partially effective: " + issue
      );
      feedbackEl.textContent =
        "Consider how close the spot is to paths, water, and cover, plus how hidden and protected the recorder is.";
    } else {
      zone.classList.add("am-wrong");
      showPopup(
        "Not ideal.",
        "This spot is too problematic: " + issue
      );
      feedbackEl.textContent =
        "Try a location that is higher off the ground, better hidden, and shielded from direct rain and wind.";
    }
  }

  function showPopup(title, body) {
    popupTitle.textContent = title;
    popupBody.textContent = body;
    popup.classList.remove("hidden");
  }

  function resetGame() {
    placements.clear();
    localData = 0;
    if (localDataEl) localDataEl.textContent = "0";

    zones.forEach(zone => {
      zone.classList.remove("am-hover", "am-correct", "am-wrong");
      const label = document.createElement("span");
      label.className = "am-zone-label";
      label.textContent = zone.dataset.zoneId
        ? String.fromCharCode(64 + Number(zone.dataset.zoneId))
        : "?";
      zone.innerHTML = "";
      zone.appendChild(label);
    });

    recorders.forEach(rec => {
      rec.classList.remove("am-placed");
      const list = document.querySelector(".am-recorder-list");
      if (list && !list.contains(rec)) list.appendChild(rec);
    });

    feedbackEl.textContent = "Placements reset. Try again!";
  }

  function finishGame() {
  clearInterval(timerInterval);

  const optimalPlaced = optimalZones.filter(z => placements.has(z.dataset.zoneId));
  const totalOptimal = optimalZones.length;
  const correctCount = optimalPlaced.length;

  // Get total Data from game state
  const totalData = (typeof game.getData === 'function') ? game.getData() : 0;

  let passed = false;
  let endUrl = null;
  let message = '';

  if (totalData < 20) {
    passed = false;
    endUrl = 'failure.html';
    message = `Minigame complete. You placed ${correctCount}/${totalOptimal} recorders correctly.\n\nYour total Data is ${totalData} — expedition under-resourced. Check failure.html for next steps.`;
  } else if (totalData >= 20 && totalData <= 30) {
    passed = true;
    endUrl = 'partial_success.html';
    message = `Minigame complete. You placed ${correctCount}/${totalOptimal} recorders correctly.\n\nYour total Data is ${totalData} — partial success achieved. Continue to partial_success.html.`;
  } else if (totalData > 30) {
    passed = true;
    endUrl = 'success.html';
    message = `Minigame complete. You placed ${correctCount}/${totalOptimal} recorders correctly.\n\nYour total Data is ${totalData} — excellent results! Continue to success.html.`;
  }

  showPopup("Expedition Status", message);

  if (passed) {
    syncGlobalData(1); // optional completion bonus
    feedbackEl.textContent = `Success! Total Data: ${totalData}. Moving to ${endUrl}.`;
  } else {
    feedbackEl.textContent = `Expedition status: ${totalData} Data. Check ending for next steps.`;
  }

  // Override popup close to redirect
  popupClose.onclick = () => {
    popup.classList.add("hidden");
    window.location.href = endUrl;
  };
}
  function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      clearInterval(timerInterval);
      // Optional: auto-finish the game when time runs out
      finishGame();
    }
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  if (!timerEl) return;
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
}


  // Public helper to show/hide this minigame
  game.showAudioMothMinigame = function () {
    gameRoot.classList.remove("hidden");
  };

  game.hideAudioMothMinigame = function () {
    gameRoot.classList.add("hidden");
  };

})(window.RainforestGame || (window.RainforestGame = {}));
