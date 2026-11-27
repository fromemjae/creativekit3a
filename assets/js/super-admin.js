/**
 * assets/js/super-admin.js — the super admin console (pages/super-admin.php)
 *   - search and role filters for the user table
 *   - the Manage dialog (role, organization, sign-in, delete), filled from the row's button
 *   - the add-user and organization dialogs
 *   - a confirm step before any change that removes access (forms with data-confirm)
 * Without this script every row's promote / demote / suspend form still posts as written.
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- dialogs */
  const open = (d) => { if (d && !d.open) d.showModal(); };
  $$('dialog.sa-dialog').forEach((d) => {
    $$('[data-close]', d).forEach((b) => b.addEventListener('click', () => d.close()));
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });   // a click on the backdrop
  });
  $$('[data-open]').forEach((b) => b.addEventListener('click', () => open(document.getElementById(b.dataset.open))));

  /* ---------- confirm before a change that removes access */
  const confirmBox = $('#sa-confirm');
  let pending = null;
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!form.matches('[data-confirm]') || form.dataset.confirmed === '1') return;
    e.preventDefault();
    pending = form;
    $('#sa-confirm-text').textContent = form.dataset.confirm;
    const ok = $('[data-confirm-ok]', confirmBox);
    ok.className = 'sa-btn ' + (form.hasAttribute('data-danger') ? 'sa-btn--danger' : 'sa-btn--primary');
    ok.textContent = form.hasAttribute('data-danger') ? 'Yes, delete it' : 'Yes, go ahead';
    open(confirmBox);
    ok.focus();
  });
  $('[data-confirm-ok]', confirmBox)?.addEventListener('click', () => {
    if (!pending) return;
    pending.dataset.confirmed = '1';
    confirmBox.close();
    pending.requestSubmit();
  });
  confirmBox?.addEventListener('close', () => { if (pending && pending.dataset.confirmed !== '1') pending = null; });

  /* ---------- Manage a user */
  const manage = $('#sa-manage');
  $$('[data-manage]').forEach((btn) => btn.addEventListener('click', () => {
    const d = btn.dataset;
    $('#sa-manage-title').textContent = 'Manage ' + d.name;
    $('#sa-manage-email').textContent = d.email;
    $$('[data-user-id]', manage).forEach((i) => { i.value = d.id; });
    $$('input[name="role"]', manage).forEach((r) => { r.checked = r.value === d.role; });
    $('#sa-manage-org').value = d.org || '0';

    const active = d.active === '1';
    const activeForm = $('[data-active-form]', manage);
    $('[data-active-value]', manage).value = active ? '0' : '1';
    $('[data-active-label]', manage).textContent = active ? 'Deactivate the account' : 'Reactivate the account';
    if (active) activeForm.dataset.confirm = `Deactivate ${d.name}? They are signed out and cannot sign in.`;
    else delete activeForm.dataset.confirm;

    $('[data-delete-form]', manage).dataset.confirm = `Delete ${d.name}'s account? This cannot be undone. Their quotes and products stay, unassigned.`;

    // a demotion from admin asks first; a promotion goes straight through
    const roleForm = $('input[name="role"]', manage).form;
    roleForm.onchange = () => {
      const to = $('input[name="role"]:checked', manage)?.value;
      if (d.role === 'admin' && to && to !== 'admin') roleForm.dataset.confirm = `Demote ${d.name} to ${to}? They lose this console straight away.`;
      else delete roleForm.dataset.confirm;
    };
    roleForm.onchange();
    open(manage);
  }));

  /* ---------- add or edit an organization */
  const orgBox = $('#sa-org');
  $$('[data-org-edit]').forEach((btn) => btn.addEventListener('click', () => {
    const d = btn.dataset;
    const editing = d.id && d.id !== '0';
    $('[data-org-id]', orgBox).value = d.id || '0';
    $('#org-name').value = editing ? d.name : '';
    $('#org-email').value = editing ? d.email : '';
    $('#org-notes').value = editing ? d.notes : '';
    $('#sa-org-title').textContent = editing ? 'Edit ' + d.name : 'Add an organization';
    $('[data-org-submit]', orgBox).textContent = editing ? 'Save the organization' : 'Add the organization';
    open(orgBox);
  }));

  /* ---------- search and filter the user table */
  const rows = $$('#sa-users tbody tr');
  const search = $('#sa-user-search');
  const empty = $('#sa-users-empty');
  let filter = 'all';
  const apply = () => {
    const q = (search?.value || '').trim().toLowerCase();
    let shown = 0;
    rows.forEach((tr) => {
      const byFilter = filter === 'all' || (filter === 'inactive' ? tr.dataset.state === 'inactive' : tr.dataset.role === filter && tr.dataset.state !== 'inactive');
      const show = byFilter && (!q || tr.dataset.search.includes(q));
      tr.hidden = !show;
      if (show) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  };
  search?.addEventListener('input', apply);
  $$('.sa-filter button').forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    $$('.sa-filter button').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    apply();
  }));
});
