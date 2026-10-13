// Puts the visitor's own system first among the downloads, and runs the demo of the Clicks in the hero.

const GEARS = 24;
const PULSE_MS = 300;

function visitorSystem() {
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const agent = navigator.userAgent || '';
  // iPadOS reports itself as a Mac; it has a touch screen and no ClickShift for macOS.
  if (/iPhone|iPad|iPod|Android/i.test(agent) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1)) {
    return 'phone';
  }
  if (/Win/i.test(platform)) return 'windows';
  if (/Mac/i.test(platform)) return 'mac';
  return null;
}

function highlightDownloads() {
  const system = visitorSystem();
  if (system !== 'mac' && system !== 'windows') return;

  const row = document.querySelector('[data-downloads]');
  for (const button of row.querySelectorAll('[data-os]')) {
    const mine = button.dataset.os === system;
    button.classList.toggle('primary', mine);
    if (mine) row.prepend(button);
  }
  document.querySelector(`[data-card="${system}"]`)?.classList.add('yours');
}

function startRig() {
  const rig = document.querySelector('[data-rig]');
  if (!rig) return;

  const gearLabel = rig.querySelector('[data-gear]');
  const node = rig.querySelector('.node');
  let gear = Number(gearLabel.textContent);

  function shift(direction) {
    const bar = rig.querySelector(`[data-shift="${direction}"]`);
    const link = rig.querySelector(`[data-link="${direction}"]`);

    bar.classList.add('lit');
    setTimeout(() => bar.classList.remove('lit'), 160);

    // Restart the pulse even when the previous one is still travelling.
    link.classList.remove('fire');
    void link.offsetWidth;
    link.classList.add('fire');

    setTimeout(() => {
      gear = Math.min(GEARS, Math.max(1, gear + (direction === 'up' ? 1 : -1)));
      gearLabel.textContent = String(gear);
      node.classList.add('bump');
      setTimeout(() => node.classList.remove('bump'), 120);
    }, PULSE_MS);
  }

  // The drawing shifts by itself until the visitor presses a button.
  const script = ['up', 'up', 'down', 'up', 'down', 'down'];
  let step = 0;
  let demo = null;

  function stopDemo() {
    clearInterval(demo);
    demo = null;
  }

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    demo = setInterval(() => {
      if (document.hidden) return;
      shift(script[step++ % script.length]);
    }, 1700);
  }

  for (const bar of rig.querySelectorAll('[data-shift]')) {
    bar.addEventListener('click', () => {
      stopDemo();
      shift(bar.dataset.shift);
    });
  }
}

highlightDownloads();
startRig();
