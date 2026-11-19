/*
 * admin/admin.js  –  SMALL HELPERS FOR THE ADMIN DASHBOARD (admin/index.php)
 * Parts: 1 TABS · 2 ADD / REMOVE / MOVE ROWS · 3 PICTURE PREVIEW
 * Open the browser console (F12) to see messages if something does not work.
 */
(() => {
  /* ===== 1. TABS: show one section at a time, chosen by the #hash in the address (e.g. admin/#campuses) ===== */
  const panels = [...document.querySelectorAll('.panel')];
  const menuLinks = [...document.querySelectorAll('.side a[data-panel]')];

  function showPanel(id) {
    if (!panels.some(p => p.id === id)) id = panels[0].id;  // unknown/empty hash -> first section
    panels.forEach(p => { p.hidden = p.id !== id; });
    menuLinks.forEach(a => a.classList.toggle('on', a.dataset.panel === id));
  }
  addEventListener('hashchange', () => showPanel(location.hash.slice(1)));
  showPanel(location.hash.slice(1));

  /* ===== 2. ROWS: "+ Add", "Remove", "↑", "↓" inside the Campuses and Announcements forms =====
     A form marked data-repeater contains: .rows (the current rows) and a <template> (an empty row).
     Adding a row = copy the template and replace "__K__" with a random key so field names stay unique. */
  document.querySelectorAll('[data-repeater]').forEach(form => {
    const list = form.querySelector('.rows');
    const template = form.querySelector('template');
    const maxRows = Number(form.dataset.max) || 20;

    form.addEventListener('click', e => {
      const button = e.target.closest('button[data-act]');
      if (!button) return;
      const row = button.closest('.row');

      switch (button.dataset.act) {
        case 'add': {
          if (list.children.length >= maxRows) { alert('Maximum of ' + maxRows + ' items reached.'); return; }
          const key = 'n' + Math.random().toString(36).slice(2, 9);
          list.insertAdjacentHTML('beforeend', template.innerHTML.replaceAll('__K__', key));
          list.lastElementChild.querySelector('input:not([type=hidden])').focus();
          break;
        }
        case 'del':
          if (confirm('Remove this item? (It is removed for good when you press Save.)')) row.remove();
          break;
        case 'up':
          if (row.previousElementSibling) list.insertBefore(row, row.previousElementSibling);
          break;
        case 'down':
          if (row.nextElementSibling) list.insertBefore(row.nextElementSibling, row);
          break;
      }
    });
  });

  /* ===== 3. PICTURE PREVIEW: choosing a file in the dropdown updates the small preview image ===== */
  document.addEventListener('change', e => {
    if (!e.target.matches('.img-select')) return;
    const thumb = e.target.closest('.img-field').querySelector('.thumb');
    const url = e.target.selectedOptions[0].dataset.url;    // set by PHP in admin/index.php
    thumb.hidden = !url;
    if (url) thumb.src = url;
  });
})();
