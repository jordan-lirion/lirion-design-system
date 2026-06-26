/* program: board collapse/expand + session-dot interactions */

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
_todoMenu.className = 'dropdown__menu';
_todoMenu.setAttribute('role', 'menu');
_todoMenu.style.cssText = 'position:fixed; display:none; z-index:200;';
_todoMenu.innerHTML = '<button class="dropdown__item" role="menuitem" data-action="to-test">Convertir en test de niveau</button>';
document.body.appendChild(_todoMenu);

let _activeTodo = null;

function _closeTodoMenu() {
  _todoMenu.style.display = 'none';
  _activeTodo = null;
}

/* Add "+ Ajouter une séance" button to every existing .module */
const _ADD_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';

function addSessionButton(module) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn--dash btn--full btn--sm';
  btn.setAttribute('data-action', 'add-session');
  btn.style.justifyContent = 'flex-start';
  btn.innerHTML = _ADD_SVG + ' Ajouter une séance';
  module.appendChild(btn);
}

document.querySelectorAll('.module').forEach(addSessionButton);

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
    wrapper.style.cssText = 'min-width:0;';
    wrapper.innerHTML = '<button class="session-dot session-dot--todo" type="button"></button>';
    dots.appendChild(wrapper);
  }
});
