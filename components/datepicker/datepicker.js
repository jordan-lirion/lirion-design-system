/* datepicker: [data-datepicker] — singleton popup, multiple instances */

const _DP_MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

function _dpFormat(y, m, d) {
  return `${d} ${_DP_MONTHS[m]} ${y}`;
}

/* Shared popup appended to <body> — escapes any overflow/stacking context */
const _dpPopup = document.createElement('div');
_dpPopup.className = 'datepicker__popup';
_dpPopup.style.cssText = 'display:none;position:fixed;z-index:300;';
_dpPopup.innerHTML = `
  <div class="datepicker__nav">
    <button class="btn btn--ghost btn--icon btn--sm" type="button" data-dp-prev>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <span class="datepicker__month-label"></span>
    <button class="btn btn--ghost btn--icon btn--sm" type="button" data-dp-next>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  </div>
  <div class="datepicker__weekdays">
    <span>Lu</span><span>Ma</span><span>Me</span><span>Je</span><span>Ve</span><span>Sa</span><span>Di</span>
  </div>
  <div class="datepicker__grid"></div>
`;
document.body.appendChild(_dpPopup);

let _dpActive = null;
let _dpCalYear, _dpCalMonth;

function _dpRender() {
  const grid  = _dpPopup.querySelector('.datepicker__grid');
  const label = _dpPopup.querySelector('.datepicker__month-label');
  label.textContent = `${_DP_MONTHS[_dpCalMonth]} ${_dpCalYear}`;

  const firstDay = new Date(_dpCalYear, _dpCalMonth, 1).getDay();
  const offset   = (firstDay + 6) % 7; /* Monday-first */
  const total    = new Date(_dpCalYear, _dpCalMonth + 1, 0).getDate();

  let html = '';
  for (let i = 0; i < offset; i++) html += '<span></span>';
  for (let d = 1; d <= total; d++) {
    const sel = _dpActive
      && d === _dpActive.selDay
      && _dpCalMonth === _dpActive.selMonth
      && _dpCalYear  === _dpActive.selYear;
    html += `<button type="button" class="btn ${sel ? 'btn--default' : 'btn--ghost'} btn--sm" data-day="${d}">${d}</button>`;
  }
  grid.innerHTML = html;
}

function _dpOpen(dp) {
  _dpActive  = dp;
  const now  = new Date();
  _dpCalYear  = dp.selYear  ?? now.getFullYear();
  _dpCalMonth = dp.selMonth ?? now.getMonth();

  /* If trigger lives inside a <dialog>, the popup must also be inside it —
     modal dialogs occupy the browser top layer, so body-level fixed elements
     are rendered below them regardless of z-index. */
  const dlg = dp.trigger.closest('dialog');
  const container = dlg ?? document.body;
  if (_dpPopup.parentElement !== container) container.appendChild(_dpPopup);

  _dpRender();
  const r = dp.trigger.getBoundingClientRect();
  _dpPopup.style.top  = (r.bottom + 6) + 'px';
  _dpPopup.style.left = r.left + 'px';
  _dpPopup.style.display = 'block';
  dp.isOpen = true;
}

function _dpClose() {
  _dpPopup.style.display = 'none';
  if (_dpActive) { _dpActive.isOpen = false; _dpActive = null; }
}

/* Month navigation */
_dpPopup.querySelector('[data-dp-prev]').addEventListener('click', e => {
  e.stopPropagation();
  if (--_dpCalMonth < 0) { _dpCalMonth = 11; _dpCalYear--; }
  _dpRender();
});
_dpPopup.querySelector('[data-dp-next]').addEventListener('click', e => {
  e.stopPropagation();
  if (++_dpCalMonth > 11) { _dpCalMonth = 0; _dpCalYear++; }
  _dpRender();
});

/* Day selection */
_dpPopup.addEventListener('click', e => {
  e.stopPropagation();
  const btn = e.target.closest('[data-day]');
  if (!btn || !_dpActive) return;
  _dpActive.selDay   = +btn.dataset.day;
  _dpActive.selMonth = _dpCalMonth;
  _dpActive.selYear  = _dpCalYear;
  const val = _dpActive.trigger.querySelector('.datepicker__value');
  if (val) {
    val.textContent = _dpFormat(_dpActive.selYear, _dpActive.selMonth, _dpActive.selDay);
    val.classList.add('is-set');
  }
  _dpClose();
});

/* Global click — open trigger or close popup */
document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-datepicker-trigger]');
  if (trigger) {
    const dpEl = trigger.closest('[data-datepicker]');
    if (!dpEl?._dp) return;
    dpEl._dp.isOpen ? _dpClose() : (_dpClose(), _dpOpen(dpEl._dp));
    return;
  }
  if (!_dpPopup.contains(e.target)) _dpClose();
});

/* Init all [data-datepicker] instances */
document.querySelectorAll('[data-datepicker]').forEach(el => {
  el._dp = {
    trigger:  el.querySelector('[data-datepicker-trigger]'),
    isOpen:   false,
    selYear:  null,
    selMonth: null,
    selDay:   null,
  };
});
