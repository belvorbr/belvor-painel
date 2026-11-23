/* Abas macro (Central, Metas, Financeiro, Setores, Marketing, Usuários) e sub-abas do Financeiro */
(() => {
  const FIN = ['dre', 'cpv', 'caixa'];
  let ultimaFin = 'dre';
  const pode = (el) => !el || !el.classList.contains('bv-sem-acesso');
  window.bvAbrir = (nome) => {
    if (nome === 'financeiro') nome = ultimaFin;
    const sec = document.querySelector(`[data-sec="${nome}"]`);
    const tab = document.querySelector(`.bv-tab[data-tab="${FIN.includes(nome) ? 'financeiro' : nome}"]`);
    if (!sec || (tab && !pode(tab)) || (nome !== 'analise' && !tab)) {
      const primeira = [...document.querySelectorAll('.bv-tab')].find(pode);
      nome = primeira ? primeira.dataset.tab : 'metas';
      if (nome === 'financeiro') nome = ultimaFin;
    }
    if (FIN.includes(nome)) ultimaFin = nome;
    document.querySelectorAll('[data-sec]').forEach((s) => { s.hidden = s.dataset.sec !== nome; });
    const macro = FIN.includes(nome) ? 'financeiro' : nome;
    document.querySelectorAll('.bv-tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === macro)));
    const sub = document.getElementById('bv-subtabs');
    sub.hidden = macro !== 'financeiro';
    sub.querySelectorAll('.bv-subtab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.sub === nome)));
    dash.setLink(nome);
    dash.redesenhar();
  };
  document.querySelectorAll('.bv-tab').forEach((b) => b.addEventListener('click', () => window.bvAbrir(b.dataset.tab)));
  document.querySelectorAll('.bv-subtab').forEach((b) => b.addEventListener('click', () => window.bvAbrir(b.dataset.sub)));

  /* ---------- Usuários (só admin) ---------- */
  const sb = window.bvSupabase;
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined && txt !== null) e.textContent = txt; return e; };
  window.bvUsuarios = async () => {
    const c = document.getElementById('usuarios-conteudo'); if (!c) return;
    const PAPEIS = window.bvPapeisNomes;
    const { data: lista, error } = await sb.rpc('painel_usuarios_listar');
    c.replaceChildren();
    if (error) { c.append(el('p', 'bv-note', window.bvTraduz(error))); return; }
    const form = el('form', 'bv-card');
    form.append(el('h3', 'bv-h3', 'Adicionar ou alterar acesso'));
    const email = el('input', 'bv-input'); email.type = 'email'; email.required = true; email.placeholder = 'email@exemplo.com';
    const nome = el('input', 'bv-input'); nome.placeholder = 'Nome';
    const l1 = el('label', 'bv-campo', 'E-mail'); l1.append(email); const l2 = el('label', 'bv-campo', 'Nome'); l2.append(nome);
    const checks = el('div', 'bv-checks'); const cb = {};
    for (const [k, v] of Object.entries(PAPEIS)) { const l = el('label'); const i = el('input'); i.type = 'checkbox'; cb[k] = i; l.append(i, document.createTextNode(' ' + v)); checks.append(l); }
    const ativo = el('input'); ativo.type = 'checkbox'; ativo.checked = true; const la = el('label'); la.append(ativo, document.createTextNode(' Acesso ativo'));
    const bt = el('button', 'bv-botao', 'Salvar'); bt.type = 'submit'; const m = el('p', 'bv-note');
    form.append(l1, l2, el('span', 'bv-eyebrow', 'Perfis'), checks, la, bt, m,
      el('p', 'bv-note', 'Depois de salvar, a pessoa abre o painel, clica em "Primeiro acesso: criar minha senha" com este e-mail e confirma pelo e-mail que recebe.'));
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const papeis = Object.keys(cb).filter((k) => cb[k].checked);
      const { error: e } = await sb.rpc('painel_usuario_salvar', { p_email: email.value.trim(), p_nome: nome.value.trim() || null, p_papeis: papeis, p_ativo: ativo.checked });
      if (e) m.textContent = window.bvTraduz(e); else window.bvUsuarios();
    });
    const card = el('div', 'bv-card'); card.append(el('h3', 'bv-h3', 'Quem tem acesso'));
    const tw = el('div', 'bv-tw'); const t = el('table', 'bv-table'); const th = el('thead'); const hr = el('tr');
    for (const [h, cls] of [['E-mail', 'bv-txt'], ['Nome', 'bv-txt'], ['Perfis', 'bv-txt'], ['Ativo', 'bv-txt'], ['', 'bv-txt']]) hr.append(el('th', cls, h));
    th.append(hr); t.append(th); const tb = el('tbody');
    for (const r of lista || []) {
      const tr = el('tr'); const ed = el('button', 'bv-link', 'editar'); ed.type = 'button';
      ed.addEventListener('click', () => { email.value = r.email; nome.value = r.nome || ''; ativo.checked = r.ativo; for (const k in cb) cb[k].checked = (r.papeis || []).includes(k); email.focus(); });
      const td = el('td', 'bv-txt'); td.append(ed);
      tr.append(el('td', 'bv-txt', r.email), el('td', 'bv-txt', r.nome || '—'), el('td', 'bv-txt', (r.papeis || []).map((p) => PAPEIS[p] || p).join(', ')), el('td', 'bv-txt', r.ativo ? 'sim' : 'não'), td);
      tb.append(tr);
    }
    t.append(tb); tw.append(t); card.append(tw);
    c.append(form, card);
  };

  window.bvIniciar();
})();
