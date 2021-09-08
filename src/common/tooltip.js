import {MDCTooltip} from '@material/tooltip';

const probCleanOrphanTooltips = 0.07;

const currentTooltips = new Set();

// For each tooltip, if the element which is being described by it no longer
// exists, delete it.
function cleanOrphanTooltips() {
  return new Promise((res, rej) => {
    for (const tooltip of currentTooltips) {
      if (document.querySelector('[aria-describedby="' + tooltip.id + '"]') ===
          null) {
        currentTooltips.delete(tooltip);
        tooltip.remove();
      }
    }
    res();
  });
}

export function createPlainTooltip(srcElement, label, initTooltip = true) {
  if (srcElement.hasAttribute('aria-describedby')) {
    let tooltip =
        document.getElementById(srcElement.getAttribute('aria-describedby'));
    if (tooltip !== null) tooltip.remove();
  }

  let tooltip = document.createElement('div');
  let tooltipId;
  do {
    // Idea from: https://stackoverflow.com/a/44078785
    let randomId =
        Date.now().toString(36) + Math.random().toString(36).substring(2);
    tooltipId = 'TWPT_tooltip_' + randomId;
  } while (document.getElementById(tooltipId) !== null);
  tooltip.id = tooltipId;
  tooltip.classList.add('mdc-tooltip');
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('aria-hidden', 'true');

  let surface = document.createElement('div');
  surface.classList.add(
      'mdc-tooltip__surface', 'mdc-tooltip__surface-animation');
  surface.textContent = label;

  tooltip.append(surface);

  // In the Community Console we inject the tooltip into
  // #default-acx-overlay-container, and in TW directly into the body.
  var tooltipParent =
      document.getElementById('default-acx-overlay-container') ?? document.body;
  tooltipParent.append(tooltip);
  currentTooltips.add(tooltip);

  srcElement.setAttribute('aria-describedby', tooltipId);

  if (Math.random() < probCleanOrphanTooltips) cleanOrphanTooltips();

  if (initTooltip) return new MDCTooltip(tooltip);
  return tooltip;
}
