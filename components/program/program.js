/* program: board collapse/expand + session-dot interactions + board/module management */

document.querySelectorAll('.board__toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const board = btn.closest('.board');
    if (!board) return;
    board.classList.toggle('is-collapsed');
    btn.setAttribute('aria-expanded', String(!board.classList.contains('is-collapsed')));
  });
});

/* Shared fixed-position menu for --todo dots (avoids overflow clipping from .boards) */
const _todoMenu = document.createElement('div');
_todoMenu.className = 'dropdown__menu dropdown__menu--fixed';
_todoMenu.setAttribute('role', 'menu');
_todoMenu.innerHTML = '<button class="dropdown__item" role="menuitem" data-action="to-test">Convertir en test de niveau</button>';
document.body.appendChild(_todoMenu);

let _activeTodo = null;

function _closeTodoMenu() {
  _todoMenu.style.display = 'none';
  _activeTodo = null;
}

/* Add "+ Ajouter une séance" button to every existing .module */
const _ADD_SVG = '<i data-lucide="plus"></i>';

function addSessionButton(module) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn--dash btn--full btn--sm btn--start';
  btn.setAttribute('data-action', 'add-session');
  btn.innerHTML = _ADD_SVG + ' Ajouter une séance';
  module.appendChild(btn);
}

document.querySelectorAll('.module').forEach(addSessionButton);
if (typeof lucide !== 'undefined') lucide.createIcons();

document.addEventListener('click', e => {
  /* Toggle --todo menu */
  const trigger = e.target.closest('.session-dot--todo');
  if (trigger) {
    if (_activeTodo === trigger) {
      _closeTodoMenu();
    } else {
      _closeTodoMenu();
      const r = trigger.getBoundingClientRect();
      _todoMenu.style.top  = (r.bottom + 6) + 'px';
      _todoMenu.style.left = r.left + 'px';
      _todoMenu.style.display = 'block';
      _activeTodo = trigger;
    }
    return;
  }

  /* Convert --todo → --test */
  if (e.target.closest('[data-action="to-test"]')) {
    if (_activeTodo) {
      const dot = document.createElement('span');
      dot.className = 'session-dot session-dot--test';
      const wrapper = _activeTodo.closest('[data-todo-wrapper]');
      (wrapper || _activeTodo).replaceWith(dot);
    }
    _closeTodoMenu();
    return;
  }

  /* Click outside → close */
  if (!_todoMenu.contains(e.target)) _closeTodoMenu();

  /* Add --todo dot to module */
  const addBtn = e.target.closest('[data-action="add-session"]');
  if (addBtn) {
    const dots = addBtn.closest('.module')?.querySelector('.module__dots');
    if (!dots) return;
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-todo-wrapper', '');
    wrapper.innerHTML = '<button class="session-dot session-dot--todo" type="button"></button>';
    dots.appendChild(wrapper);
  }
});

/* ============================================================
   BOARD & MODULE ACTIONS
   ============================================================ */

const _DOTS_SVG   = '<i data-lucide="ellipsis-vertical"></i>';
const _PLUS_SVG   = '<i data-lucide="plus"></i>';
const _HANDLE_SVG = '<i data-lucide="grip-vertical"></i>';
const _TRASH_SVG  = '<i data-lucide="trash-2"></i>';

let _deleteTarget  = null;
let _currentBoard  = null;

const _deleteDialog    = document.getElementById('dialog-delete');
const _addModuleDialog = document.getElementById('dialog-add-module');

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === 'complete-board') {
    const board = btn.closest('.board');
    if (!board) return;
    board.classList.add('board--completed');
    const dropdown = btn.closest('.dropdown');
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn btn--ghost btn--icon btn--sm';
    checkBtn.setAttribute('aria-label', 'Complété');
    checkBtn.innerHTML = '<i data-lucide="check"></i>';
    dropdown.replaceWith(checkBtn);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
  if (action === 'delete-board') {
    _deleteTarget = btn.closest('.board');
    _deleteDialog?.showModal();
  }
  if (action === 'complete-module') {
    const module = btn.closest('.module');
    if (!module) return;
    module.classList.add('module--completed');
    const dropdown = btn.closest('.dropdown');
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn btn--ghost btn--icon btn--sm';
    checkBtn.setAttribute('aria-label', 'Complété');
    checkBtn.innerHTML = '<i data-lucide="check"></i>';
    dropdown.replaceWith(checkBtn);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
  if (action === 'delete-module') {
    _deleteTarget = btn.closest('.module');
    _deleteDialog?.showModal();
  }
  if (action === 'add-module') {
    _currentBoard = btn.closest('.board');
    _addModuleDialog?.showModal();
  }
  if (action === 'remove-training') {
    btn.closest('.sortable__item')?.remove();
  }
});

/* ---- MODULE NUMBERING ---- */
function _renumberModules(board) {
  board.querySelectorAll('.board__content > .module').forEach((mod, i) => {
    const header = mod.querySelector('.module__header');
    let info = header.querySelector('.module__info');
    if (!info) {
      const tags = header.querySelector('.module__tags');
      info = document.createElement('div');
      info.className = 'module__info';
      header.insertBefore(info, tags);
      info.appendChild(tags);
    }
    let label = info.querySelector('[data-module-label]');
    if (!label) {
      label = document.createElement('p');
      label.className = 'module__meta';
      label.setAttribute('data-module-label', '');
      info.prepend(label);
    }
    label.textContent = `Module ${i + 1}`;
  });
}

/* ---- DELETE DIALOG ---- */
document.getElementById('btn-cancel-delete')?.addEventListener('click', () => {
  _deleteDialog.close();
  _deleteTarget = null;
});
document.getElementById('btn-confirm-delete')?.addEventListener('click', () => {
  if (_deleteTarget) {
    const _board = _deleteTarget.closest('.board');
    _deleteTarget.remove();
    _deleteTarget = null;
    if (_board) _renumberModules(_board);
  }
  _deleteDialog.close();
});
_deleteDialog?.addEventListener('click', e => {
  if (e.target === _deleteDialog) _deleteDialog.close();
});

/* ============================================================
   ADD MODULE DIALOG
   ============================================================ */

/* CATALOG — injected by the page via window._PROGRAM_CATALOG before this script runs */
const CATALOG = window._PROGRAM_CATALOG || [];

const _btnAddTraining = document.getElementById('btn-add-training');
const _trainingDrop   = document.getElementById('training-dropdown');
const _modalSortable  = document.getElementById('modal-sortable');

let _selectedIds  = [];
let _expandedId   = null;
let _modalDragSrc = null;

function _subLabel(min, sec, niveau) {
  let s = `${min} min`;
  if (+sec > 0) s += ` ${sec} s`;
  if (niveau) s += ` • ${niveau.split('•')[0].trim()}`;
  return s;
}

function _collapsedHTML(t, min, sec, niveau) {
  const _icon = t.cls.replace('training-icon--', '');
  return `
    <button class="sortable__handle" type="button" aria-label="Réordonner">${_HANDLE_SVG}</button>
    <img class="training-icon training-icon--sm" src="assets/trainings/${_icon}.svg" alt="${t.name}">
    <div class="sortable__body flex-fill">
      <span class="sortable__title">${t.name}</span>
      <span class="sortable__sub">${_subLabel(min, sec, niveau)}</span>
    </div>
    <button class="btn btn--ghost btn--icon btn--sm" type="button" aria-label="Supprimer" data-action="remove-training">${_TRASH_SVG}</button>`;
}

function _expandedHTML(t, min, sec, niveau) {
  const _icon = t.cls.replace('training-icon--', '');
  const minOpts = [0,1,2,3,4,5,10,15,20,30].map(v => `<option${+v===+min?' selected':''}>${v}</option>`).join('');
  const secOpts = [0,10,15,20,30,45].map(v => `<option${+v===+sec?' selected':''}>${v}</option>`).join('');
  const levels  = ['','Niveau 1','Niveau 2','Niveau 3 • /bu pu/ • BOT -30','Niveau 4','Niveau 5'];
  const nivOpts = levels.map(n => `<option value="${n}"${n===niveau?' selected':''}>${n||'— Aucun niveau —'}</option>`).join('');
  return `
    <div class="sortable__row">
      <button class="sortable__handle" type="button" aria-label="Réordonner">${_HANDLE_SVG}</button>
      <img class="training-icon training-icon--sm" src="assets/trainings/${_icon}.svg" alt="${t.name}">
      <div class="flex-fill"><span class="sortable__title">${t.name}</span></div>
      <button class="btn btn--ghost btn--icon btn--sm" type="button" aria-label="Supprimer" data-action="remove-training">${_TRASH_SVG}</button>
    </div>
    <div class="sortable__fields">
      <div>
        <p class="label">Durée (minutes)</p>
        <select class="select" data-field="min">${minOpts}</select>
      </div>
      <div>
        <p class="label">Durée (secondes)</p>
        <select class="select" data-field="sec">${secOpts}</select>
      </div>
      <div class="sortable__field--full">
        <p class="label">Niveau</p>
        <select class="select" data-field="niveau">${nivOpts}</select>
      </div>
    </div>`;
}

/* Training dropdown */
function _renderDrop() {
  if (!_btnAddTraining || !_trainingDrop) return;
  const program = _currentBoard?.querySelector('.board__title')?.textContent.trim() || '';
  const avail = CATALOG.filter(t => !_selectedIds.includes(t.id) && (!t.programs || t.programs.includes(program)));
  _trainingDrop.innerHTML = avail.length
    ? avail.map(t => `<button type="button" class="dropdown__item" data-add-training="${t.id}"><img class="training-icon training-icon--sm" src="assets/trainings/${t.cls.replace('training-icon--', '')}.svg" alt="${t.name}">${t.name}</button>`).join('')
    : `<p class="training-dropdown__empty">Aucun résultat</p>`;
  const r = _btnAddTraining.getBoundingClientRect();
  _trainingDrop.style.top   = (r.bottom + 6) + 'px';
  _trainingDrop.style.left  = r.left + 'px';
  _trainingDrop.style.width = r.width + 'px';
  _trainingDrop.style.display = 'block';
}

if (_btnAddTraining) {
  _btnAddTraining.addEventListener('click', e => {
    e.stopPropagation();
    if (_trainingDrop?.style.display !== 'none') {
      _trainingDrop.style.display = 'none';
    } else {
      _renderDrop();
    }
  });
}

if (_trainingDrop) {
  _trainingDrop.addEventListener('click', e => {
    const btn = e.target.closest('[data-add-training]');
    if (!btn) return;
    e.stopPropagation();
    if (_expandedId) {
      const expLi = _modalSortable?.querySelector(`[data-training-id="${_expandedId}"]`);
      if (expLi) _collapseTraining(expLi);
    }
    _addTrainingToModal(btn.dataset.addTraining);
    _trainingDrop.style.display = 'none';
  });
}

/* Training list management */
function _addTrainingToModal(id) {
  const t = CATALOG.find(x => x.id === id);
  if (!t || _selectedIds.includes(id) || !_modalSortable) return;
  _selectedIds.push(id);
  const li = document.createElement('li');
  li.className = 'sortable__item sortable__item--sm sortable__item--expandable';
  li.draggable = true;
  li.dataset.trainingId = id;
  li.dataset.min = '5';
  li.dataset.sec = '0';
  li.dataset.niveau = '';
  li.innerHTML = _collapsedHTML(t, 5, 0, '');
  _modalSortable.appendChild(li);
  _setupModalDrag(li);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function _expandTraining(li) {
  const t = CATALOG.find(x => x.id === li.dataset.trainingId);
  if (!t) return;
  _expandedId = li.dataset.trainingId;
  li.innerHTML = _expandedHTML(t, +li.dataset.min, +li.dataset.sec, li.dataset.niveau);
  li.draggable = false;
  li.classList.add('is-expanded');
}

function _collapseTraining(li) {
  const t = CATALOG.find(x => x.id === li.dataset.trainingId);
  if (!t) return;
  const minSel = li.querySelector('[data-field="min"]');
  const secSel = li.querySelector('[data-field="sec"]');
  const nivSel = li.querySelector('[data-field="niveau"]');
  if (minSel) li.dataset.min = minSel.value;
  if (secSel) li.dataset.sec = secSel.value;
  if (nivSel) li.dataset.niveau = nivSel.value;
  if (_expandedId === li.dataset.trainingId) _expandedId = null;
  li.innerHTML = _collapsedHTML(t, +li.dataset.min, +li.dataset.sec, li.dataset.niveau);
  li.draggable = true;
  li.classList.remove('is-expanded');
}

if (_modalSortable) {
  _modalSortable.addEventListener('click', e => {
    if (e.target.closest('[data-action="remove-training"]')) {
      const li = e.target.closest('[data-training-id]');
      const id = li.dataset.trainingId;
      _selectedIds = _selectedIds.filter(x => x !== id);
      if (_expandedId === id) _expandedId = null;
      li.remove();
      if (_trainingDrop?.style.display !== 'none') _renderDrop();
      return;
    }
    const li = e.target.closest('[data-training-id]');
    if (!li) return;
    if (e.target.closest('button, select')) { e.stopPropagation(); return; }
    e.stopPropagation();
    const id = li.dataset.trainingId;
    if (_expandedId === id) {
      _collapseTraining(li);
    } else {
      if (_expandedId) {
        const prev = _modalSortable.querySelector(`[data-training-id="${_expandedId}"]`);
        if (prev) _collapseTraining(prev);
      }
      _expandTraining(li);
    }
  });
}

_addModuleDialog?.addEventListener('click', e => {
  if (!e.target.closest('#btn-add-training') && !e.target.closest('#training-dropdown')) {
    if (_trainingDrop) _trainingDrop.style.display = 'none';
  }
  if (_expandedId) {
    const expLi = _modalSortable?.querySelector(`[data-training-id="${_expandedId}"]`);
    if (expLi) _collapseTraining(expLi);
  }
});

/* Créer — build module and append to current board */
function _buildModuleHTML() {
  const count = +document.getElementById('modal-seances').value;
  const tags = _selectedIds.map(id => {
    const t = CATALOG.find(x => x.id === id);
    return t ? `<span class="training-tag ${t.tagCls}" data-training-id="${id}">${t.name}</span>` : '';
  }).join('');
  const dots = Array.from({length: count}, () => `<span class="session-dot session-dot--todo"></span>`).join('');
  return `
    <div class="module__header">
      <div class="module__info">
        <p class="module__meta" data-module-label></p>
        <div class="module__tags">${tags}</div>
      </div>
      <div class="dropdown" data-dropdown="">
        <button class="btn btn--ghost btn--icon btn--sm" data-dropdown-trigger="" aria-haspopup="menu" aria-expanded="false" aria-label="Options du module">${_DOTS_SVG}</button>
        <div class="dropdown__menu dropdown__menu--end" role="menu">
          <button class="dropdown__item" role="menuitem" data-action="complete-module">Marqué comme complété</button>
          <hr class="dropdown__separator">
          <button class="dropdown__item dropdown__item--destructive" role="menuitem" data-action="delete-module">Supprimer</button>
        </div>
      </div>
    </div>
    <hr class="separator">
    <p class="module__meta">${count} séances</p>
    <div class="module__dots">${dots}</div>
    <button type="button" class="btn btn--dash btn--full btn--sm btn--start" data-action="add-session">${_PLUS_SVG} Ajouter une séance</button>`;
}

document.getElementById('btn-create-module')?.addEventListener('click', () => {
  if (_currentBoard) {
    const moduleDiv = document.createElement('div');
    moduleDiv.className = 'module';
    moduleDiv.innerHTML = _buildModuleHTML();
    _currentBoard.querySelector('.board__content').appendChild(moduleDiv);
    _setupModuleDrag(moduleDiv);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    _renumberModules(_currentBoard);
  }
  _addModuleDialog.close();
  _resetModal();
  _currentBoard = null;
});

document.getElementById('btn-close-add-module')?.addEventListener('click', () => {
  _addModuleDialog.close(); _resetModal(); _currentBoard = null;
});
_addModuleDialog?.addEventListener('cancel', () => { _resetModal(); _currentBoard = null; });

function _resetModal() {
  _selectedIds = []; _expandedId = null; _modalDragSrc = null;
  if (_modalSortable) _modalSortable.innerHTML = '';
  if (_trainingDrop) _trainingDrop.style.display = 'none';
}

/* ---- ADD PROGRAM ---- */
document.querySelectorAll('[data-add-program]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const title = btn.dataset.addProgram;
    const board = document.createElement('div');
    board.className = 'board';
    board.innerHTML = `
      <div class="board__header">
        <span class="board__title">${title}</span>
        <div class="dropdown" data-dropdown="">
          <button class="btn btn--ghost btn--icon btn--sm" data-dropdown-trigger="" aria-haspopup="menu" aria-expanded="false" aria-label="Options du programme">${_DOTS_SVG}</button>
          <div class="dropdown__menu dropdown__menu--end" role="menu">
            <button class="dropdown__item" role="menuitem" data-action="complete-board">Marqué comme complété</button>
            <hr class="dropdown__separator">
            <button class="dropdown__item dropdown__item--destructive" role="menuitem" data-action="delete-board">Supprimer</button>
          </div>
        </div>
      </div>
      <div class="board__content"></div>
      <div class="board__footer">
        <button class="btn btn--outline btn--full btn--start" data-action="add-module">
          ${_PLUS_SVG}
          Nouveau module
        </button>
      </div>`;
    document.querySelector('.boards').appendChild(board);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    _setupBoardDrop(board.querySelector('.board__content'));
    const ddNewProgram = document.getElementById('dd-new-program');
    ddNewProgram?.classList.remove('is-open');
    ddNewProgram?.querySelector('[data-dropdown-trigger]')?.setAttribute('aria-expanded', 'false');
  });
});

/* ---- MODULE DRAG & DROP ---- */
let _dragSrcMod = null;

function _clearModDragStates() {
  document.querySelectorAll('.module').forEach(m => m.classList.remove('drag-over-top', 'drag-over-bottom'));
}

function _setupModuleDrag(mod) {
  mod.draggable = true;

  mod.addEventListener('dragstart', e => {
    if (e.target !== mod && e.target.closest('button, a, [data-dropdown-trigger]')) { e.preventDefault(); return; }
    _dragSrcMod = mod;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => mod.classList.add('is-dragging'), 0);
  });
  mod.addEventListener('dragend', () => {
    mod.classList.remove('is-dragging');
    _clearModDragStates();
    _dragSrcMod = null;
  });
  mod.addEventListener('dragover', e => {
    if (!_dragSrcMod || _dragSrcMod === mod) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    _clearModDragStates();
    const rect = mod.getBoundingClientRect();
    mod.classList.add(e.clientY < rect.top + rect.height / 2 ? 'drag-over-top' : 'drag-over-bottom');
  });
  mod.addEventListener('dragleave', e => {
    if (!mod.contains(e.relatedTarget)) mod.classList.remove('drag-over-top', 'drag-over-bottom');
  });
  mod.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    if (!_dragSrcMod || _dragSrcMod === mod) return;
    const rect = mod.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    mod.parentNode.insertBefore(_dragSrcMod, before ? mod : mod.nextSibling);
    _clearModDragStates();
    _renumberModules(mod.closest('.board'));
    _dragSrcMod = null;
  });
}

function _setupBoardDrop(content) {
  content.addEventListener('dragover', e => {
    if (e.target.closest('.module') || !_dragSrcMod) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    _clearModDragStates();
  });
  content.addEventListener('drop', e => {
    if (e.target.closest('.module') || !_dragSrcMod) return;
    e.preventDefault();
    content.appendChild(_dragSrcMod);
    _setupModuleDrag(_dragSrcMod);
    _clearModDragStates();
    _renumberModules(content.closest('.board'));
    _dragSrcMod = null;
  });
}

document.querySelectorAll('.board__content .module').forEach(_setupModuleDrag);
document.querySelectorAll('.board__content').forEach(_setupBoardDrop);
document.querySelectorAll('.board').forEach(_renumberModules);

/* ---- SORTABLE DRAG & DROP (modal) ---- */

function _clearModalOver() {
  _modalSortable?.querySelectorAll('.is-over').forEach(i => i.classList.remove('is-over'));
}

function _setupModalDrag(li) {
  li.addEventListener('dragstart', e => {
    if (!li.draggable) { e.preventDefault(); return; }
    _modalDragSrc = li;
    li.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  li.addEventListener('dragend', () => {
    li.classList.remove('is-dragging');
    _clearModalOver();
    _modalDragSrc = null;
  });
  li.addEventListener('dragover', e => {
    if (!_modalDragSrc || _modalDragSrc === li) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    _clearModalOver();
    li.classList.add('is-over');
  });
  li.addEventListener('dragleave', e => {
    if (!li.contains(e.relatedTarget)) li.classList.remove('is-over');
  });
  li.addEventListener('drop', e => {
    e.preventDefault();
    _clearModalOver();
    if (!_modalDragSrc || _modalDragSrc === li) return;
    const items = [..._modalSortable.querySelectorAll('.sortable__item')];
    const si = items.indexOf(_modalDragSrc);
    const ti = items.indexOf(li);
    const [moved] = _selectedIds.splice(si, 1);
    _selectedIds.splice(ti, 0, moved);
    if (si < ti) _modalSortable.insertBefore(_modalDragSrc, li.nextSibling);
    else _modalSortable.insertBefore(_modalDragSrc, li);
  });
}
