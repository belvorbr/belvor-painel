/* Runtime do painel Bëlvor fora do claude.ai.
   Reimplementa o pequeno "dash" que o painel usa (data, draw, calc, loader, params)
   e busca cada conjunto de dados pela função painel_dataset do Supabase, que confere
   o perfil de quem está logado. A chave abaixo é a pública: sozinha não lê nada. */
(() => {
  const SUPABASE_URL = 'https://osxsaqutxsjorfruwjgn.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_vpm2pu4wK5xtHt32ZTxSBg_Lp0NnTDx';
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window.bvSupabase = sb;

  /* ---------- dash ---------- */
  const PADRAO = { bonif_mes: 'todos', dre_meses: '6', dre_visao: 'competencia', prox_tipo: 'todos', real_grao: 'dia', real_periodo: 'mes_atual', saldo: 0 };
  let params = { ...PADRAO };
  try { Object.assign(params, JSON.parse(localStorage.getItem('bv_params') || '{}')); } catch (e) { /* sem armazenamento */ }
  const dados = {}, loaders = {}, calcs = {}, draws = {}, ouvintes = [];
  let permitidos = null, versao = 0, agendado = false;
  const cacheCalc = {};

  const statusDe = (id) => {
    if (dados[id]) return dados[id];
    if (calcs[id]) return calcular(id);
    if (permitidos && !permitidos.has(id)) return { status: 'declined', data: [] };
    return { status: 'loading', data: [] };
  };
  function calcular(id) {
    const c = calcs[id], ins = c.inputs.map(statusDe);
    const chave = versao + '|' + ins.map((s) => s.status).join(',');
    if (cacheCalc[id] && cacheCalc[id].chave === chave) return cacheCalc[id].r;
    let r;
    if (ins.every((s) => s.status === 'ok')) {
      try { r = { status: 'ok', data: c.fn(...ins.map((s) => s.data)) || [] }; } catch (e) { console.error('calc', id, e); r = { status: 'error', data: [] }; }
    } else if (ins.some((s) => s.status === 'declined' || s.status === 'error')) r = { status: 'declined', data: [] };
    else r = { status: 'loading', data: [] };
    cacheCalc[id] = { chave, r }; return r;
  }
  function render() {
    agendado = false;
    for (const [nome, fn] of Object.entries(draws)) {
      document.querySelectorAll(`[data-draw="${nome}"]`).forEach((el) => {
        try { fn(el); } catch (e) { console.error('draw', nome, e); }
      });
    }
    ouvintes.forEach((cb) => { try { cb(); } catch (e) { console.error(e); } });
  }
  const agenda = () => { if (!agendado) { agendado = true; requestAnimationFrame(render); } };
  window.addEventListener('resize', () => { clearTimeout(window.__bvR); window.__bvR = setTimeout(agenda, 150); });

  window.dash = {
    loader: (id, o) => { loaders[id] = o.fn; },
    calc: (id, o) => { calcs[id] = o; },
    draw: (nome, fn) => { draws[nome] = fn; agenda(); },
    data: (id) => statusDe(id),
    params: () => ({ ...params }),
    setParams: (p) => { Object.assign(params, p); try { localStorage.setItem('bv_params', JSON.stringify(params)); } catch (e) { /* ok */ } versao++; agenda(); },
    onData: (cb) => { ouvintes.push(cb); },
    setLink: (nome) => { history.replaceState(null, '', '#' + nome); },
    redesenhar: agenda,
  };

  async function carregar() {
    const { data: nomes, error } = await sb.rpc('painel_datasets_meus');
    if (error) throw error;
    permitidos = new Set(nomes || []);
    versao++; agenda();
    await Promise.all([...permitidos].map(async (id) => {
      dados[id] = { status: 'loading', data: [] };
      const { data, error: e } = await sb.rpc('painel_dataset', { p_nome: id });
      if (e) { console.error(id, e); dados[id] = { status: 'error', data: [] }; }
      else {
        let rows = data || [];
        if (loaders[id]) {
          try { rows = loaders[id]({ answer: '<untrusted-data-x>\n' + JSON.stringify(rows) + '\n</untrusted-data-x>' }); }
          catch (er) { console.error('loader', id, er); dados[id] = { status: 'error', data: [] }; versao++; agenda(); return; }
        }
        dados[id] = { status: 'ok', data: rows };
      }
      versao++; agenda();
    }));
  }

  /* ---------- telas de login ---------- */
  const $ = (s) => document.querySelector(s);
  const TELAS = ['tela-login', 'tela-cadastro', 'tela-esqueci', 'tela-nova-senha', 'tela-sem-acesso', 'painel'];
  const mostra = (id) => TELAS.forEach((t) => { $('#' + t).hidden = t !== id; });
  const msg = (id, texto, tipo) => { const m = $(id); m.textContent = texto; m.className = 'msg ' + (tipo || ''); };
  const AQUI = location.origin + location.pathname;
  const traduz = (e) => {
    const t = (e && e.message) || String(e);
    if (/Invalid login credentials/i.test(t)) return 'E-mail ou senha incorretos.';
    if (/Email not confirmed/i.test(t)) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
    if (/already registered/i.test(t)) return 'Este e-mail já tem acesso. Use "Entrar" ou "Esqueci a senha".';
    if (/sem permissão/i.test(t)) return 'Seu perfil não tem acesso a esta área.';
    return t;
  };
  window.bvTraduz = traduz;
  $('#form-login').addEventListener('submit', async (ev) => {
    ev.preventDefault(); msg('#login-msg', 'Entrando…');
    const { error } = await sb.auth.signInWithPassword({ email: $('#login-email').value.trim(), password: $('#login-senha').value });
    if (error) msg('#login-msg', traduz(error), 'erro');
  });
  $('#form-cadastro').addEventListener('submit', async (ev) => {
    ev.preventDefault(); msg('#cad-msg', 'Criando…');
    const { error } = await sb.auth.signUp({ email: $('#cad-email').value.trim(), password: $('#cad-senha').value, options: { emailRedirectTo: AQUI } });
    if (error) msg('#cad-msg', traduz(error), 'erro'); else msg('#cad-msg', 'Pronto. Abra o e-mail de confirmação que enviamos e depois entre com sua senha.', 'ok');
  });
  $('#form-esqueci').addEventListener('submit', async (ev) => {
    ev.preventDefault(); msg('#esq-msg', 'Enviando…');
    const { error } = await sb.auth.resetPasswordForEmail($('#esq-email').value.trim(), { redirectTo: AQUI });
    if (error) msg('#esq-msg', traduz(error), 'erro'); else msg('#esq-msg', 'Se o e-mail tiver acesso, o link chega em alguns minutos.', 'ok');
  });
  $('#form-nova').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const { error } = await sb.auth.updateUser({ password: $('#nova-senha').value });
    if (error) msg('#nova-msg', traduz(error), 'erro'); else { msg('#nova-msg', 'Senha alterada.', 'ok'); recuperando = false; setTimeout(iniciar, 800); }
  });
  $('#ir-cadastro').addEventListener('click', () => mostra('tela-cadastro'));
  $('#ir-esqueci').addEventListener('click', () => mostra('tela-esqueci'));
  document.querySelectorAll('.volta').forEach((b) => b.addEventListener('click', () => mostra('tela-login')));
  document.querySelectorAll('[data-sair]').forEach((b) => b.addEventListener('click', async () => { await sb.auth.signOut(); location.hash = ''; location.reload(); }));

  let recuperando = false, iniciado = false;
  sb.auth.onAuthStateChange((ev) => {
    if (ev === 'PASSWORD_RECOVERY') { recuperando = true; mostra('tela-nova-senha'); return; }
    if (ev === 'SIGNED_IN' && !iniciado) iniciar();
  });

  const PAPEIS = { admin: 'Admin', financeiro: 'Financeiro', performance: 'Performance', influencia: 'MKT influência', comercial: 'Comercial', visao: 'Visão geral' };
  window.bvPapeisNomes = PAPEIS;
  async function iniciar() {
    if (recuperando) return;
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { document.body.classList.remove('logado'); mostra('tela-login'); return; }
    iniciado = true;
    const { data: eu, error } = await sb.rpc('painel_eu');
    if (error) { iniciado = false; mostra('tela-login'); msg('#login-msg', traduz(error), 'erro'); return; }
    window.bvEu = eu;
    const papeis = eu.papeis || [];
    document.querySelectorAll('[data-quem-nome]').forEach((e) => { e.textContent = eu.nome || eu.email; });
    document.querySelectorAll('[data-quem-papeis]').forEach((e) => { e.textContent = papeis.map((p) => PAPEIS[p] || p).join(' · '); });
    if (!papeis.length) { mostra('tela-sem-acesso'); return; }
    document.body.classList.add('logado');
    // abas e seções que o perfil pode ver
    document.querySelectorAll('[data-papeis]').forEach((e) => {
      const ok = e.dataset.papeis.split(',').some((p) => papeis.includes(p.trim()));
      e.classList.toggle('bv-sem-acesso', !ok);
    });
    mostra('painel');
    window.bvAbrir((location.hash || '').replace('#', ''));
    try { await carregar(); } catch (e) { console.error(e); }
    if (papeis.includes('admin')) window.bvUsuarios && window.bvUsuarios();
  }
  window.bvIniciar = iniciar;
})();
