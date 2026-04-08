/* ============================================
   KwF Research Hub – Map Interactivity
   ============================================ */

const projectData = {
  uav: {
    title: 'UAV in Africa',
    desc: 'Anti-poaching drones supporting rangers across African terrain.'
  },
  mishell: {
    title: 'Sea Turtle Drone (MiSHELL)',
    desc: 'Autonomous drones monitoring nesting sea turtles on remote beaches.'
  },
  trinity: {
    title: 'Project Trinity',
    desc: 'Tracking and protecting Snow Leopards across the Himalayas.'
  },
  bioacoustics: {
    title: 'BioAcoustics Research',
    desc: 'AI-driven sound analysis to monitor rainforest ecosystem health.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('infoPanel');
  const panelTitle = document.getElementById('infoPanelTitle');
  const panelDesc = document.getElementById('infoPanelDesc');
  const markers = document.querySelectorAll('.map-marker');

  markers.forEach(marker => {
    const key = marker.dataset.project;
    const data = projectData[key];
    if (!data) return;

    marker.addEventListener('mouseenter', () => {
      panelTitle.textContent = data.title;
      panelDesc.textContent = data.desc;
      panel.classList.add('visible');
    });

    marker.addEventListener('mouseleave', () => {
      panel.classList.remove('visible');
    });
  });
});
