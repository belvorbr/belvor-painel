/* Painel Bëlvor com login. Os dados vêm só das funções painel_* do Supabase,
   que conferem o perfil de quem está logado antes de devolver qualquer número. */
const SUPABASE_URL = 'https://osxsaqutxsjorfruwjgn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vpm2pu4wK5xtHt32ZTxSBg_Lp0NnTDx'; // chave pública: sozinha não lê nada
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const AQUI = location.origin + location.pathname;

const $ = (s) => document.querySelector(s);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined && txt !== null) e.textContent = txt; return e; };
const brl = (v) => (v === null || v === undefined || isNaN(v) ? '—' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
const int = (v) => (v === null || v === undefined || isNaN(v) ? '—' : Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 }));
const pct = (v) => (v === null || v === undefined || !isFinite(v) ? '—' : (v * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%');
const xx = (v) => (v === null || v === undefined || !isFinite(v) ? '—' : Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '×');
const div = (a, b) => (b ? a / b : null);
const n = (v) => Number(v) || 0;
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const mesNome = (m) => MESES[+m.slice(5, 7) - 1] + ' de ' + m.slice(0, 4);
const hoje = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });

const TELAS = ['tela-login', 'tela-cadastro', 'tela-esqueci', 'tela-nova-senha', 'tela-sem-acesso', 'tela-painel'];
const mostra = (id) => TELAS.forEach((t) => { $('#' + t).hidden = t !== id; });
const msg = (id, texto, tipo) => { const m = $(id); m.textContent = texto; m.className = 'msg ' + (tipo || ''); };
const traduz = (e) => {
  const t = (e && e.message) || String(e);
  if (/Invalid login credentials/i.test(t)) return 'E-mail ou senha incorretos.';
  if (/Email not confirmed/i.test(t)) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (/already registered/i.test(t)) return 'Este e-mail já tem acesso. Use "Entrar" ou "Esqueci a senha".';
  if (/sem permissão/i.test(t)) return 'Seu perfil não tem acesso a esta área.';
  return t;
};

/* ---------- autenticação ---------- */
$('#form-login').addEventListener('submit', async (ev) => {
  ev.preventDefault(); msg('#login-msg', 'Entrando…');
  const { error } = await sb.auth.signInWithPassword({ email: $('#login-email').value.trim(), password: $('#login-senha').value });
  if (error) msg('#login-msg', traduz(error), 'erro');
});
$('#form-cadastro').addEventListener('submit', async (ev) => {
  ev.preventDefault(); msg('#cad-msg', 'Criando…');
  const { error } = await sb.auth.signUp({ email: $('#cad-email').value.trim(), password: $('#cad-senha').value, options: { emailRedirectTo: AQUI } });
  if (error) msg('#cad-msg', traduz(error), 'erro');
  else msg('#cad-msg', 'Pronto. Abra o e-mail de confirmação que enviamos e depois entre com sua senha.', 'ok');
});
$('#form-esqueci').addEventListener('submit', async (ev) => {
  ev.preventDefault(); msg('#esq-msg', 'Enviando…');
  const { error } = await sb.auth.resetPasswordForEmail($('#esq-email').value.trim(), { redirectTo: AQUI });
  if (error) msg('#esq-msg', traduz(error), 'erro'); else msg('#esq-msg', 'Se o e-mail tiver acesso, o link chega em alguns minutos.', 'ok');
});
$('#form-nova').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const { error } = await sb.auth.updateUser({ password: $('#nova-senha').value });
  if (error) msg('#nova-msg', traduz(error), 'erro'); else { msg('#nova-msg', 'Senha alterada.', 'ok'); setTimeout(iniciar, 800); }
});
$('#ir-cadastro').addEventListener('click', () => mostra('tela-cadastro'));
$('#ir-esqueci').addEventListener('click', () => mostra('tela-esqueci'));
document.querySelectorAll('.volta').forEach((b) => b.addEventListener('click', () => mostra('tela-login')));
$('#sair').addEventListener('click', async () => { await sb.auth.signOut(); });

let recuperando = false;
sb.auth.onAuthStateChange((evento) => {
  if (evento === 'PASSWORD_RECOVERY') { recuperando = true; mostra('tela-nova-senha'); return; }
  if (evento === 'SIGNED_IN' || evento === 'SIGNED_OUT') iniciar();
});

/* ---------- painel ---------- */
const PAPEIS = { admin: 'Admin', financeiro: 'Financeiro', performance: 'Performance', influencia: 'MKT influência', comercial: 'Comercial', visao: 'Visão geral' };
const ABAS = [
  { id: 'metas', nome: 'Metas', pode: ['admin', 'financeiro', 'performance', 'influencia', 'comercial', 'visao'], fn: abaMetas },
  { id: 'performance', nome: 'Performance', pode: ['admin', 'performance'], fn: abaPerformance },
  { id: 'influencia', nome: 'MKT influência', pode: ['admin', 'influencia'], fn: abaInfluencia },
  { id: 'financeiro', nome: 'Financeiro', pode: ['admin', 'financeiro'], fn: abaFinanceiro },
  { id: 'usuarios', nome: 'Usuários', pode: ['admin'], fn: abaUsuarios },
];
let eu = null;

async function iniciar() {
  if (recuperando) return;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { $('#quem').hidden = true; mostra('tela-login'); return; }
  const { data, error } = await sb.rpc('painel_eu');
  if (error) { mostra('tela-login'); msg('#login-msg', traduz(error), 'erro'); return; }
  eu = data;
  $('#quem').hidden = false; $('#quem-nome').textContent = eu.nome || eu.email;
  $('#quem-papeis').textContent = (eu.papeis || []).map((p) => PAPEIS[p] || p).join(' · ');
  const abas = ABAS.filter((a) => a.pode.some((p) => (eu.papeis || []).includes(p)));
  if (!abas.length) { mostra('tela-sem-acesso'); return; }
  mostra('tela-painel');
  const nav = $('#abas'); nav.replaceChildren();
  for (const a of abas) {
    const b = el('button', 'aba', a.nome); b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.id = a.id;
    b.addEventListener('click', () => abrir(a)); nav.append(b);
  }
  const pedido = abas.find((a) => a.id === location.hash.slice(1)) || abas[0];
  abrir(pedido);
}
async function abrir(aba) {
  document.querySelectorAll('.aba').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.id === aba.id)));
  history.replaceState(null, '', '#' + aba.id);
  const c = $('#conteudo'); c.replaceChildren(el('p', 'nota', 'Carregando…'));
  try { await aba.fn(c); } catch (e) { c.replaceChildren(el('p', 'erro-area', traduz(e))); }
}
async function rpc(nome, args) { const { data, error } = await sb.rpc(nome, args || {}); if (error) throw error; return data; }

function kpi(rot, val, sub, cor, progresso) {
  const k = el('div', 'kpi'); if (cor) k.style.setProperty('--cor', cor);
  k.append(el('div', 'rot', rot), el('div', 'val', val)); if (sub) k.append(el('div', 'sub', sub));
  if (progresso !== undefined && progresso !== null) { const b = el('div', 'barra'); const f = el('div'); f.style.width = Math.min(100, progresso * 100).toFixed(1) + '%'; b.append(f); k.append(b); }
  return k;
}
function tabela(colunas, linhas) {
  const t = el('table'); const h = el('tr');
  for (const [rot, , cls] of colunas) h.append(el('th', cls, rot));
  const th = el('thead'); th.append(h); t.append(th);
  const tb = el('tbody');
  for (const r of linhas) { const tr = el('tr'); for (const [, f, cls] of colunas) { const v = f(r); const td = el('td', cls); if (v instanceof Node) td.append(v); else td.textContent = v; tr.append(td); } tb.append(tr); }
  t.append(tb); return t;
}
const bloco = (titulo, ...filhos) => { const b = el('div', 'bloco'); if (titulo) b.append(el('h3', null, titulo)); b.append(...filhos); return b; };

/* Metas */
async function abaMetas(c) {
  const meses = (await rpc('painel_metas')) || [];
  const m = meses[0] || {};
  c.replaceChildren(el('h2', null, 'Metas · ' + (m.mes ? mesNome(m.mes) : '')));
  const infl = Math.max(0, n(m.site_receita) - n(m.perf_receita));
  const metaPerf = m.meta_gasto ? n(m.meta_gasto) * n(m.roas_alvo || 2) : null;
  const g = el('div', 'grade');
  g.append(kpi('PDV', brl(m.pdv_receita), m.pdv_meta ? `meta ${brl(m.pdv_meta)} · ${int(m.pdv_pedidos)} pedidos` : `${int(m.pdv_pedidos)} pedidos`, 'var(--pdv)', m.pdv_meta ? div(n(m.pdv_receita), n(m.pdv_meta)) : null));
  g.append(kpi('Venda orgânica', brl(m.organicas_receita), `${int(m.organicas_pedidos)} pedidos`, 'var(--org)'));
  g.append(kpi('Performance', brl(m.perf_receita), `investido ${brl(m.meta_gasto)} · ROAS ${xx(div(n(m.perf_receita), n(m.meta_gasto)))}`, 'var(--perf)', metaPerf ? div(n(m.perf_receita), metaPerf) : null));
  g.append(kpi('MKT influência', brl(infl), `${brl(m.cupom_receita)} pelo cupom (${int(m.cupom_pedidos)} pedidos)`, 'var(--infl)'));
  g.append(kpi('Faturamento total', brl(n(m.pdv_receita) + n(m.site_receita) + n(m.organicas_receita)), m.site_meta ? `meta do site ${brl(m.site_meta)}` : '', 'var(--ecom)'));
  c.append(g, bloco('Mês a mês', tabela([
    ['Mês', (r) => mesNome(r.mes), 't'], ['PDV', (r) => brl(r.pdv_receita)], ['Orgânica', (r) => brl(r.organicas_receita)], ['Site', (r) => brl(r.site_receita)],
    ['Performance', (r) => brl(r.perf_receita)], ['Influência', (r) => brl(Math.max(0, n(r.site_receita) - n(r.perf_receita)))], ['Total', (r) => brl(n(r.pdv_receita) + n(r.site_receita) + n(r.organicas_receita))]], meses)));
}

/* Performance */
async function abaPerformance(c) {
  const d = await rpc('painel_performance');
  const meses = d.meses || [], m = meses[0] || {};
  c.replaceChildren(el('h2', null, 'Performance · Meta Ads'));
  const g = el('div', 'grade');
  g.append(kpi('Investido no mês', brl(m.gasto), null, 'var(--perf)'), kpi('Receita atribuída', brl(m.receita), null, 'var(--perf)'),
    kpi('ROAS', xx(div(n(m.receita), n(m.gasto))), null, 'var(--perf)'), kpi('Custo por compra', brl(div(n(m.gasto), n(m.compras))), `${int(m.compras)} compras`, 'var(--perf)'));
  c.append(g, bloco('Mês a mês', tabela([
    ['Mês', (r) => mesNome(r.mes), 't'], ['Investido', (r) => brl(r.gasto)], ['Receita', (r) => brl(r.receita)], ['ROAS', (r) => xx(div(n(r.receita), n(r.gasto)))],
    ['Compras', (r) => int(r.compras)], ['Custo por compra', (r) => brl(div(n(r.gasto), n(r.compras)))], ['CTR', (r) => pct(div(n(r.cliques), n(r.impressoes)))]], meses)));
  c.append(bloco('Campanhas do mês', tabela([['Campanha', (r) => r.campanha, 't'], ['Investido', (r) => brl(r.gasto)], ['Receita', (r) => brl(r.receita)], ['ROAS', (r) => xx(div(n(r.receita), n(r.gasto)))], ['Compras', (r) => int(r.compras)]], d.campanhas || [])));
  c.append(bloco('Plataforma e posição no mês', tabela([['Onde', (r) => `${r.plataforma} · ${String(r.posicao).replace(/_/g, ' ')}`, 't'], ['Investido', (r) => brl(r.gasto)], ['Receita', (r) => brl(r.receita)], ['ROAS', (r) => xx(div(n(r.receita), n(r.gasto)))]], d.plataformas || [])));
}

/* MKT influência: Liga dos embaixadores */
const NIVEIS = [['Bronze', 0, '#B07A4A'], ['Prata', 500, '#9AA3AD'], ['Ouro', 1500, '#D9A520'], ['Platina', 5000, '#5FB3B3'], ['Diamante', 15000, '#7C6CF2']];
const nivelDe = (v) => { let i = 0; NIVEIS.forEach((x, k) => { if (v >= x[1]) i = k; }); return i; };
async function abaInfluencia(c) {
  const h = hoje(), mes = h.slice(0, 7), ant = new Date(mes + '-01T00:00:00Z'); ant.setUTCMonth(ant.getUTCMonth() - 1);
  const am = ant.toISOString().slice(0, 7), fimAnt = new Date(Date.UTC(+mes.slice(0, 4), +mes.slice(5, 7) - 1, 0)).toISOString().slice(0, 10);
  const PER = { mes_atual: [mes + '-01', h, mesNome(mes)], mes_anterior: [am + '-01', fimAnt, mesNome(am)], tudo: ['2020-01-01', h, 'desde o início'] };
  const per = sessionStorage.getItem('inf_per') || 'mes_atual';
  const [ini, fim, rot] = PER[per] || PER.mes_atual;
  const d = await rpc('painel_influencia', { ini, fim });
  const liga = (d.liga || []).map((r) => ({ ...r, investimento: n(r.comissao) + n(r.custo_envios) }));
  const dias = d.dias || [];
  c.replaceChildren(el('h2', null, 'MKT influência · ' + rot));
  const ctrl = el('div', 'ctrl'); const lab = el('label', null, 'Período'); const sel = el('select');
  for (const [k, v] of Object.entries(PER)) { const o = el('option', null, v[2]); o.value = k; sel.append(o); }
  sel.value = per; sel.addEventListener('change', () => { sessionStorage.setItem('inf_per', sel.value); abaInfluencia(c); }); lab.append(sel); ctrl.append(lab); c.append(ctrl);
  const s = (k) => liga.reduce((a, r) => a + n(r[k]), 0);
  const g = el('div', 'grade');
  g.append(kpi('Receita de influência', brl(dias.reduce((a, r) => a + n(r.influencia), 0)), 'site − receita atribuída ao Meta', 'var(--infl)'),
    kpi('Vendas pelo cupom', brl(s('vendas')), `${int(s('pedidos'))} pedidos · ${liga.length} embaixadores`, 'var(--infl)'),
    kpi('Investimento', brl(s('investimento')), 'envios (CPV + frete) + comissões', 'var(--infl)'),
    kpi('Retorno pelo cupom', xx(div(s('vendas'), s('investimento'))), null, 'var(--infl)'));
  c.append(g);
  const melhor = (k, f) => liga.reduce((a, r) => (f(r) > (a ? f(a) : 0) ? r : a), null);
  const conq = new Map(); const dar = (r, t) => { if (r) conq.set(r.creator_id, (conq.get(r.creator_id) || []).concat(t)); };
  dar(melhor('vendas', (r) => n(r.vendas)), 'Top vendas'); dar(melhor('ret', (r) => div(n(r.vendas), r.investimento) || 0), 'Melhor retorno');
  dar(melhor('ped', (r) => n(r.pedidos)), 'Mais pedidos'); dar(melhor('ticket', (r) => div(n(r.vendas), n(r.pedidos)) || 0), 'Maior ticket');
  const linhas = liga.map((r, i) => ({ ...r, i }));
  c.append(bloco('Liga dos embaixadores', linhas.length ? tabela([
    ['#', (r) => el('span', 'pos' + (r.i < 3 ? ' top' : ''), (r.i + 1) + 'º'), 't'],
    ['Embaixador', (r) => { const f = document.createDocumentFragment(); f.append(document.createTextNode(r.nome || '—')); if (r.instagram) f.append(el('span', 'obs', '@' + r.instagram)); return f; }, 't'],
    ['Nível', (r) => { const k = nivelDe(n(r.carreira)), prox = NIVEIS[k + 1]; const f = document.createDocumentFragment(); const s1 = el('span', 'nivel', NIVEIS[k][0]); s1.style.setProperty('--n', NIVEIS[k][2]); f.append(s1, el('span', 'obs', prox ? `faltam ${brl(prox[1] - n(r.carreira))} para ${prox[0]}` : 'nível máximo')); return f; }, 't'],
    ['Conquistas', (r) => { const f = document.createDocumentFragment(); (conq.get(r.creator_id) || []).forEach((t) => f.append(el('span', 'conq', t))); return f.childNodes.length ? f : '—'; }, 't'],
    ['Pedidos', (r) => int(r.pedidos)], ['Vendas', (r) => brl(r.vendas)], ['Ticket', (r) => brl(div(n(r.vendas), n(r.pedidos)))], ['Comissão', (r) => brl(r.comissao)],
    ['Envios', (r) => `${int(r.envios)} · ${brl(r.custo_envios)}`], ['Retorno', (r) => xx(div(n(r.vendas), r.investimento))], ['Posts', (r) => int(r.posts)]], linhas)
    : el('p', 'nota', 'Ninguém vendeu pelo cupom neste período.')));
}

/* Financeiro */
async function abaFinanceiro(c) {
  const d = await rpc('painel_financeiro');
  c.replaceChildren(el('h2', null, 'Financeiro'));
  c.append(bloco('Mês a mês', tabela([['Mês', (r) => mesNome(r.mes), 't'], ['Faturamento', (r) => brl(r.faturamento)], ['CMV', (r) => brl(r.cmv_vendas)], ['Marketing', (r) => brl(r.marketing)],
    ['Margem após CMV e marketing', (r) => brl(n(r.faturamento) - n(r.cmv_vendas) - n(r.marketing))]], d.meses || [])));
  c.append(bloco('CPV por formato', tabela([['Formato', (r) => r.nome, 't'], ['CPV por unidade', (r) => brl(r.cpv_unitario)], ['Embalagem de canal', (r) => brl(r.embalagem_canal)]], d.cpv || [])));
}

/* Usuários (admin) */
async function abaUsuarios(c) {
  const lista = (await rpc('painel_usuarios_listar')) || [];
  c.replaceChildren(el('h2', null, 'Usuários e perfis'));
  const form = el('form', 'bloco');
  form.append(el('h3', null, 'Adicionar ou alterar acesso'));
  const email = el('input'); email.type = 'email'; email.required = true; email.placeholder = 'email@exemplo.com';
  const nome = el('input'); nome.placeholder = 'Nome';
  const l1 = el('label', null, 'E-mail'); l1.append(email); const l2 = el('label', null, 'Nome'); l2.append(nome);
  const checks = el('div', 'checks'); const cb = {};
  for (const [k, v] of Object.entries(PAPEIS)) { const l = el('label'); const i = el('input'); i.type = 'checkbox'; cb[k] = i; l.append(i, document.createTextNode(v)); checks.append(l); }
  const ativo = el('input'); ativo.type = 'checkbox'; ativo.checked = true; const la = el('label'); la.append(ativo, document.createTextNode('Acesso ativo'));
  const bt = el('button', 'botao', 'Salvar'); bt.type = 'submit'; const m = el('p', 'msg');
  form.append(l1, l2, el('div', 'obs', 'Perfis'), checks, la, bt, m,
    el('p', 'nota', 'Depois de salvar, a pessoa entra no painel, clica em "Primeiro acesso: criar minha senha" com este e-mail e confirma pelo e-mail que recebe.'));
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const papeis = Object.keys(cb).filter((k) => cb[k].checked);
    const { error } = await sb.rpc('painel_usuario_salvar', { p_email: email.value.trim(), p_nome: nome.value.trim() || null, p_papeis: papeis, p_ativo: ativo.checked });
    if (error) { m.textContent = traduz(error); m.className = 'msg erro'; } else abaUsuarios(c);
  });
  c.append(form, bloco('Quem tem acesso', tabela([
    ['E-mail', (r) => r.email, 't'], ['Nome', (r) => r.nome || '—', 't'], ['Perfis', (r) => (r.papeis || []).map((p) => PAPEIS[p] || p).join(', '), 't'], ['Ativo', (r) => (r.ativo ? 'sim' : 'não'), 't'],
    ['', (r) => { const b = el('button', 'link', 'editar'); b.type = 'button'; b.addEventListener('click', () => { email.value = r.email; nome.value = r.nome || ''; ativo.checked = r.ativo; for (const k in cb) cb[k].checked = (r.papeis || []).includes(k); email.focus(); }); return b; }]], lista)));
}

iniciar();
