
/* ---------- desenhos ---------- */
const BV = window.BV;

/* cabeçalho */
dash.draw('sync', (el) => {
  const s = dash.data('sync');
  if (s.status !== 'ok' || !s.data.length) { el.textContent = '—'; return; }
  const r = s.data[0];
  const d = new Date(r.executado_em);
  BV.mark(el, 'sync', 'executado_em', null); el.dataset.row = '0';
  el.textContent = d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + (r.status === 'ok' ? '' : ' (com avisos)');
});
dash.draw('lead-mes', (el) => { el.textContent = BV.mesLongo(BV.mesAtual()); });
const linhaMes = (id, mes) => { const s = dash.data(id); return s.status === 'ok' ? s.data.find((r) => r.mes === mes) : null; };
const janela = (j) => { const s = dash.data('janelas'); return s.status === 'ok' ? s.data.find((r) => r.janela === j) : null; };
dash.draw('lead-fat', (el) => { const r = linhaMes('setores_mes', BV.mesAtual()); if (dash.data('setores_mes').status !== 'ok') { el.textContent = '—'; return; } BV.mark(el, 'setores_mes', 'total_fat', 'mes=' + BV.mesAtual()); el.textContent = BV.brl0(r ? r.total_fat : 0); });
dash.draw('lead-ped', (el) => { const r = linhaMes('setores_mes', BV.mesAtual()); if (dash.data('setores_mes').status !== 'ok') { el.textContent = '—'; return; } BV.mark(el, 'setores_mes', 'total_ped', 'mes=' + BV.mesAtual()); el.textContent = BV.int(r ? r.total_ped : 0); });
dash.draw('lead-res', (el) => { const r = linhaMes('dre_mensal', BV.mesAtual()); if (dash.data('dre_mensal').status !== 'ok') { el.textContent = '—'; return; } BV.mark(el, 'dre_mensal', 'resultado', 'mes=' + BV.mesAtual()); el.textContent = BV.brl0(r ? r.resultado : 0); BV.sinal(el, r ? r.resultado : 0); });
dash.draw('lead-rec', (el) => { const r = janela('d30'); if (!r) { el.textContent = '—'; return; } BV.mark(el, 'janelas', 'entradas', 'janela=d30'); el.textContent = BV.brl0(r.entradas); });
dash.draw('lead-pag', (el) => { const r = janela('d30'); if (!r) { el.textContent = '—'; return; } BV.mark(el, 'janelas', 'saidas', 'janela=d30'); el.textContent = BV.brl0(r.saidas); });

/* KPIs */
const subComparacao = (el, id, campo, fmt) => {
  el.replaceChildren();
  if (dash.data(id).status !== 'ok') return;
  const ant = BV.mesAnterior(BV.mesAtual());
  const r = linhaMes(id, ant);
  const a = document.createElement('span'); a.textContent = BV.mesCurto(ant) + ' inteiro: ';
  const b = document.createElement('span'); BV.mark(b, id, campo, 'mes=' + ant); b.textContent = r ? fmt(r[campo]) : '—';
  el.append(a, b);
};
dash.draw('kpi-fat', (el) => {
  if (!BV.status(el, 'setores_mes')) { if (dash.data('setores_mes').status !== 'loading') el.textContent = '—'; return; }
  const r = linhaMes('setores_mes', BV.mesAtual());
  BV.valor(el, 'setores_mes', 'total_fat', 'mes=' + BV.mesAtual(), BV.brl0(r ? r.total_fat : 0));
});
dash.draw('kpi-fat-sub', (el) => subComparacao(el, 'setores_mes', 'total_fat', BV.brl0));
dash.draw('kpi-ticket', (el) => {
  if (!BV.status(el, 'setores_mes')) { if (dash.data('setores_mes').status !== 'loading') el.textContent = '—'; return; }
  const r = linhaMes('setores_mes', BV.mesAtual());
  BV.valor(el, 'setores_mes', 'ticket', 'mes=' + BV.mesAtual(), BV.brl(r ? r.ticket : null));
});
dash.draw('kpi-ticket-sub', (el) => subComparacao(el, 'setores_mes', 'ticket', BV.brl));
dash.draw('kpi-res', (el) => {
  if (!BV.status(el, 'dre_mensal')) { if (dash.data('dre_mensal').status !== 'loading') el.textContent = '—'; return; }
  const r = linhaMes('dre_mensal', BV.mesAtual());
  BV.valor(el, 'dre_mensal', 'resultado', 'mes=' + BV.mesAtual(), BV.brl0(r ? r.resultado : 0));
  BV.sinal(el, r ? r.resultado : 0);
});
dash.draw('kpi-res-sub', (el) => subComparacao(el, 'dre_mensal', 'resultado', BV.brl0));
dash.draw('kpi-30', (el) => {
  if (!BV.status(el, 'janelas')) { if (dash.data('janelas').status !== 'loading') el.textContent = '—'; return; }
  const r = janela('d30');
  BV.valor(el, 'janelas', 'saldo', 'janela=d30', BV.brl0(r.saldo));
  BV.sinal(el, r.saldo);
});
dash.draw('kpi-30-sub', (el) => {
  el.replaceChildren(); const r = janela('d30'); if (!r) return;
  const a = document.createElement('span'); BV.mark(a, 'janelas', 'entradas', 'janela=d30'); a.textContent = BV.brl0(r.entradas);
  const b = document.createElement('span'); BV.mark(b, 'janelas', 'saidas', 'janela=d30'); b.textContent = BV.brl0(r.saidas);
  el.append(a, document.createTextNode(' a receber · '), b, document.createTextNode(' a pagar'));
});
dash.draw('kpi-atraso', (el) => {
  if (!BV.status(el, 'janelas')) { if (dash.data('janelas').status !== 'loading') el.textContent = '—'; return; }
  const r = janela('atraso');
  BV.valor(el, 'janelas', 'saidas', 'janela=atraso', BV.brl0(r.saidas));
  el.classList.toggle('bv-neg', r.saidas > 0);
});
dash.draw('kpi-atraso-sub', (el) => {
  el.replaceChildren(); const r = janela('atraso'); if (!r) return;
  const a = document.createElement('span'); BV.mark(a, 'janelas', 'n_pagar', 'janela=atraso'); a.textContent = BV.int(r.n_pagar);
  const b = document.createElement('span'); BV.mark(b, 'janelas', 'entradas', 'janela=atraso'); b.textContent = BV.brl0(r.entradas);
  el.append(a, document.createTextNode(' contas a pagar vencidas · '), b, document.createTextNode(' a receber vencido'));
});

/* gráfico mensal */
dash.draw('chart-mensal', (el) => {
  const s = dash.data('dre_mensal');
  if (s.status !== 'ok') { if (s.status === 'error') BV.fail(el); return; }
  const atual = BV.mesAtual();
  BV.chart(el, {
    data: s.data, x: 'mes', label: 'Receita bruta, despesas e resultado por mês', height: 280,
    series: [{ key: 'receita', sign: 1, color: BV.cores[0] }, { key: 'despesas', sign: -1, color: BV.cores[1] }],
    line: { key: 'resultado' }, xfmt: BV.mesCurto, dim: (d) => d.mes > atual,
    tipTitle: (d) => BV.mesLongo(d.mes) + (d.mes > atual ? ' (previsto)' : d.mes === atual ? ' (até hoje)' : ''),
    tipRows: (d) => [['Receita bruta', BV.brl(d.receita)], ['Despesas e custos', BV.brl(d.despesas)], ['Resultado', BV.brl(d.resultado)]],
  });
});

/* DRE */
dash.draw('dre-visao-txt', (el) => {
  el.textContent = (dash.params().dre_visao || 'competencia') === 'caixa'
    ? 'Visão de caixa: entradas e saídas no mês em que o dinheiro entrou ou saiu. Compras de produção entram quando pagas; não há CMV nem estoque.'
    : 'Visão de competência: receita no mês da venda e despesas no mês a que se referem. Produto vendido entra pelo CMV; compras de produção vão para estoque.';
});
dash.draw('dre-table', (el) => {
  const fonte = (dash.params().dre_visao || 'competencia') === 'caixa' ? 'dre_tabela_caixa' : 'dre_tabela';
  el.dataset.source = fonte;
  const s = dash.data(fonte);
  if (s.status !== 'ok') { if (s.status === 'error') { el.replaceChildren(); const c = document.createElement('caption'); c.className = 'bv-fail'; c.textContent = 'Não foi possível carregar.'; el.append(c); } return; }
  const atual = BV.mesAtual();
  const todos = Object.keys(s.data[0] || {}).filter((k) => /^\d{4}-\d{2}$/.test(k)).sort();
  const p = dash.params().dre_meses || '6';
  const passados = todos.filter((m) => m <= atual);
  const futuros = todos.filter((m) => m > atual);
  const meses = p === 'todos' ? todos : [...passados.slice(-Number(p)), ...futuros];
  el.replaceChildren();
  const thead = document.createElement('thead'); const hr = document.createElement('tr');
  const h0 = document.createElement('th'); h0.dataset.field = 'nome'; h0.className = 'bv-txt'; h0.textContent = 'Linha'; hr.append(h0);
  for (const m of meses) { const th = document.createElement('th'); th.dataset.field = m; th.textContent = BV.mesCurto(m) + (m === atual ? '*' : ''); if (m > atual) th.className = 'bv-fut'; hr.append(th); }
  const ht = document.createElement('th'); ht.dataset.field = 'total'; ht.textContent = 'Total geral'; hr.append(ht);
  thead.append(hr); el.append(thead);
  const tb = document.createElement('tbody');
  for (const r of s.data) {
    const tr = document.createElement('tr'); tr.dataset.key = r.codigo;
    if (r.tipo === 'sub') tr.className = 'bv-sub'; if (r.tipo === 'tot') tr.className = 'bv-tot'; if (r.tipo === 'pct') tr.className = 'bv-pct'; if (r.tipo === 'memo') tr.className = 'bv-memo';
    if (r.codigo === 'memo_compras') tr.classList.add('bv-memo-ini');
    const td0 = document.createElement('td'); td0.className = 'bv-txt bv-dre-nome'; td0.append(document.createTextNode(r.nome));
    const def = document.querySelector('[data-linha-def="' + r.codigo + '"]');
    if (def) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'bv-info' + (r.ordem >= s.data.length - 6 ? ' bv-info-cima' : ''); b.textContent = 'ⓘ';
      b.setAttribute('aria-label', 'O que entra em ' + r.nome);
      const pop = document.createElement('span'); pop.className = 'bv-info-pop'; pop.setAttribute('role', 'tooltip'); pop.textContent = def.textContent.replace(/\s+/g, ' ').trim();
      b.append(pop); td0.append(document.createTextNode(' '), b);
    }
    tr.append(td0);
    for (const m of [...meses, 'total']) {
      const td = document.createElement('td'); const v = r[m];
      td.textContent = r.tipo === 'pct' ? BV.pct(v) : (v === 0 ? '–' : BV.brl(v));
      if (r.tipo !== 'pct' && r.tipo !== 'linha') BV.sinal(td, v);
      if (r.tipo === 'pct' && v !== null) BV.sinal(td, v);
      if (m !== 'total' && m > atual) td.classList.add('bv-fut');
      tr.append(td);
    }
    tb.append(tr);
  }
  el.append(tb);
});

/* Fluxo de caixa: janelas */
dash.draw('tab-janelas', (el) => {
  const s = dash.data('janelas');
  if (s.status !== 'ok') return;
  el.replaceChildren();
  const thead = document.createElement('thead'); const hr = document.createElement('tr');
  for (const [f, t, c] of [['nome', 'Prazo', 'bv-txt'], ['entradas', 'A receber'], ['saidas', 'A pagar'], ['saldo', 'Saldo']]) { const th = document.createElement('th'); th.dataset.field = f; th.textContent = t; if (c) th.className = c; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = document.createElement('tbody');
  for (const r of s.data) {
    const tr = document.createElement('tr'); tr.dataset.key = r.janela; if (r.janela === 'atraso') tr.className = 'bv-sub';
    const a = document.createElement('td'); a.className = 'bv-txt'; a.textContent = r.nome;
    const b = document.createElement('td'); b.textContent = BV.brl(r.entradas);
    const c = document.createElement('td'); c.textContent = BV.brl(r.saidas); if (r.janela === 'atraso' && r.saidas > 0) c.classList.add('bv-neg');
    const d = document.createElement('td'); d.textContent = BV.brl(r.saldo); BV.sinal(d, r.saldo);
    tr.append(a, b, c, d); tb.append(tr);
  }
  el.append(tb);
});

/* Fluxo de caixa: previsão diária */
dash.draw('chart-prev', (el) => {
  const s = dash.data('previsao_diaria');
  if (s.status !== 'ok') { if (s.status === 'error') BV.fail(el); return; }
  const saldo = Number(dash.params().saldo) || 0;
  const dados = s.data.map((d) => ({ ...d, projetado: Math.round((saldo + d.acumulado) * 100) / 100 }));
  BV.chart(el, {
    data: dados, x: 'data', label: 'Entradas e saídas previstas por dia nos próximos 90 dias e saldo projetado', height: 280,
    series: [{ key: 'entradas', sign: 1, color: BV.cores[0] }, { key: 'saidas', sign: -1, color: BV.cores[1] }],
    line: { key: 'projetado' }, xfmt: BV.dataCurta,
    tipTitle: (d) => BV.data(d.data),
    tipRows: (d) => [['A receber', BV.brl(d.entradas)], ['A pagar', BV.brl(d.saidas)], ['Saldo do dia', BV.brl(d.liquido)], ['Saldo projetado', BV.brl(d.projetado)]],
  });
});

/* Fluxo de caixa: lançamentos em aberto */
dash.draw('tab-prox', (el) => {
  const s = dash.data('caixa');
  if (s.status !== 'ok') return;
  const hoje = BV.hoje();
  const lim = new Date(hoje + 'T00:00:00Z'); lim.setUTCDate(lim.getUTCDate() + 90); const fim = lim.toISOString().slice(0, 10);
  const tipo = dash.params().prox_tipo || 'todos';
  const rows = s.data.filter((r) => r.valor_em_aberto > 0 && r.vencimento && r.vencimento <= fim && (tipo === 'todos' || r.tipo === tipo))
    .sort((a, b) => d3.ascending(a.vencimento, b.vencimento) || d3.ascending(a.tipo, b.tipo));
  el.replaceChildren();
  const thead = document.createElement('thead'); const hr = document.createElement('tr');
  for (const [f, t, c] of [['vencimento', 'Vencimento', 'bv-txt'], ['tipo', 'Tipo', 'bv-txt'], ['contraparte', 'Fornecedor / cliente', 'bv-txt'], ['descricao', 'Descrição', 'bv-txt'], ['categoria', 'Categoria', 'bv-txt'], ['valor_em_aberto', 'Em aberto']]) {
    const th = document.createElement('th'); th.dataset.field = f; th.textContent = t; if (c) th.className = c; hr.append(th);
  }
  thead.append(hr); el.append(thead);
  const tb = document.createElement('tbody');
  if (!rows.length) { const tr = document.createElement('tr'); const td = document.createElement('td'); td.colSpan = 6; td.className = 'bv-txt'; td.textContent = 'Nada em aberto nesse prazo.'; tr.append(td); tb.append(tr); }
  for (const r of rows) {
    const tr = document.createElement('tr'); tr.dataset.key = encodeURIComponent(r.tipo) + ',' + encodeURIComponent(r.id);
    const atrasado = r.vencimento < hoje;
    const a = document.createElement('td'); a.className = 'bv-txt'; a.textContent = BV.data(r.vencimento) + ' ';
    if (atrasado) { const p = document.createElement('span'); p.className = 'bv-pill bv-bad'; p.textContent = 'atrasado'; a.append(p); }
    else if (r.vencimento === hoje) { const p = document.createElement('span'); p.className = 'bv-pill bv-warn'; p.textContent = 'hoje'; a.append(p); }
    const b = document.createElement('td'); b.className = 'bv-txt'; const pb = document.createElement('span'); pb.className = 'bv-pill ' + (r.tipo === 'receber' ? 'bv-in' : 'bv-out'); pb.textContent = r.tipo === 'receber' ? 'a receber' : 'a pagar'; b.append(pb);
    const c = document.createElement('td'); c.className = 'bv-txt'; c.textContent = r.contraparte || '—';
    const d = document.createElement('td'); d.className = 'bv-txt'; d.textContent = r.descricao || '—';
    const e = document.createElement('td'); e.className = 'bv-txt'; e.textContent = r.categoria || 'Sem categoria';
    const f = document.createElement('td'); f.textContent = BV.brl(r.valor_em_aberto); if (r.tipo === 'pagar') f.classList.add(atrasado ? 'bv-neg' : 'bv-out');
    tr.append(a, b, c, d, e, f); tb.append(tr);
  }
  el.append(tb);
});

/* Fluxo de caixa: realizado */
const periodoAtual = () => dash.params().real_periodo || 'mes_atual';
const realLinha = () => { const s = dash.data('realizado_periodos'); return s.status === 'ok' ? s.data.find((r) => r.periodo === periodoAtual()) : null; };
dash.draw('real-ent', (el) => { const r = realLinha(); if (!r) { el.textContent = '—'; return; } BV.valor(el, 'realizado_periodos', 'entradas', 'periodo=' + r.periodo, BV.brl0(r.entradas)); });
dash.draw('real-ent-sub', (el) => {
  el.replaceChildren(); const r = realLinha(); if (!r) return;
  const a = document.createElement('span'); BV.mark(a, 'realizado_periodos', 'aportes_socios', 'periodo=' + r.periodo); a.textContent = BV.brl0(r.aportes_socios);
  el.append(a, document.createTextNode(' de aportes e empréstimos de sócios'));
});
dash.draw('real-sai', (el) => { const r = realLinha(); if (!r) { el.textContent = '—'; return; } BV.valor(el, 'realizado_periodos', 'saidas', 'periodo=' + r.periodo, BV.brl0(r.saidas)); });
dash.draw('real-liq', (el) => { const r = realLinha(); if (!r) { el.textContent = '—'; return; } BV.valor(el, 'realizado_periodos', 'saldo', 'periodo=' + r.periodo, BV.brl0(r.saldo)); BV.sinal(el, r.saldo); });
dash.draw('real-liq-sub', (el) => {
  el.replaceChildren(); const r = realLinha(); if (!r) return;
  const a = document.createElement('span'); BV.mark(a, 'realizado_periodos', 'entradas_operacionais', 'periodo=' + r.periodo); a.textContent = BV.brl0(r.entradas_operacionais);
  el.append(document.createTextNode('Entradas sem aportes: '), a);
});
dash.draw('chart-real', (el) => {
  const s = dash.data('caixa');
  if (s.status !== 'ok') { if (s.status === 'error') BV.fail(el); return; }
  const hoje = BV.hoje(), mesAtual = hoje.slice(0, 7), mesAnt = BV.mesAnterior(mesAtual);
  const d90 = new Date(hoje + 'T00:00:00Z'); d90.setUTCDate(d90.getUTCDate() - 89); const ini90 = d90.toISOString().slice(0, 10);
  const ok = { mes_atual: (x) => x.slice(0, 7) === mesAtual, mes_anterior: (x) => x.slice(0, 7) === mesAnt, ult_90: (x) => x >= ini90 && x <= hoje, ano: (x) => x.slice(0, 4) === hoje.slice(0, 4), tudo: () => true }[periodoAtual()] || (() => true);
  const grao = dash.params().real_grao || 'dia';
  const chave = (iso) => {
    if (grao === 'mes') return iso.slice(0, 7);
    if (grao === 'semana') { const d = new Date(iso + 'T00:00:00Z'); const dow = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - dow); return d.toISOString().slice(0, 10); }
    return iso;
  };
  const rs = s.data.filter((r) => r.data_baixa && r.valor_baixado > 0 && ok(r.data_baixa));
  const g = d3.rollups(rs, (v) => ({ entradas: d3.sum(v, (r) => (r.tipo === 'receber' ? r.valor_baixado : 0)), saidas: d3.sum(v, (r) => (r.tipo === 'pagar' ? r.valor_baixado : 0)) }), (r) => chave(r.data_baixa))
    .sort((a, b) => d3.ascending(a[0], b[0]));
  let acc = 0;
  const dados = g.map(([k, o]) => { acc += o.entradas - o.saidas; return { k, entradas: o.entradas, saidas: o.saidas, acumulado: acc }; });
  BV.chart(el, {
    data: dados, x: 'k', label: 'Recebido e pago no período e saldo acumulado', height: 260, vazio: 'Nenhum pagamento ou recebimento no período.',
    series: [{ key: 'entradas', sign: 1, color: BV.cores[0] }, { key: 'saidas', sign: -1, color: BV.cores[1] }],
    line: { key: 'acumulado' }, xfmt: grao === 'mes' ? BV.mesCurto : BV.dataCurta,
    tipTitle: (d) => (grao === 'mes' ? BV.mesLongo(d.k) : grao === 'semana' ? 'Semana de ' + BV.data(d.k) : BV.data(d.k)),
    tipRows: (d) => [['Recebido', BV.brl(d.entradas)], ['Pago', BV.brl(d.saidas)], ['Acumulado no período', BV.brl(d.acumulado)]],
  });
});
dash.draw('tab-cat', (el) => {
  const s = dash.data('saidas_categoria');
  if (s.status !== 'ok') return;
  const per = periodoAtual();
  const rows = s.data.filter((r) => r.periodo === per);
  const max = d3.max(rows, (r) => r.valor) || 1;
  const nomes = { cmv: 'CMV', variaveis: 'Variáveis', marketing: 'Marketing', comerciais: 'Comerciais', administrativas: 'Administrativas', pessoal: 'Pessoal', financeiro: 'Financeiro', impostos_lucro: 'IR/CSLL', deducoes: 'Deduções', fora: 'Fora da DRE', sem_categoria: 'Sem categoria' };
  el.replaceChildren();
  const thead = document.createElement('thead'); const hr = document.createElement('tr');
  for (const [f, t, c] of [['categoria', 'Categoria', 'bv-txt'], ['linha_dre', 'Linha da DRE', 'bv-txt'], ['lancamentos', 'Pagamentos'], ['valor', 'Valor pago']]) { const th = document.createElement('th'); th.dataset.field = f; th.textContent = t; if (c) th.className = c; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = document.createElement('tbody');
  if (!rows.length) { const tr = document.createElement('tr'); const td = document.createElement('td'); td.colSpan = 4; td.className = 'bv-txt'; td.textContent = 'Nenhum pagamento no período.'; tr.append(td); tb.append(tr); }
  for (const r of rows) {
    const tr = document.createElement('tr'); tr.dataset.key = encodeURIComponent(r.periodo) + ',' + encodeURIComponent(r.categoria);
    const a = document.createElement('td'); a.className = 'bv-txt'; a.textContent = r.categoria;
    const b = document.createElement('td'); b.className = 'bv-txt'; b.textContent = nomes[r.linha_dre] || r.linha_dre || '—';
    const c = document.createElement('td'); c.textContent = BV.int(r.lancamentos);
    const d = document.createElement('td'); const bar = document.createElement('span'); bar.className = 'bv-bar'; bar.style.width = Math.max(2, (r.valor / max) * 80) + 'px'; bar.style.marginRight = '8px';
    d.append(bar, document.createTextNode(BV.brl(r.valor)));
    tr.append(a, b, c, d); tb.append(tr);
  }
  el.append(tb);
});

/* Setores */
/* barras empilhadas por mês */
const empilhado = (el, dados, chaves, nomes, label) => {
  el.replaceChildren();
  if (!dados.length) return;
  for (const d of dados) d.total = d3.sum(chaves, (k) => d[k] || 0);
  const meses = dados.map((d) => d.mes);
  const width = Math.max(280, el.clientWidth || 600), height = 260, m = { t: 16, r: 10, b: 26, l: 40 };
  const svg = d3.select(el).append('svg').attr('width', width).attr('height', height).attr('role', 'img').attr('aria-label', label);
  const tip = d3.select(el).append('div').attr('class', 'bv-tip').style('display', 'none');
  const y = d3.scaleLinear().domain([0, d3.max(dados, (d) => d.total) || 1]).nice().range([height - m.b, m.t]);
  const gy = svg.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(BV.curto).tickSize(0)).call((g) => g.select('.domain').remove());
  let wl = 0; gy.selectAll('text').each(function () { wl = Math.max(wl, this.getComputedTextLength()); }); m.l = Math.ceil(wl) + 10; gy.attr('transform', `translate(${m.l},0)`);
  svg.insert('g', ':first-child').selectAll('line').data(y.ticks(5)).join('line').attr('x1', m.l).attr('x2', width - m.r).attr('y1', (v) => y(v)).attr('y2', (v) => y(v)).style('stroke', 'var(--cds-chart-grid)');
  const x = d3.scaleBand().domain(meses).range([m.l, width - m.r]).padding(0.3);
  const every = Math.max(1, Math.ceil(meses.length / Math.max(2, Math.floor((width - m.l) / 56))));
  svg.append('g').attr('transform', `translate(0,${height - m.b})`).call(d3.axisBottom(x).tickValues(meses.filter((k, i) => i % every === 0)).tickFormat(BV.mesCurto).tickSize(0).tickPadding(8)).call((g) => g.select('.domain').remove());
  const series = d3.stack().keys(chaves).value((d, k) => d[k] || 0)(dados);
  svg.append('g').selectAll('g').data(series).join('g').style('fill', (d, i) => BV.cores[i % BV.cores.length])
    .selectAll('rect').data((d) => d).join('rect').attr('x', (d) => x(d.data.mes)).attr('width', x.bandwidth()).attr('y', (d) => y(d[1])).attr('height', (d) => Math.max(0, y(d[0]) - y(d[1])));
  if (x.bandwidth() >= 24) svg.append('g').selectAll('text').data(dados).join('text').attr('x', (d) => x(d.mes) + x.bandwidth() / 2).attr('y', (d) => y(d.total) - 5).attr('text-anchor', 'middle')
    .style('fill', 'var(--color-fg)').style('font-size', 'var(--cds-font-size-caption)').style('font-variant-numeric', 'tabular-nums').text((d) => (d.total ? BV.curto(d.total) : ''));
  svg.append('g').selectAll('rect').data(dados).join('rect').attr('x', (d) => x(d.mes) - (x.step() * x.paddingInner()) / 2).attr('width', x.step()).attr('y', m.t).attr('height', height - m.t - m.b).style('fill', 'transparent')
    .on('pointerenter pointermove', (ev, d) => {
      const t = tip.node(); tip.style('display', null); t.replaceChildren();
      const h = document.createElement('b'); h.textContent = BV.mesLongo(d.mes); t.append(h);
      chaves.forEach((k, i) => { if (!d[k]) return; const row = document.createElement('div'); row.className = 'bv-tip-row'; const a = document.createElement('span'); a.textContent = nomes[i]; const b = document.createElement('span'); b.textContent = BV.brl(d[k]); row.append(a, b); t.append(row); });
      const row = document.createElement('div'); row.className = 'bv-tip-row'; const a = document.createElement('span'); a.textContent = 'Total'; const b = document.createElement('span'); b.textContent = BV.brl(d.total); row.append(a, b); t.append(row);
      const [px, py] = d3.pointer(ev, el); t.style.left = Math.max(0, Math.min(el.clientWidth - t.offsetWidth, px + 12)) + 'px'; t.style.top = Math.max(0, Math.min(height - t.offsetHeight, py - t.offsetHeight - 8)) + 'px';
    })
    .on('pointerleave', () => tip.style('display', 'none'));
};
dash.draw('chart-setores', (el) => {
  const s = dash.data('pedidos_mes');
  if (s.status !== 'ok') { if (s.status === 'error') BV.fail(el); return; }
  const lojas = ['PDV', 'Shopify', 'Vendas orgânicas', 'Sem loja'];
  const meses = [...new Set(s.data.map((r) => r.mes))].sort();
  const dados = meses.map((mes) => { const o = { mes }; for (const l of lojas) o[l] = d3.sum(s.data.filter((r) => r.mes === mes && r.loja === l), (r) => r.faturamento); return o; });
  empilhado(el, dados, lojas, lojas, 'Faturamento de vendas por mês e por loja');
});
const tabelaMeses = (el, cols) => {
  const s = dash.data('setores_mes');
  if (s.status !== 'ok') return;
  const rows = s.data.filter((r) => r.mes <= BV.mesAtual()).slice().reverse();
  el.replaceChildren();
  const thead = document.createElement('thead'); const hr = document.createElement('tr');
  for (const [f, t] of cols) { const th = document.createElement('th'); th.dataset.field = f; th.textContent = t; if (f === 'mes') th.className = 'bv-txt'; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = document.createElement('tbody');
  for (const r of rows) {
    const tr = document.createElement('tr'); tr.dataset.key = r.mes;
    for (const [f, , fmt] of cols) { const td = document.createElement('td'); if (f === 'mes') { td.className = 'bv-txt'; td.textContent = BV.mesLongo(r.mes) + (r.mes === BV.mesAtual() ? ' (até hoje)' : ''); } else td.textContent = fmt(r[f]); tr.append(td); }
    tb.append(tr);
  }
  el.append(tb);
};
dash.draw('tab-setores', (el) => tabelaMeses(el, [
  ['mes', 'Mês'], ['pdv_fat', 'PDV', BV.brl], ['pdv_ped', 'Pedidos PDV', BV.int], ['ecom_fat', 'Ecommerce', BV.brl], ['ecom_ped', 'Pedidos Ecommerce', BV.int],
  ['shopify_fat', 'Shopify', BV.brl], ['organicas_fat', 'Vendas orgânicas', BV.brl], ['total_fat', 'Total de vendas', BV.brl], ['ticket', 'Ticket médio', BV.brl],
]));

/* Marketing */
const mkt = (mes) => { const s = dash.data('marketing_resumo'); return s.status === 'ok' ? s.data.find((r) => r.mes === mes) : null; };
const mktPronto = (el) => {
  const st = dash.data('marketing_resumo').status;
  if (st === 'ok') return true;
  if (st !== 'loading') { el.classList.remove('dash-skeleton'); el.textContent = '—'; }
  return false;
};
const mktSub = (el, campo, fmt) => {
  el.replaceChildren();
  if (dash.data('marketing_resumo').status !== 'ok') return;
  const ant = BV.mesAnterior(BV.mesAtual()); const r = mkt(ant);
  const a = document.createElement('span'); BV.mark(a, 'marketing_resumo', campo, 'mes=' + ant); a.textContent = r ? fmt(r[campo]) : '—';
  el.append(document.createTextNode(BV.mesCurto(ant) + ' inteiro: '), a);
};
dash.draw('mkt-total', (el) => { if (!mktPronto(el)) return; const r = mkt(BV.mesAtual()); BV.valor(el, 'marketing_resumo', 'investimento_total', 'mes=' + BV.mesAtual(), BV.brl0(r ? r.investimento_total : 0)); });
dash.draw('mkt-total-sub', (el) => mktSub(el, 'investimento_total', BV.brl0));
dash.draw('mkt-bonif', (el) => { if (!mktPronto(el)) return; const r = mkt(BV.mesAtual()); BV.valor(el, 'marketing_resumo', 'bonificacoes', 'mes=' + BV.mesAtual(), BV.brl0(r ? r.bonificacoes : 0)); });
dash.draw('mkt-bonif-sub', (el) => {
  el.replaceChildren(); if (dash.data('marketing_resumo').status !== 'ok') return; const r = mkt(BV.mesAtual()); const w = 'mes=' + BV.mesAtual();
  const a = document.createElement('span'); BV.mark(a, 'marketing_resumo', 'envios', w); a.textContent = BV.int(r ? r.envios : 0);
  const b = document.createElement('span'); BV.mark(b, 'marketing_resumo', 'unidades', w); b.textContent = BV.int(r ? r.unidades : 0);
  el.append(a, document.createTextNode(' envios · '), b, document.createTextNode(' unidades'));
});
dash.draw('mkt-envio', (el) => { if (!mktPronto(el)) return; const r = mkt(BV.mesAtual()); BV.valor(el, 'marketing_resumo', 'custo_por_envio', 'mes=' + BV.mesAtual(), BV.brl(r ? r.custo_por_envio : null)); });
dash.draw('mkt-envio-sub', (el) => {
  el.replaceChildren(); if (dash.data('marketing_resumo').status !== 'ok') return; const r = mkt(BV.mesAtual()); if (!r) return; const w = 'mes=' + BV.mesAtual();
  const a = document.createElement('span'); BV.mark(a, 'marketing_resumo', 'envios_influ', w); a.textContent = BV.int(r.envios_influ);
  el.append(a, document.createTextNode(' envios a influenciadores'));
  if (r.envios_volume) {
    const b = document.createElement('span'); BV.mark(b, 'marketing_resumo', 'envios_volume', w); b.textContent = BV.int(r.envios_volume);
    const c = document.createElement('span'); BV.mark(c, 'marketing_resumo', 'custo_volume', w); c.textContent = BV.brl0(r.custo_volume);
    el.append(document.createTextNode(' · fora da média: '), b, document.createTextNode(r.envios_volume === 1 ? ' ação de volume (' : ' ações de volume ('), c, document.createTextNode(')'));
  }
});
dash.draw('mkt-meta', (el) => { if (!mktPronto(el)) return; const r = mkt(BV.mesAtual()); BV.valor(el, 'marketing_resumo', 'meta_ads', 'mes=' + BV.mesAtual(), BV.brl0(r ? r.meta_ads : 0)); });
dash.draw('mkt-meta-sub', (el) => {
  el.replaceChildren(); if (dash.data('marketing_resumo').status !== 'ok') return; const r = mkt(BV.mesAtual());
  if (!r || r.roas_meta === null) { el.textContent = 'Retorno: resultado do mês ainda não informado'; return; }
  const a = document.createElement('span'); BV.mark(a, 'marketing_resumo', 'roas_meta', 'mes=' + BV.mesAtual()); a.textContent = BV.dec(r.roas_meta) + '×';
  el.append(document.createTextNode('Retorno: '), a);
});
dash.draw('chart-marketing', (el) => {
  const s = dash.data('marketing_resumo');
  if (s.status !== 'ok') { if (s.status === 'error') BV.fail(el); return; }
  const dados = s.data.map((r) => ({ mes: r.mes, bonificacoes: r.bonificacoes, meta_ads: r.meta_ads, outros_marketing: r.outros_marketing }));
  empilhado(el, dados, ['bonificacoes', 'meta_ads', 'outros_marketing'], ['Bonificações', 'Meta Ads', 'Outros'], 'Investimento em marketing por mês: bonificações, Meta Ads e outros');
});
dash.draw('tab-marketing', (el) => {
  const s = dash.data('marketing_resumo');
  if (s.status !== 'ok') return;
  const cols = [
    ['mes', 'Mês'], ['bonificacoes', 'Bonificações', BV.brl], ['envios', 'Envios', BV.int], ['unidades', 'Unidades', BV.int], ['custo_por_envio', 'Custo por envio (influenc.)', BV.brl], ['envios_volume', 'Ações de volume', BV.int], ['custo_volume', 'Custo ações de volume', BV.brl],
    ['meta_ads', 'Meta Ads', BV.brl], ['resultado_performance', 'Resultado Meta (informado)', (v) => (v === null ? 'não informado' : BV.brl(v))], ['roas_meta', 'Retorno Meta', (v) => (v === null ? '—' : BV.dec(v) + '×')],
    ['outros_marketing', 'Outros', BV.brl], ['investimento_total', 'Total', BV.brl], ['pct_faturamento', '% do faturamento', BV.pct], ['bonif_valor_tabela', 'Valor de tabela enviado', BV.brl],
  ];
  const rows = s.data.filter((r) => r.mes <= BV.mesAtual()).slice().reverse();
  el.replaceChildren();
  const thead = document.createElement('thead'); const hr = document.createElement('tr');
  for (const [f, t] of cols) { const th = document.createElement('th'); th.dataset.field = f; th.textContent = t; if (f === 'mes') th.className = 'bv-txt'; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = document.createElement('tbody');
  for (const r of rows) {
    const tr = document.createElement('tr'); tr.dataset.key = r.mes;
    for (const [f, , fmt] of cols) { const td = document.createElement('td'); if (f === 'mes') { td.className = 'bv-txt'; td.textContent = BV.mesLongo(r.mes) + (r.mes === BV.mesAtual() ? ' (até hoje)' : ''); } else td.textContent = fmt(r[f]); if (f === 'investimento_total') td.style.fontWeight = 'var(--cds-font-weight-medium)'; tr.append(td); }
    tb.append(tr);
  }
  el.append(tb);
});
dash.draw('bonif-meses', (sel) => {
  const s = dash.data('bonificacoes');
  const meses = s.status === 'ok' ? [...new Set(s.data.map((r) => r.mes))].sort().reverse() : [];
  sel.replaceChildren(new Option('Todos os meses', 'todos'), ...meses.map((m) => new Option(BV.mesLongo(m), m)));
  sel.value = dash.params().bonif_mes || 'todos';
  if (sel.value === '') sel.value = 'todos';
});
dash.draw('tab-bonif', (el) => {
  const s = dash.data('bonificacoes');
  if (s.status !== 'ok') return;
  const mes = dash.params().bonif_mes || 'todos';
  const rows = s.data.filter((r) => mes === 'todos' || r.mes === mes).sort((a, b) => d3.descending(a.data, b.data) || d3.descending(a.investimento, b.investimento));
  const cols = [['data', 'Data', 'bv-txt'], ['destinatario', 'Destinatário', 'bv-txt'], ['tipo', 'Tipo', 'bv-txt'], ['itens', 'Itens', 'bv-txt'], ['unidades', 'Unidades'], ['custo_produto', 'Produto'], ['custo_envio', 'Envio'], ['investimento', 'Custo total'], ['valor_tabela', 'Valor de tabela']];
  el.replaceChildren();
  const thead = document.createElement('thead'); const hr = document.createElement('tr');
  for (const [f, t, c] of cols) { const th = document.createElement('th'); th.dataset.field = f; th.textContent = t; if (c) th.className = c; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = document.createElement('tbody');
  for (const r of rows) {
    const tr = document.createElement('tr'); tr.dataset.key = r.id;
    const vals = [BV.data(r.data), r.destinatario || '—', r.tipo === 'acao_volume' ? 'ação de volume' : 'influenciador', r.itens || (r.sem_itens ? 'itens ainda não sincronizados' : '—'), BV.int(r.unidades), BV.brl(r.custo_produto), BV.brl(r.custo_envio), BV.brl(r.investimento), BV.brl(r.valor_tabela)];
    vals.forEach((v, i) => { const td = document.createElement('td'); if (cols[i][2]) td.className = 'bv-txt'; td.textContent = v; if (cols[i][0] === 'investimento') td.style.fontWeight = 'var(--cds-font-weight-medium)'; tr.append(td); });
    tb.append(tr);
  }
  const tf = document.createElement('tfoot'); const fr = document.createElement('tr'); fr.className = 'bv-tot';
  const tot = (k) => d3.sum(rows, (r) => r[k] || 0);
  [`${rows.length} envios`, '', '', '', BV.int(tot('unidades')), BV.brl(tot('custo_produto')), BV.brl(tot('custo_envio')), BV.brl(tot('investimento')), BV.brl(tot('valor_tabela'))]
    .forEach((v, i) => { const td = document.createElement('td'); if (cols[i][2]) td.className = 'bv-txt'; td.textContent = v; fr.append(td); });
  tf.append(fr);
  el.append(tb, tf);
});

/* ===== Metas: placar ===== */
const mesMetas = () => dash.params().metas_mes || BV.mesAtual();
const pl = (area) => { const s = dash.data('placar'); return s.status === 'ok' ? s.data.find((r) => r.mes === mesMetas() && r.area === area) || null : null; };
const nd = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined && txt !== null) e.textContent = txt; return e; };
const mk = (e, area, campo) => { BV.mark(e, 'placar', campo, 'mes=' + mesMetas() + '&area=' + area); return e; };
const SVGNS = 'http://www.w3.org/2000/svg';
const coroa = (px) => {
  const s = document.createElementNS(SVGNS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', px); s.setAttribute('height', px); s.setAttribute('aria-hidden', 'true'); s.classList.add('bv-coroa');
  const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', 'M3 18.5h18l-1.7-10.2-4.7 4.1L12 5l-2.6 7.4-4.7-4.1z M3.5 20h17v1.5h-17z'); s.append(p); return s;
};
const badge = (r) => {
  if (!r || r.nivel === null) return null;
  const b = nd('span', 'bv-nivel-badge'); b.dataset.nivel = String(r.nivel_ordem);
  if (r.nivel_ordem >= 4) b.append(coroa(13));
  b.append(document.createTextNode(r.nivel)); return b;
};
const placarPronto = (el) => {
  const st = dash.data('placar').status;
  if (st === 'ok') { el.classList.remove('dash-skeleton'); return true; }
  if (st !== 'loading') { el.classList.remove('dash-skeleton'); el.textContent = '—'; }
  return false;
};
const ehAtual = () => mesMetas() === BV.mesAtual();

dash.draw('metas-meses', (sel) => {
  const s = dash.data('placar');
  const meses = s.status === 'ok' ? [...new Set(s.data.filter((r) => r.mes >= '2026-09' && r.mes <= BV.mesAtual()).map((r) => r.mes))].sort().reverse() : [];
  if (!meses.includes(BV.mesAtual())) meses.unshift(BV.mesAtual());
  sel.replaceChildren(...meses.map((m) => new Option(BV.mesLongo(m) + (m === BV.mesAtual() ? ' (atual)' : ''), m)));
  sel.value = mesMetas();
});

dash.draw('placar-mes', (el) => { el.textContent = BV.mesLongo(mesMetas()); });
dash.draw('placar-total', (el) => {
  if (!placarPronto(el)) return; const r = pl('total');
  el.replaceChildren(); if (!r) { el.textContent = '—'; return; }
  el.append(mk(nd('span', null, BV.brl0(r.realizado)), 'total', 'realizado'));
});
dash.draw('placar-meta', (el) => {
  el.replaceChildren(); const r = pl('total'); if (!r) return;
  if (r.meta === null) { el.textContent = 'sem meta cadastrada para o mês'; return; }
  el.append(document.createTextNode('de '), mk(nd('span', null, BV.brl0(r.meta)), 'total', 'meta'), document.createTextNode(' · '), mk(nd('b', null, BV.pct(r.pct)), 'total', 'pct'));
});
dash.draw('placar-nivel', (el) => { el.replaceChildren(); const b = badge(pl('total')); if (b) el.append(b); });

const trilha = (el, r, opts) => {
  el.replaceChildren();
  if (!r || r.meta === null) return;
  const o = opts || {};
  const escala = Math.max(1, r.pct || 0, (ehAtual() && r.pct_projecao) || 0) * 1.04;
  const pos = (v) => Math.max(0, Math.min(100, (v / escala) * 100)) + '%';
  const track = nd('div', 'bv-trilha-track');
  const fill = nd('div', 'bv-trilha-fill'); fill.style.width = pos(r.pct || 0); track.append(fill);
  for (const m of [0.25, 0.5, 0.75, 1]) {
    const t = nd('div', 'bv-marco' + ((r.pct || 0) >= m ? ' bv-marco-ok' : '') + (m === 1 ? ' bv-marco-meta' : '')); t.style.left = pos(m);
    t.append(nd('span', 'bv-marco-rot', m === 1 ? 'meta' : Math.round(m * 100) + '%'));
    if (m === 1 && (r.pct || 0) >= 1) t.append(coroa(14));
    track.append(t);
  }
  if (ehAtual() && r.esperado_hoje !== null) {
    const e = nd('div', 'bv-ritmo-hoje'); e.style.left = pos(r.esperado_hoje / r.meta);
    e.append(nd('span', 'bv-ritmo-rot', o.curto ? 'hoje' : 'onde deveria estar hoje')); track.append(e);
  }
  if (ehAtual() && r.pct_projecao !== null) {
    const p = nd('div', 'bv-proj'); p.style.left = pos(r.pct_projecao); p.title = ''; track.append(p);
  }
  el.append(track);
  el.setAttribute('aria-label', `${BV.pct(r.pct)} da meta${ehAtual() && r.pct_projecao !== null ? '; no ritmo atual fecha em ' + BV.pct(r.pct_projecao) : ''}`);
};
dash.draw('placar-trilha', (el) => trilha(el, pl('total')));

const stat = (rot, valor, cls) => { const d = nd('div', 'bv-stat'); d.append(nd('span', 'bv-stat-rot', rot)); const v = nd('span', 'bv-stat-val' + (cls ? ' ' + cls : '')); if (valor instanceof Node) v.append(valor); else v.textContent = valor; d.append(v); return d; };
dash.draw('placar-stats', (el) => {
  el.replaceChildren(); const r = pl('total'); if (!r || r.meta === null) return;
  const w = (campo, txt) => mk(nd('span', null, txt), 'total', campo);
  if (ehAtual()) {
    el.append(stat('Falta', r.falta > 0 ? w('falta', BV.brl0(r.falta)) : 'meta batida'));
    if (r.falta > 0) el.append(stat(`Cota por dia · ${r.dias_restantes} dias`, w('por_dia', BV.brl0(r.por_dia))));
    el.append(stat('Ritmo atual por dia', w('ritmo_atual_dia', BV.brl0(r.ritmo_atual_dia))));
    const dif = r.diferenca_ritmo;
    el.append(stat(dif >= 0 ? 'À frente do ritmo' : 'Atrás do ritmo', w('diferenca_ritmo', BV.brl0(Math.abs(dif))), dif >= 0 ? 'bv-pos' : 'bv-neg'));
    el.append(stat('No ritmo atual fecha em', w('projecao', BV.brl0(r.projecao) + ' · ' + BV.pct(r.pct_projecao))));
  } else {
    el.append(stat('Fechou em', w('pct', BV.pct(r.pct)), r.pct >= 1 ? 'bv-pos' : 'bv-neg'));
    el.append(stat(r.pct >= 1 ? 'Acima da meta' : 'Abaixo da meta', w('realizado', BV.brl0(Math.abs(r.realizado - r.meta)))));
    el.append(stat('Ticket médio', w('ticket', BV.brl(r.ticket))));
  }
});

const anel = (pct, rotulo, sub) => {
  const tam = 104, rr = 44, c = 2 * Math.PI * rr;
  const s = document.createElementNS(SVGNS, 'svg'); s.setAttribute('viewBox', `0 0 ${tam} ${tam}`); s.setAttribute('width', tam); s.setAttribute('height', tam); s.classList.add('bv-anel');
  s.setAttribute('role', 'img'); s.setAttribute('aria-label', pct === null ? rotulo : BV.pct(pct) + ' ' + (sub || 'da meta'));
  const bg = document.createElementNS(SVGNS, 'circle'); bg.setAttribute('cx', tam / 2); bg.setAttribute('cy', tam / 2); bg.setAttribute('r', rr); bg.classList.add('bv-anel-trilho'); s.append(bg);
  if (pct !== null) {
    const fg = document.createElementNS(SVGNS, 'circle'); fg.setAttribute('cx', tam / 2); fg.setAttribute('cy', tam / 2); fg.setAttribute('r', rr); fg.classList.add('bv-anel-arco');
    fg.setAttribute('stroke-dasharray', `${Math.min(1, pct) * c} ${c}`); fg.setAttribute('transform', `rotate(-90 ${tam / 2} ${tam / 2})`); s.append(fg);
    if (pct > 1) {
      const ex = document.createElementNS(SVGNS, 'circle'); ex.setAttribute('cx', tam / 2); ex.setAttribute('cy', tam / 2); ex.setAttribute('r', rr - 9); ex.classList.add('bv-anel-extra');
      const c2 = 2 * Math.PI * (rr - 9); ex.setAttribute('stroke-dasharray', `${Math.min(1, pct - 1) * c2} ${c2}`); ex.setAttribute('transform', `rotate(-90 ${tam / 2} ${tam / 2})`); s.append(ex);
    }
  }
  const t = document.createElementNS(SVGNS, 'text'); t.setAttribute('x', tam / 2); t.setAttribute('y', tam / 2 + (sub ? 2 : 7)); t.setAttribute('text-anchor', 'middle'); t.classList.add('bv-anel-num');
  t.textContent = pct === null ? rotulo : Math.round(pct * 100) + '%'; s.append(t);
  if (sub) { const u = document.createElementNS(SVGNS, 'text'); u.setAttribute('x', tam / 2); u.setAttribute('y', tam / 2 + 18); u.setAttribute('text-anchor', 'middle'); u.classList.add('bv-anel-sub'); u.textContent = sub; s.append(u); }
  return s;
};
const linha = (...partes) => { const p = nd('p', 'bv-area-linha'); for (const x of partes) p.append(x instanceof Node ? x : document.createTextNode(x)); return p; };

dash.draw('area', (el) => {
  const area = el.dataset.area;
  el.replaceChildren();
  const st = dash.data('placar').status;
  if (st !== 'ok') { if (st !== 'loading') el.append(nd('p', 'bv-area-linha', 'Não foi possível carregar.')); return; }
  const r = pl(area); if (!r) { el.append(nd('p', 'bv-area-linha', 'Sem dados para o mês.')); return; }
  const eco = pl('ecommerce');
  const w = (campo, txt, tag) => mk(nd(tag || 'b', null, txt), area, campo);
  const topo = nd('div', 'bv-area-head');
  let pct = r.pct, sub = 'da meta', rot = '—';
  if (area === 'organica') { pct = eco && eco.meta ? r.realizado / eco.meta : null; sub = 'do ecommerce'; rot = 's/ meta'; }
  if (area === 'performance' && r.realizado === null) { pct = null; rot = 'API'; }
  topo.append(anel(pct, rot, pct === null ? null : sub));
  const nums = nd('div', 'bv-area-nums');
  const val = nd('span', 'bv-area-val');
  if (r.realizado === null) val.textContent = 'aguardando'; else val.append(mk(nd('span', null, BV.brl0(r.realizado)), area, 'realizado'));
  nums.append(val);
  if (r.meta !== null) nums.append(linha('meta ', w('meta', BV.brl0(r.meta), 'span')));
  else if (area === 'organica') nums.append(linha('sem meta própria'));
  const b = badge(r); if (b) nums.append(b);
  topo.append(nums); el.append(topo);

  if (r.meta !== null && r.realizado !== null) { const t = nd('div', 'bv-trilha bv-trilha-mini'); trilha(t, r, { curto: true }); el.append(t); }

  const atual = ehAtual();
  if (atual && r.diferenca_ritmo !== null) {
    const dif = r.diferenca_ritmo;
    const s = w('diferenca_ritmo', BV.brl0(Math.abs(dif))); s.classList.add(dif >= 0 ? 'bv-pos' : 'bv-neg');
    el.append(linha(dif >= 0 ? 'À frente do ritmo da meta em ' : 'Atrás do ritmo da meta em ', s));
  }
  if (atual && r.falta > 0 && r.por_dia !== null) {
    const m = nd('div', 'bv-missao');
    m.append(nd('span', 'bv-missao-rot', 'Missão de hoje'));
    const v = nd('span', 'bv-missao-val'); v.append(w('por_dia', BV.brl0(r.por_dia), 'span'));
    if (r.pedidos_por_dia) {
      const ppd = r.pedidos_por_dia;
      const txt = ppd >= 1 ? '≈ ' + (Math.round(ppd * 10) / 10).toLocaleString('pt-BR') + (ppd < 1.05 ? ' pedido' : ' pedidos') + ' por dia' : '≈ 1 pedido a cada ' + Math.max(2, Math.round(1 / ppd)) + ' dias';
      v.append(document.createTextNode(' · '), w('pedidos_por_dia', txt, 'span'));
    }
    m.append(v);
    if (r.pedidos_faltam !== null) m.append(nd('span', 'bv-missao-sub', `faltam ${BV.int(r.pedidos_faltam)} pedidos no ticket médio, em ${r.dias_restantes} dias`));
    el.append(m);
  } else if (r.pct !== null && r.pct >= 1) {
    el.append(linha(atual ? 'Meta do mês conquistada.' : 'Meta conquistada.'));
  } else if (!atual && r.falta > 0) {
    el.append(linha('Fechou ', w('falta', BV.brl0(r.falta)), ' abaixo da meta.'));
  }

  if (r.ticket) {
    const p = linha('Ticket médio ', w('ticket', BV.brl(r.ticket)));
    if (r.pedidos !== null) p.append(document.createTextNode(' · '), w('pedidos', BV.int(r.pedidos), 'span'), document.createTextNode(' pedidos'));
    el.append(p);
  }
  if (area === 'organica') {
    el.append(linha('Cada venda orgânica reduz o que falta para a MKT influência.'));
  }
  if (area === 'performance') {
    el.append(linha('Investido no Meta ', w('investido', BV.brl0(r.investido || 0)), ' · ROAS meta ', w('roas_meta', BV.dec(r.roas_meta) + '×', 'span')));
    if (r.roas !== null) {
      const s = w('roas', BV.dec(r.roas) + '×'); s.classList.add(r.roas >= r.roas_meta ? 'bv-pos' : 'bv-neg');
      el.append(linha('ROAS real ', s, r.roas >= r.roas_meta ? ' · dentro da meta' : ' · abaixo da meta'));
    } else {
      el.append(nd('p', 'bv-area-aviso', 'A receita gerada pelo Meta entra quando a API do Meta for ligada. O card já está pronto para recebê-la.'));
    }
  }
  if (area === 'influencia' && r.combinado) {
    el.append(nd('p', 'bv-area-aviso', 'Inclui a performance até a API do Meta ser ligada: hoje mostra todo o site Shopify contra a meta de influência + performance.'));
  }
});

dash.draw('ecom-composicao', (el) => {
  el.replaceChildren();
  if (dash.data('placar').status !== 'ok') return;
  const eco = pl('ecommerce'), org = pl('organica'), perf = pl('performance'), inf = pl('influencia');
  if (!eco) return;
  const combinado = inf && inf.combinado;
  const metaEco = eco.meta || 0;
  const plano = [
    ['organica', 'Venda orgânica', org ? org.realizado : 0, 'var(--bv-org)'],
    ['performance', 'Performance', perf && perf.meta ? perf.meta : 0, 'var(--bv-perf)'],
    ['influencia', 'MKT influência', Math.max(0, metaEco - (org ? org.realizado : 0) - (perf && perf.meta ? perf.meta : 0)), 'var(--bv-infl)'],
  ];
  const real = combinado
    ? [['organica', 'Venda orgânica', org ? org.realizado : 0, 'var(--bv-org)'], ['influencia', 'Influência + performance', inf ? inf.realizado : 0, 'linear-gradient(90deg, var(--bv-infl), var(--bv-perf))']]
    : [['organica', 'Venda orgânica', org ? org.realizado : 0, 'var(--bv-org)'], ['performance', 'Performance', perf ? perf.realizado || 0 : 0, 'var(--bv-perf)'], ['influencia', 'MKT influência', inf ? inf.realizado : 0, 'var(--bv-infl)']];
  const escala = Math.max(metaEco, eco.realizado || 0) * 1.05 || 1;
  const barra = (titulo, partes, total, campoTotal) => {
    const box = nd('div', 'bv-compo-linha');
    const cab = nd('div', 'bv-compo-cab'); cab.append(nd('span', 'bv-compo-tit', titulo));
    const tv = nd('span', 'bv-compo-tot'); tv.append(campoTotal ? mk(nd('span', null, BV.brl0(total)), 'ecommerce', campoTotal) : document.createTextNode(BV.brl0(total))); cab.append(tv); box.append(cab);
    const trk = nd('div', 'bv-compo-trk');
    for (const [, nome, v, cor] of partes) {
      if (!v) continue;
      const seg = nd('div', 'bv-compo-seg'); seg.style.width = (v / escala) * 100 + '%'; seg.style.background = cor;
      seg.setAttribute('aria-label', `${nome}: ${BV.brl0(v)}`);
      if ((v / escala) > 0.14) seg.append(nd('span', 'bv-compo-segrot', BV.curto(v)));
      trk.append(seg);
    }
    if (metaEco) { const m = nd('div', 'bv-compo-meta'); m.style.left = (metaEco / escala) * 100 + '%'; m.append(nd('span', null, 'meta')); trk.append(m); }
    box.append(trk);
    const leg = nd('ul', 'bv-legend');
    for (const [, nome, v, cor] of partes) { const li = nd('li'); const sw = nd('span', 'bv-sw'); sw.style.background = cor; li.append(sw, document.createTextNode(`${nome} ${BV.brl0(v)}`)); leg.append(li); }
    box.append(leg);
    return box;
  };
  el.append(barra('Plano da meta', plano, metaEco, 'meta'));
  el.append(barra(ehAtual() ? 'Realizado até hoje' : 'Realizado', real, eco.realizado || 0, 'realizado'));
  if (eco.meta) el.append(linha('Ecommerce em ', mk(nd('b', null, BV.pct(eco.pct)), 'ecommerce', 'pct'), ' da meta', ehAtual() && eco.falta > 0 ? ' · faltam ' : '', ehAtual() && eco.falta > 0 ? mk(nd('b', null, BV.brl0(eco.falta)), 'ecommerce', 'falta') : '', ehAtual() && eco.falta > 0 ? ` (${BV.brl0(eco.por_dia)} por dia)` : ''));
});

dash.draw('ranking', (el) => {
  el.replaceChildren();
  if (dash.data('placar').status !== 'ok') return;
  const itens = ['pdv', 'performance', 'influencia', 'ecommerce'].map(pl).filter((r) => r && r.meta !== null);
  itens.sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));
  itens.forEach((r, i) => {
    const li = nd('li', 'bv-rank-item'); li.style.setProperty('--area', `var(--bv-${{ pdv: 'pdv', performance: 'perf', influencia: 'infl', ecommerce: 'ecom' }[r.area]})`);
    li.append(nd('span', 'bv-rank-pos', String(i + 1)));
    const meio = nd('div', 'bv-rank-meio');
    const nome = nd('span', 'bv-rank-nome', r.nome); if (i === 0 && r.pct !== null && r.pct >= 1) nome.prepend(coroa(14));
    meio.append(nome);
    const trk = nd('div', 'bv-rank-trk'); const f = nd('div', 'bv-rank-fill'); f.style.width = Math.min(100, (r.pct || 0) * 100) + '%'; trk.append(f); meio.append(trk);
    li.append(meio);
    const fim = nd('div', 'bv-rank-fim');
    fim.append(r.pct === null ? nd('span', 'bv-rank-pct', 'aguarda') : mk(nd('span', 'bv-rank-pct', BV.pct(r.pct)), r.area, 'pct'));
    const bd = badge(r); if (bd) fim.append(bd);
    li.append(fim);
    el.append(li);
  });
});

dash.draw('dias-ritmo', (el) => {
  el.replaceChildren();
  const s = dash.data('vendas_dia');
  if (s.status !== 'ok' || dash.data('placar').status !== 'ok') return;
  const mes = mesMetas();
  const dias = new Date(Date.UTC(+mes.slice(0, 4), +mes.slice(5, 7), 0)).getUTCDate();
  const hoje = BV.hoje();
  const ultimoDia = mes === hoje.slice(0, 7) ? +hoje.slice(8, 10) : mes < hoje.slice(0, 7) ? dias : 0;
  const tip = nd('div', 'bv-tip'); tip.hidden = true;
  const linhas = [['total', 'Meta geral', null], ['pdv', 'PDV', ['pdv']], ['ecommerce', 'Ecommerce', ['site', 'vendas_organicas']]];
  for (const [area, nome, canais] of linhas) {
    const r = pl(area);
    const row = nd('div', 'bv-streak');
    const cab = nd('div', 'bv-streak-cab'); cab.append(nd('span', 'bv-streak-nome', nome));
    if (!r || !r.meta) { cab.append(nd('span', 'bv-streak-info', 'sem meta no mês')); row.append(cab); el.append(row); continue; }
    const cota = r.meta / dias;
    const porDia = d3.rollup(s.data.filter((v) => v.data.slice(0, 7) === mes && (!canais || canais.includes(v.canal))), (v) => d3.sum(v, (x) => x.receita), (v) => +v.data.slice(8, 10));
    let ok = 0, seq = 0, seqAtual = 0;
    const grade = nd('div', 'bv-dias');
    for (let d = 1; d <= dias; d++) {
      const q = nd('span', 'bv-dia');
      const v = porDia.get(d) || 0;
      if (d <= ultimoDia) {
        q.classList.add(v >= cota ? 'bv-dia-ok' : v >= cota / 2 ? 'bv-dia-meio' : 'bv-dia-baixo');
        if (v >= cota) { ok++; seq++; } else if (!(d === ultimoDia && mes === hoje.slice(0, 7))) seq = 0;
        seqAtual = seq;
      }
      if (mes === hoje.slice(0, 7) && d === ultimoDia) q.classList.add('bv-dia-hoje');
      q.setAttribute('aria-label', `Dia ${d}: ${d <= ultimoDia ? BV.brl0(v) : 'ainda não chegou'}`);
      q.addEventListener('pointerenter', () => {
        tip.hidden = false; tip.replaceChildren(nd('b', null, `Dia ${d}`));
        const a = nd('div', 'bv-tip-row'); a.append(nd('span', null, 'Vendido'), nd('span', null, d <= ultimoDia ? BV.brl(v) : '—'));
        const c = nd('div', 'bv-tip-row'); c.append(nd('span', null, 'Cota do dia'), nd('span', null, BV.brl(cota)));
        tip.append(a, c);
        const rq = q.getBoundingClientRect(), re = el.getBoundingClientRect();
        tip.style.left = Math.max(0, Math.min(el.clientWidth - tip.offsetWidth, rq.left - re.left - 40)) + 'px';
        tip.style.top = Math.max(0, rq.top - re.top - tip.offsetHeight - 8) + 'px';
      });
      q.addEventListener('pointerleave', () => { tip.hidden = true; });
      grade.append(q);
    }
    cab.append(nd('span', 'bv-streak-info', `${ok} de ${ultimoDia} dias na cota · sequência atual: ${seqAtual} ${seqAtual === 1 ? 'dia' : 'dias'} · cota ${BV.brl0(cota)}/dia`));
    row.append(cab, grade);
    el.append(row);
  }
  el.append(tip);
});

const ritmo = (el, area) => {
  const s = dash.data('vendas_dia'), sm = dash.data('placar');
  if (s.status !== 'ok' || sm.status !== 'ok') { if (s.status === 'error') BV.fail(el); return; }
  const mes = mesMetas();
  const dias = new Date(Date.UTC(+mes.slice(0, 4), +mes.slice(5, 7), 0)).getUTCDate();
  const hoje = BV.hoje();
  const ultimo = mes === hoje.slice(0, 7) ? +hoje.slice(8, 10) : mes < hoje.slice(0, 7) ? dias : 0;
  const fontes = { ecommerce: ['site', 'vendas_organicas'], pdv: ['pdv'] }[area] || null;
  const cor = { total: 'var(--bv-ink)', pdv: 'var(--bv-pdv)', ecommerce: 'var(--bv-ecom)' }[area] || BV.cores[0];
  const porDia = d3.rollup(s.data.filter((r) => (!fontes || fontes.includes(r.canal)) && r.data.slice(0, 7) === mes), (v) => d3.sum(v, (r) => r.receita), (r) => +r.data.slice(8, 10));
  let acc = 0; const serie = [];
  for (let d = 1; d <= ultimo; d++) { acc += porDia.get(d) || 0; serie.push({ d, v: acc }); }
  const st = sm.data.find((r) => r.mes === mes && r.area === area) || {};
  const meta = st.meta ?? null;
  const proj = ultimo > 0 && ultimo < dias ? (acc / ultimo) * dias : null;
  el.replaceChildren();
  const width = Math.max(220, el.clientWidth || 300), height = 190, m = { t: 14, r: 12, b: 22, l: 40 };
  const svg = d3.select(el).append('svg').attr('width', width).attr('height', height).attr('role', 'img')
    .attr('aria-label', `Venda acumulada em ${BV.mesLongo(mes)}: ${BV.brl0(acc)}${meta ? ' de meta ' + BV.brl0(meta) : ''}`);
  const tip = d3.select(el).append('div').attr('class', 'bv-tip').style('display', 'none');
  const y = d3.scaleLinear().domain([0, Math.max(meta || 0, acc, proj || 0, 1)]).nice().range([height - m.b, m.t]);
  const gy = svg.append('g').call(d3.axisLeft(y).ticks(4).tickFormat(BV.curto).tickSize(0)).call((g) => g.select('.domain').remove());
  let wl = 0; gy.selectAll('text').each(function () { wl = Math.max(wl, this.getComputedTextLength()); }); m.l = Math.ceil(wl) + 8; gy.attr('transform', `translate(${m.l},0)`);
  const x = d3.scaleLinear().domain([0, dias]).range([m.l, width - m.r]);
  svg.insert('g', ':first-child').selectAll('line').data(y.ticks(4)).join('line').attr('x1', m.l).attr('x2', width - m.r).attr('y1', (v) => y(v)).attr('y2', (v) => y(v)).style('stroke', 'var(--cds-chart-grid)');
  svg.append('g').attr('transform', `translate(0,${height - m.b})`).call(d3.axisBottom(x).tickValues([1, 10, 20, dias]).tickFormat((d) => 'dia ' + d).tickSize(0).tickPadding(6)).call((g) => g.select('.domain').remove());
  if (meta) {
    svg.append('line').attr('x1', x(0)).attr('y1', y(0)).attr('x2', x(dias)).attr('y2', y(meta)).style('stroke', 'var(--color-fg-muted)').style('stroke-width', 1.5).style('stroke-dasharray', '4 4');
    svg.append('text').attr('x', x(dias)).attr('y', y(meta) - 6).attr('text-anchor', 'end').style('fill', 'var(--cds-text-secondary)').style('font-size', 'var(--cds-font-size-caption)').text('meta ' + BV.curto(meta));
  }
  if (serie.length) {
    svg.append('path').datum([{ d: 0, v: 0 }, ...serie]).attr('d', d3.area().x((p) => x(p.d)).y0(y(0)).y1((p) => y(p.v))).style('fill', cor).style('opacity', 0.16);
    svg.append('path').datum([{ d: 0, v: 0 }, ...serie]).attr('d', d3.line().x((p) => x(p.d)).y((p) => y(p.v))).style('fill', 'none').style('stroke', cor).style('stroke-width', 2.2);
    if (proj !== null) svg.append('line').attr('x1', x(ultimo)).attr('y1', y(acc)).attr('x2', x(dias)).attr('y2', y(proj)).style('stroke', 'var(--color-fg)').style('stroke-width', 1.5);
    svg.append('circle').attr('cx', x(ultimo)).attr('cy', y(acc)).attr('r', 4).style('fill', cor).style('stroke', 'var(--color-bg)').style('stroke-width', 1.5);
  } else {
    svg.append('text').attr('x', (m.l + width - m.r) / 2).attr('y', height / 2).attr('text-anchor', 'middle').style('fill', 'var(--cds-text-secondary)').style('font-size', 'var(--cds-font-size-caption)').text('Sem vendas no mês');
  }
  svg.append('rect').attr('x', m.l).attr('y', m.t).attr('width', width - m.l - m.r).attr('height', height - m.t - m.b).style('fill', 'transparent')
    .on('pointerenter pointermove', (ev) => {
      const [px, py] = d3.pointer(ev, el);
      const d = Math.max(1, Math.min(dias, Math.round(x.invert(d3.pointer(ev)[0]))));
      const t = tip.node(); tip.style('display', null); t.replaceChildren();
      t.append(nd('b', null, 'Dia ' + d + ' de ' + BV.mesLongo(mes)));
      const rows = [];
      if (d <= ultimo) { rows.push(['Vendido no dia', BV.brl(porDia.get(d) || 0)]); rows.push(['Acumulado', BV.brl(serie[d - 1].v)]); }
      if (meta) rows.push(['Caminho da meta', BV.brl((meta / dias) * d)]);
      if (d > ultimo && proj !== null) rows.push(['Projeção', BV.brl(acc + ((proj - acc) * (d - ultimo)) / (dias - ultimo))]);
      for (const [a, b] of rows) { const row = nd('div', 'bv-tip-row'); row.append(nd('span', null, a), nd('span', null, b)); t.append(row); }
      t.style.left = Math.max(0, Math.min(el.clientWidth - t.offsetWidth, px + 12)) + 'px'; t.style.top = Math.max(0, Math.min(height - t.offsetHeight, py - t.offsetHeight - 8)) + 'px';
    })
    .on('pointerleave', () => tip.style('display', 'none'));
};
dash.draw('ritmo-total', (el) => ritmo(el, 'total'));
dash.draw('ritmo-pdv', (el) => ritmo(el, 'pdv'));
dash.draw('ritmo-ecommerce', (el) => ritmo(el, 'ecommerce'));

dash.draw('tab-metas', (el) => {
  const s = dash.data('placar');
  if (s.status !== 'ok') return;
  const ordem = ['total', 'pdv', 'ecommerce', 'organica', 'performance', 'influencia'];
  const rows = s.data.filter((r) => r.mes <= BV.mesAtual() && r.mes >= '2026-09' && (r.meta !== null || r.realizado))
    .sort((a, b) => d3.descending(a.mes, b.mes) || d3.ascending(ordem.indexOf(a.area), ordem.indexOf(b.area)));
  el.replaceChildren();
  const thead = nd('thead'); const hr = nd('tr');
  for (const [f, t, c] of [['mes', 'Mês', 'bv-txt'], ['nome', 'Área', 'bv-txt'], ['meta', 'Meta'], ['realizado', 'Realizado'], ['pct', '% da meta'], ['nivel', 'Nível', 'bv-txt'], ['projecao', 'Projeção / fechamento']]) {
    const th = nd('th', c || null, t); th.dataset.field = f; hr.append(th);
  }
  thead.append(hr); el.append(thead);
  const tb = nd('tbody'); let ult = null;
  for (const r of rows) {
    const tr = nd('tr'); tr.dataset.key = encodeURIComponent(r.mes) + ',' + encodeURIComponent(r.area);
    if (r.mes !== ult && ult !== null) tr.classList.add('bv-memo-ini');
    const vals = [r.mes !== ult ? BV.mesLongo(r.mes) + (r.mes === BV.mesAtual() ? ' (até hoje)' : '') : '', r.nome, r.meta === null ? 'sem meta' : BV.brl(r.meta),
      r.realizado === null ? 'aguardando' : BV.brl(r.realizado), BV.pct(r.pct), r.nivel || '—', r.projecao === null ? '—' : BV.brl(r.projecao)];
    ult = r.mes;
    vals.forEach((v, i) => { const td = nd('td', i < 2 || i === 5 ? 'bv-txt' : null, v); if (i === 4 && r.pct !== null) td.classList.add(r.pct >= 1 ? 'bv-pos' : 'bv-neg'); tr.append(td); });
    tb.append(tr);
  }
  el.append(tb);
});

/* ===== Central de performance ===== */
const perPulso = () => dash.params().perf_periodo || 'mes';
const pulsoLinha = () => { const s = dash.data('pulso'); return s.status === 'ok' ? s.data.find((r) => r.periodo === perPulso()) || null : null; };
const mkp = (e, campo) => { BV.mark(e, 'pulso', campo, 'periodo=' + perPulso()); return e; };

dash.draw('pulso-periodo-txt', (el) => {
  const r = pulsoLinha(); if (!r) { el.textContent = ''; return; }
  el.textContent = `${BV.data(r.inicio)} a ${BV.data(r.fim)}, comparado com ${BV.data(r.inicio_ant)} a ${BV.data(r.fim_ant)}.`;
});

const KPIS = {
  fat: { campo: 'fat', fmt: (v) => BV.brl0(v), meta: 'meta_fat', pct: 'pct_meta_fat', bom: 1 },
  pedidos: { campo: 'pedidos', fmt: (v) => BV.int(v), bom: 1 },
  ticket: { campo: 'ticket', fmt: (v) => BV.brl(v), bom: 1 },
  invest: { campo: 'invest', fmt: (v) => BV.brl0(v), meta: 'meta_invest', pct: 'pct_meta_invest', bom: 0, rotMeta: 'orçamento' },
  roas: { campo: 'roas', fmt: (v) => (v === null ? '—' : BV.dec(v) + '×'), bom: 1 },
  cpa: { campo: 'cpa', fmt: (v) => BV.brl(v), bom: -1 },
};
dash.draw('pulso-kpi', (el) => {
  const k = KPIS[el.dataset.kpi];
  el.replaceChildren();
  const st = dash.data('pulso').status;
  if (st !== 'ok') { el.append(nd('span', 'bv-pkpi-val', st === 'loading' ? '' : '—')); return; }
  const r = pulsoLinha(); if (!r) { el.append(nd('span', 'bv-pkpi-val', '—')); return; }
  const v = r[k.campo];
  el.append(mkp(nd('span', 'bv-pkpi-val', k.fmt(v)), k.campo));
  const va = r[k.campo + '_var'];
  const dl = nd('span', 'bv-pkpi-delta');
  if (va === null || va === undefined) dl.textContent = 'sem base de comparação';
  else {
    const melhor = k.bom === 0 ? null : (k.bom > 0 ? va >= 0 : va <= 0);
    const s = mkp(nd('b', melhor === null ? null : melhor ? 'bv-pos' : 'bv-neg', (va >= 0 ? '▲ ' : '▼ ') + BV.pct(Math.abs(va))), k.campo + '_var');
    dl.append(s, document.createTextNode(' vs. período anterior (' + k.fmt(r[k.campo + '_ant']) + ')'));
  }
  el.append(dl);
  const meta = nd('div', 'bv-pkpi-meta');
  if (k.meta && r[k.meta] !== null) {
    const p = r[k.pct];
    const trk = nd('div', 'bv-pkpi-trk'); const f = nd('div', 'bv-pkpi-fill'); f.style.width = Math.min(100, (p || 0) * 100) + '%';
    if (el.dataset.kpi === 'invest') f.classList.add(p > 1.05 ? 'bv-acima' : 'bv-neutro'); else f.classList.add(p >= 1 ? 'bv-ok' : p >= 0.85 ? 'bv-quase' : 'bv-abaixo');
    trk.append(f); meta.append(trk);
    const t = nd('span', 'bv-pkpi-metatxt');
    t.append(document.createTextNode((k.rotMeta || 'meta') + ' do período '), mkp(nd('b', null, k.fmt(r[k.meta])), k.meta), document.createTextNode(' · '), mkp(nd('b', null, BV.pct(p)), k.pct));
    meta.append(t);
  } else if (el.dataset.kpi === 'roas') {
    const ok = v !== null && v >= r.roas_meta;
    meta.append(nd('span', 'bv-pill ' + (v === null ? 'bv-out' : ok ? 'bv-in' : 'bv-bad'), v === null ? 'sem investimento' : ok ? 'na meta de 2×' : 'abaixo da meta de 2×'));
  } else if (el.dataset.kpi === 'cpa' && r.cpa_meta) {
    const ok = v !== null && v <= r.cpa_meta;
    const t = nd('span', 'bv-pkpi-metatxt'); t.append(document.createTextNode('teto para ROAS 2×: '), mkp(nd('b', null, BV.brl(r.cpa_meta)), 'cpa_meta'));
    meta.append(t);
    if (v !== null) meta.append(nd('span', 'bv-pill ' + (ok ? 'bv-in' : 'bv-bad'), ok ? 'dentro' : 'acima'));
  } else if (el.dataset.kpi === 'ticket' || el.dataset.kpi === 'pedidos') {
    const s = dash.data('placar');
    const pl2 = s.status === 'ok' ? s.data.find((x) => x.mes === BV.mesAtual() && x.area === 'total') : null;
    if (perPulso() === 'mes' && pl2 && pl2.pedidos_faltam !== null && el.dataset.kpi === 'pedidos') {
      const t = nd('span', 'bv-pkpi-metatxt'); t.append(document.createTextNode('para a meta do mês faltam '), mk(nd('b', null, BV.int(pl2.pedidos_faltam)), 'total', 'pedidos_faltam'), document.createTextNode(' pedidos'));
      meta.append(t);
    }
  }
  el.append(meta);
});

/* barras diárias empilhadas, com linha opcional */
const barrasDia = (el, dados, series, linha, opts) => {
  el.replaceChildren();
  const o = opts || {};
  if (!dados.length) { el.append(nd('div', 'bv-fail', 'Sem dados no período.')); return; }
  const width = Math.max(260, el.clientWidth || 600), height = o.altura || 240, m = { t: 12, r: o.dir ? 40 : 10, b: 24, l: 40 };
  const svg = d3.select(el).append('svg').attr('width', width).attr('height', height).attr('role', 'img').attr('aria-label', o.label || '');
  const tip = d3.select(el).append('div').attr('class', 'bv-tip').style('display', 'none');
  const tot = (d) => d3.sum(series, (s) => d[s.key] || 0);
  const ymax = Math.max(d3.max(dados, tot) || 0, linha && !o.dir ? d3.max(dados, (d) => d[linha.key] || 0) : 0, 1);
  const y = d3.scaleLinear().domain([0, ymax]).nice().range([height - m.b, m.t]);
  const fy = o.inteiro ? (v) => BV.int(v) : BV.curto;
  const gy = svg.append('g').call(d3.axisLeft(y).ticks(4).tickFormat(fy).tickSize(0)).call((g) => g.select('.domain').remove());
  let wl = 0; gy.selectAll('text').each(function () { wl = Math.max(wl, this.getComputedTextLength()); }); m.l = Math.ceil(wl) + 8; gy.attr('transform', `translate(${m.l},0)`);
  svg.insert('g', ':first-child').selectAll('line').data(y.ticks(4)).join('line').attr('x1', m.l).attr('x2', width - m.r).attr('y1', (v) => y(v)).attr('y2', (v) => y(v)).style('stroke', 'var(--cds-chart-grid)');
  const keys = dados.map((d) => d.data);
  const x = d3.scaleBand().domain(keys).range([m.l, width - m.r]).padding(keys.length > 40 ? 0.12 : 0.22);
  const every = Math.max(1, Math.ceil(keys.length / Math.max(2, Math.floor((width - m.l) / 58))));
  svg.append('g').attr('transform', `translate(0,${height - m.b})`).call(d3.axisBottom(x).tickValues(keys.filter((k, i) => i % every === 0)).tickFormat(BV.dataCurta).tickSize(0).tickPadding(6)).call((g) => g.select('.domain').remove());
  const st = d3.stack().keys(series.map((s) => s.key)).value((d, k) => d[k] || 0)(dados);
  svg.append('g').selectAll('g').data(st).join('g').style('fill', (d, i) => series[i].cor)
    .selectAll('rect').data((d) => d).join('rect').attr('x', (d) => x(d.data.data)).attr('width', x.bandwidth()).attr('y', (d) => y(d[1])).attr('height', (d) => Math.max(0, y(d[0]) - y(d[1]))).attr('rx', Math.min(2, x.bandwidth() / 4));
  if (linha) {
    const y2 = o.dir ? d3.scaleLinear().domain([0, Math.max(d3.max(dados, (d) => d[linha.key] || 0), 1)]).nice().range([height - m.b, m.t]) : y;
    if (o.dir) svg.append('g').attr('transform', `translate(${width - m.r + 6},0)`).call(d3.axisRight(y2).ticks(4).tickFormat(BV.curto).tickSize(0)).call((g) => g.select('.domain').remove());
    const pts = dados.filter((d) => d[linha.key] !== null && d[linha.key] !== undefined);
    const ln = d3.line().x((d) => x(d.data) + x.bandwidth() / 2).y((d) => y2(d[linha.key]));
    svg.append('path').datum(pts).attr('d', ln).style('fill', 'none').style('stroke', linha.cor || 'var(--color-fg)').style('stroke-width', 1.6).style('stroke-dasharray', linha.tracejado ? '5 4' : null);
  }
  svg.append('g').selectAll('rect').data(dados).join('rect').attr('x', (d) => x(d.data) - (x.step() * x.paddingInner()) / 2).attr('width', x.step()).attr('y', m.t).attr('height', height - m.t - m.b).style('fill', 'transparent')
    .on('pointerenter pointermove', (ev, d) => {
      const t = tip.node(); tip.style('display', null); t.replaceChildren(nd('b', null, BV.data(d.data)));
      for (const [a, b] of o.tip(d)) { const row = nd('div', 'bv-tip-row'); row.append(nd('span', null, a), nd('span', null, b)); t.append(row); }
      const [px, py] = d3.pointer(ev, el); t.style.left = Math.max(0, Math.min(el.clientWidth - t.offsetWidth, px + 12)) + 'px'; t.style.top = Math.max(0, Math.min(height - t.offsetHeight, py - t.offsetHeight - 8)) + 'px';
    })
    .on('pointerleave', () => tip.style('display', 'none'));
};
const serieDoPeriodo = () => {
  const s = dash.data('serie_dia'), r = pulsoLinha();
  if (s.status !== 'ok' || !r) return null;
  return s.data.filter((d) => d.data >= r.inicio && d.data <= r.fim);
};
dash.draw('pulso-fat-dia', (el) => {
  const dados = serieDoPeriodo(); if (!dados) { if (dash.data('serie_dia').status === 'error') BV.fail(el); return; }
  barrasDia(el, dados, [{ key: 'pdv', cor: 'var(--bv-pdv)' }, { key: 'site', cor: 'var(--bv-ecom)' }, { key: 'org', cor: 'var(--bv-org)' }],
    { key: 'cota', cor: 'var(--color-fg-muted)', tracejado: true },
    { altura: 260, label: 'Faturamento diário por canal e cota diária da meta', tip: (d) => [['PDV', BV.brl(d.pdv)], ['Site', BV.brl(d.site)], ['Venda orgânica', BV.brl(d.org)], ['Total', BV.brl(d.total)], ['Cota da meta', d.cota === null ? 'sem meta' : BV.brl(d.cota)]] });
});
dash.draw('pulso-ped-dia', (el) => {
  const dados = serieDoPeriodo(); if (!dados) return;
  barrasDia(el, dados, [{ key: 'pedidos', cor: 'var(--bv-ecom)' }], null, { altura: 200, inteiro: true, label: 'Pedidos por dia', tip: (d) => [['Pedidos', BV.int(d.pedidos)], ['Faturamento', BV.brl(d.total)]] });
});
dash.draw('pulso-meta-dia', (el) => {
  const dados = serieDoPeriodo(); if (!dados) return;
  barrasDia(el, dados, [{ key: 'gasto_meta', cor: 'var(--bv-perf)' }], { key: 'receita_meta', cor: 'var(--color-fg)' },
    { altura: 200, label: 'Investimento e receita atribuída do Meta por dia', tip: (d) => [['Investimento', BV.brl(d.gasto_meta)], ['Receita atribuída', BV.brl(d.receita_meta)], ['ROAS', d.roas === null ? '—' : BV.dec(d.roas) + '×']] });
});

dash.draw('pulso-composicao', (el) => {
  el.replaceChildren();
  const r = pulsoLinha(); if (!r) return;
  const perf = Math.min(r.receita_meta || 0, r.site || 0);
  const partes = [
    ['PDV', r.pdv, 'var(--bv-pdv)', 'pdv'], ['Performance', perf, 'var(--bv-perf)', 'receita_meta'],
    ['MKT influência', r.influencia, 'var(--bv-infl)', 'influencia'], ['Venda orgânica', r.org, 'var(--bv-org)', 'org'],
  ];
  const total = d3.sum(partes, (p) => p[1] || 0) || 1;
  const trk = nd('div', 'bv-compo-trk bv-compo-grande');
  for (const [nome, v, cor] of partes) {
    if (!v) continue;
    const seg = nd('div', 'bv-compo-seg'); seg.style.width = (v / total) * 100 + '%'; seg.style.background = cor; seg.setAttribute('aria-label', `${nome}: ${BV.brl0(v)}`);
    if (v / total > 0.09) seg.append(nd('span', 'bv-compo-segrot', BV.pct(v / total)));
    trk.append(seg);
  }
  el.append(trk);
  const g = nd('div', 'bv-compo-grid');
  for (const [nome, v, cor, campo] of partes) {
    const c = nd('div', 'bv-compo-item'); c.style.setProperty('--area', cor);
    c.append(nd('span', 'bv-compo-nome', nome));
    c.append(mkp(nd('span', 'bv-compo-val', BV.brl0(v || 0)), campo));
    c.append(nd('span', 'bv-compo-pct', BV.pct((v || 0) / total) + ' do faturamento'));
    g.append(c);
  }
  el.append(g);
});

dash.draw('pulso-campanhas', (el) => {
  const s = dash.data('campanhas_periodo');
  if (s.status !== 'ok') return;
  const rows = s.data.filter((r) => r.periodo === perPulso());
  el.replaceChildren();
  const cols = [['nome', 'Campanha', 'bv-txt'], ['investimento', 'Investimento'], ['impressoes', 'Impressões'], ['cliques', 'Cliques'], ['ctr', 'CTR'], ['cpc', 'CPC'], ['compras', 'Compras'], ['receita', 'Receita'], ['roas', 'ROAS'], ['cpa', 'Custo/compra']];
  const thead = nd('thead'); const hr = nd('tr');
  for (const [f, t, c] of cols) { const th = nd('th', c || null, t); th.dataset.field = f; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = nd('tbody');
  if (!rows.length) { const tr = nd('tr'); const td = nd('td', 'bv-txt', 'Nenhuma campanha com investimento no período.'); td.colSpan = cols.length; tr.append(td); tb.append(tr); }
  for (const r of rows) {
    const tr = nd('tr'); tr.dataset.key = encodeURIComponent(r.periodo) + ',' + encodeURIComponent(r.campanha);
    const fm = { nome: (v) => v || '—', investimento: BV.brl, impressoes: BV.int, cliques: BV.int, ctr: BV.pct, cpc: BV.brl, compras: (v) => BV.int(Math.round(v)), receita: BV.brl, cpa: BV.brl };
    for (const [f, , c] of cols) {
      const td = nd('td', c || null);
      if (f === 'roas') { td.append(nd('span', 'bv-pill ' + (r.roas === null || r.roas === 0 ? 'bv-out' : r.roas >= 2 ? 'bv-in' : 'bv-bad'), r.roas === null ? '—' : BV.dec(r.roas) + '×')); }
      else td.textContent = fm[f](r[f]);
      tr.append(td);
    }
    tb.append(tr);
  }
  el.append(tb);
});

dash.draw('pulso-skus', (el) => {
  const s = dash.data('skus_periodo');
  if (s.status !== 'ok') return;
  const rows = s.data.filter((r) => r.periodo === perPulso()).slice(0, 15);
  const max = d3.max(rows, (r) => r.pct) || 1;
  el.replaceChildren();
  const thead = nd('thead'); const hr = nd('tr');
  for (const [f, t, c] of [['produto', 'Produto', 'bv-txt'], ['itens', 'Itens'], ['unidades', 'Unidades'], ['vendas', 'Vendas'], ['pct', '% das vendas']]) { const th = nd('th', c || null, t); th.dataset.field = f; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = nd('tbody');
  if (!rows.length) { const tr = nd('tr'); const td = nd('td', 'bv-txt', 'Nenhuma venda no período.'); td.colSpan = 5; tr.append(td); tb.append(tr); }
  for (const r of rows) {
    const tr = nd('tr'); tr.dataset.key = encodeURIComponent(r.periodo) + ',' + encodeURIComponent(r.produto);
    tr.append(nd('td', 'bv-txt', r.produto), nd('td', null, BV.int(r.itens)), nd('td', null, BV.int(r.unidades)), nd('td', null, BV.brl(r.vendas)));
    const td = nd('td'); const bar = nd('span', 'bv-bar'); bar.style.width = Math.max(2, (r.pct / max) * 70) + 'px'; bar.style.marginRight = '8px'; bar.style.background = 'var(--bv-ecom)'; bar.style.opacity = '.7';
    td.append(bar, document.createTextNode(BV.pct(r.pct))); tr.append(td);
    tb.append(tr);
  }
  el.append(tb);
});

dash.draw('dre-cats', (el) => {
  const s = dash.data('dre_categorias');
  if (s.status !== 'ok') { el.textContent = ''; return; }
  const r = s.data.find((x) => x.linha === el.dataset.linha);
  if (!r) { el.textContent = ''; return; }
  BV.mark(el, 'dre_categorias', 'categorias', 'linha=' + r.linha);
  el.textContent = 'Categorias do Bling: ' + r.categorias + '.';
});
/* ===== CPV ===== */
const GRUPOS_CPV = [['insumos', 'Insumos', 'var(--bv-perf)'], ['industrializacao', 'Industrialização', 'var(--bv-pdv)'], ['embalagem_primaria', 'Embalagem primária', 'var(--bv-org)'], ['frete_insumos', 'Frete de insumos', 'var(--bv-ecom)'], ['ferramental', 'Formas (amortizadas)', 'var(--bv-infl)']];
const cpvLinha = (lote) => { const s = dash.data('cpv_resumo'); return s.status === 'ok' ? s.data.find((r) => r.lote === lote) || null : null; };
const brl4 = (v) => (v === null || v === undefined ? '—' : 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
dash.draw('cpv-medio', (el) => {
  el.replaceChildren(); const r = cpvLinha('medio'); if (!r) { el.textContent = '—'; return; }
  const s = nd('span', null, brl4(r.unitario)); BV.mark(s, 'cpv_resumo', 'unitario', 'lote=medio'); el.append(s);
});
dash.draw('cpv-stats', (el) => {
  el.replaceChildren(); const s = dash.data('cpv_resumo'); if (s.status !== 'ok') return;
  const f = dash.data('cpv_formato');
  if (f.status === 'ok') {
    for (const [k, rot] of [['ecommerce', 'CPV e-commerce · com caixa de envio'], ['pdv', 'CPV PDV · com display e caixa master']]) {
      const r = f.data.find((x) => x.formato === k); if (!r) continue;
      const v = nd('span', null, brl4(r.cpv_unitario) + ' /un'); BV.mark(v, 'cpv_formato', 'cpv_unitario', 'formato=' + k);
      el.append(stat(rot, v));
    }
  }
  for (const r of s.data.filter((x) => x.lote !== 'medio')) {
    const v = nd('span', null, brl4(r.unitario)); BV.mark(v, 'cpv_resumo', 'unitario', 'lote=' + r.lote);
    el.append(stat(`${r.nome} · ${BV.int(r.unidades)} un`, v));
  }

});
dash.draw('cpv-barras', (el) => {
  el.replaceChildren(); const s = dash.data('cpv_resumo'); if (s.status !== 'ok') return;
  const max = d3.max(s.data, (r) => r.unitario) || 1;
  for (const r of s.data) {
    const row = nd('div', 'bv-cpv-linha');
    const cab = nd('div', 'bv-compo-cab'); cab.append(nd('span', 'bv-compo-tit', r.nome + (r.data ? ' · ' + BV.data(r.data) : '')));
    const tot = nd('span', 'bv-compo-tot', brl4(r.unitario)); BV.mark(tot, 'cpv_resumo', 'unitario', 'lote=' + r.lote); cab.append(tot); row.append(cab);
    const trk = nd('div', 'bv-compo-trk bv-cpv-trk');
    for (const [g, nome, cor] of GRUPOS_CPV) {
      const v = r[g] || 0; if (!v) continue;
      const seg = nd('div', 'bv-compo-seg'); seg.style.width = (v / max) * 100 + '%'; seg.style.background = cor; seg.setAttribute('aria-label', `${nome}: ${brl4(v)} por unidade`);
      if (v / max > 0.1) seg.append(nd('span', 'bv-compo-segrot', brl4(v).replace('R$ ', '')));
      trk.append(seg);
    }
    row.append(trk); el.append(row);
  }
  const med = cpvLinha('medio');
  if (med) {
    const g = nd('div', 'bv-compo-grid');
    for (const [k, nome, cor] of GRUPOS_CPV) {
      const c = nd('div', 'bv-compo-item'); c.style.setProperty('--area', cor);
      c.append(nd('span', 'bv-compo-nome', nome));
      const v = nd('span', 'bv-compo-val', brl4(med[k])); BV.mark(v, 'cpv_resumo', k, 'lote=medio'); c.append(v);
      c.append(nd('span', 'bv-compo-pct', BV.pct((med[k] || 0) / med.unitario) + ' do custo'));
      g.append(c);
    }
    el.append(g);
  }
});
dash.draw('cpv-formatos', (el) => {
  el.replaceChildren(); const s = dash.data('cpv_formatos'); if (s.status !== 'ok' || !s.data) return;
  el.dataset.source = 'cpv_formatos'; el.dataset.rowKey = 'formato';
  const thead = nd('thead'); const hr = nd('tr');
  for (const [f, t, c] of [['nome', 'Formato', 'bv-txt'], ['produto', 'Produto'], ['embalagem', 'Embalagem de canal'], ['total', 'Custo total']]) { const th = nd('th', c || null, t); th.dataset.field = f; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = nd('tbody');
  for (const r of s.data) {
    const tr = nd('tr'); tr.dataset.key = r.formato;
    tr.append(nd('td', 'bv-txt', r.nome + (r.nota ? ` (${r.nota})` : '')), nd('td', null, BV.brl(r.produto)),
      nd('td', null, r.embalagem === null ? 'a informar' : BV.brl(r.embalagem)));
    const t = nd('td', null, r.total === null ? 'a informar' : BV.brl(r.total)); t.style.fontWeight = 'var(--cds-font-weight-medium)'; tr.append(t);
    tb.append(tr);
  }
  el.append(tb);
});
dash.draw('cpv-tabela', (el) => {
  el.replaceChildren(); const s = dash.data('cpv_comp'); if (s.status !== 'ok') return;
  const nomes = { insumos: 'Insumos', embalagem_primaria: 'Embalagem primária', frete_insumos: 'Frete de insumos', ferramental: 'Formas (amortizar)', embalagem_canal: 'Embalagem de canal' };
  const thead = nd('thead'); const hr = nd('tr');
  for (const [f, t, c] of [['grupo', 'Grupo', 'bv-txt'], ['item', 'Item', 'bv-txt'], ['fornecedor', 'Fornecedor', 'bv-txt'], ['valor', 'Pago'], ['cobertura', 'Tiragem / qtd. comprada'], ['por_unidade', 'Custo por unidade'], ['sobra', 'Sobra em estoque'], ['consumido', 'Usado nos lotes 1–2'], ['confirmar', 'Situação', 'bv-txt']]) { const th = nd('th', c || null, t); th.dataset.field = f; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = nd('tbody');
  const un4 = (v) => (v === null || v === undefined ? '—' : 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }));
  for (const r of s.data) {
    const tr = nd('tr'); tr.dataset.key = String(r.id);
    let cob = '—';
    if (r.tiragem) cob = BV.int(r.tiragem) + ' un';
    else if (r.grupo === 'embalagem_canal') cob = r.quantidade ? `${BV.int(r.quantidade)} × ${BV.int(r.unidades_por_embalagem)} un` : 'a informar';
    else if (r.grupo === 'ferramental') cob = 'amortizado em lotes';
    else if (r.grupo === 'insumos') cob = 'pela receita';
    else cob = 'por consumo';
    const sit = nd('td', 'bv-txt'); sit.append(nd('span', 'bv-pill ' + (r.confirmar ? 'bv-warn' : 'bv-in'), r.confirmar ? 'confirmar' : 'ok'));
    if (r.observacao) sit.append(nd('span', 'bv-cpv-obs', r.observacao));
    const pu = nd('td', null, r.grupo === 'insumos' ? '—' : un4(r.por_unidade)); pu.style.fontWeight = 'var(--cds-font-weight-medium)';
    tr.append(nd('td', 'bv-txt', nomes[r.grupo] || r.grupo), nd('td', 'bv-txt', r.item), nd('td', 'bv-txt', r.fornecedor || '—'), nd('td', null, BV.brl(r.valor)),
      nd('td', null, cob), pu,
      nd('td', null, r.tiragem || r.grupo === 'embalagem_canal' || r.grupo === 'ferramental' ? '—' : BV.brl(r.sobra)),
      nd('td', null, r.grupo === 'embalagem_canal' ? '—' : r.grupo === 'ferramental' ? 'amortizado' : BV.brl(r.consumido)), sit);
    tb.append(tr);
  }
  el.append(tb);
});
dash.draw('cpv-lotes-tab', (el) => {
  el.replaceChildren(); const s = dash.data('lotes_prod'); if (s.status !== 'ok') return;
  const thead = nd('thead'); const hr = nd('tr');
  for (const [f, t, c] of [['lote', 'Lote', 'bv-txt'], ['data', 'Data', 'bv-txt'], ['produto', 'Produto', 'bv-txt'], ['codigo', 'Código', 'bv-txt'], ['unidades', 'Unidades'], ['valor_industrializacao', 'Industrialização']]) { const th = nd('th', c || null, t); th.dataset.field = f; hr.append(th); }
  thead.append(hr); el.append(thead);
  const tb = nd('tbody'); let ult = null;
  for (const r of s.data) {
    const tr = nd('tr'); tr.dataset.key = encodeURIComponent(r.lote) + ',' + encodeURIComponent(r.produto);
    if (ult !== null && r.lote !== ult) tr.classList.add('bv-memo-ini');
    tr.append(nd('td', 'bv-txt', r.lote !== ult ? 'Lote ' + r.lote : ''), nd('td', 'bv-txt', r.lote !== ult ? BV.data(r.data) : ''), nd('td', 'bv-txt', r.produto), nd('td', 'bv-txt', r.codigo || '—'), nd('td', null, BV.int(r.unidades)), nd('td', null, BV.brl(r.valor_industrializacao)));
    ult = r.lote; tb.append(tr);
  }
  const tf = nd('tfoot'); const fr = nd('tr', 'bv-tot');
  fr.append(nd('td', 'bv-txt', 'Total'), nd('td'), nd('td'), nd('td'), nd('td', null, BV.int(d3.sum(s.data, (r) => r.unidades))), nd('td', null, BV.brl(d3.sum(s.data, (r) => r.valor_industrializacao))));
  tf.append(fr); el.append(tb, tf);
});
const un3 = (v) => (v === null || v === undefined || isNaN(v) ? '—' : 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }));
const cabecalho = (el, cols) => {
  const thead = nd('thead'); const hr = nd('tr');
  for (const [f, t, c] of cols) { const th = nd('th', c || null, t); th.dataset.field = f; hr.append(th); }
  thead.append(hr); el.append(thead);
};
const SABORES = [['CBU-UN', 'Bueníssimo'], ['CCP-UN', 'Choco Peanut'], ['BMG-UN', 'Milk Gianduia'], ['BSC-UN', 'Salted Caramel']];

dash.draw('cpv-sku', (el) => {
  el.replaceChildren(); const s = dash.data('cpv_sku'); if (s.status !== 'ok') return;
  const f = dash.data('cpv_formato');
  const emb = (k) => (f.status === 'ok' ? (f.data.find((x) => x.formato === k) || {}).embalagem_canal || 0 : 0);
  const ec = emb('ecommerce'); const pdv = emb('pdv');
  cabecalho(el, [['sku', 'Sabor', 'bv-txt'], ['unidades', 'Produzidas (lotes 1–2)'], ['recheio_cobertura', 'Recheio e cobertura'], ['outros_insumos', 'Outros insumos'], ['industrializacao', 'Industrialização'], ['demais', 'Embalagem, frete e formas'], ['cpv_fabrica', 'CPV de fábrica'], ['ecom', 'CPV e-commerce'], ['pdv', 'CPV PDV']]);
  const tb = nd('tbody');
  for (const r of s.data) {
    const tr = nd('tr'); tr.dataset.key = r.codigo;
    const fab = nd('td', null, un3(r.cpv_fabrica)); fab.style.fontWeight = 'var(--cds-font-weight-medium)';
    tr.append(nd('td', 'bv-txt', r.sku), nd('td', null, BV.int(r.unidades)), nd('td', null, un3(r.recheio_cobertura)), nd('td', null, un3(r.outros_insumos)),
      nd('td', null, un3(r.industrializacao)), nd('td', null, un3(r.embalagem_primaria + r.frete_insumos + r.ferramental)), fab,
      nd('td', null, un3(r.cpv_fabrica + ec)), nd('td', null, un3(r.cpv_fabrica + pdv)));
    tb.append(tr);
  }
  const n = d3.sum(s.data, (r) => r.unidades); const med = n ? d3.sum(s.data, (r) => r.cpv_fabrica * r.unidades) / n : null;
  const tf = nd('tfoot'); const fr = nd('tr', 'bv-tot');
  fr.append(nd('td', 'bv-txt', 'Média ponderada'), nd('td', null, BV.int(n)), nd('td'), nd('td'), nd('td'), nd('td'), nd('td', null, un3(med)), nd('td', null, un3(med + ec)), nd('td', null, un3(med + pdv)));
  tf.append(fr); el.append(tb, tf);
});

dash.draw('cpv-receita-tab', (el) => {
  el.replaceChildren(); const s = dash.data('cpv_receita'); if (s.status !== 'ok') return;
  cabecalho(el, [['insumo', 'Insumo', 'bv-txt'], ['fornecedor', 'Fornecedor', 'bv-txt'], ['preco_kg', 'Preço por kg'], ...SABORES.map(([c, n]) => ['g_' + c, n]), ['confirmar', 'Situação', 'bv-txt']]);
  const tb = nd('tbody');
  for (const r of s.data) {
    const tr = nd('tr'); tr.dataset.key = r.insumo;
    const fab = r.fornecido_por === 'fabrica';
    const forn = nd('td', 'bv-txt', fab ? 'Favo de Mel' : r.fornecedor || '—');
    if (r.fonte) forn.append(nd('span', 'bv-cpv-obs', r.fonte));
    tr.append(nd('td', 'bv-txt', r.insumo), forn, nd('td', null, fab ? 'na industrialização' : BV.brl(r.preco_kg)));
    for (const [c] of SABORES) {
      const g = r['g_' + c]; const td = nd('td');
      if (g === null || g === undefined) td.textContent = '—';
      else {
        td.append(document.createTextNode(g.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + (r.medida === 'ml' ? ' ml' : ' g')));
        if (!fab && r['r_' + c]) td.append(nd('span', 'bv-cpv-obs', un3(r['r_' + c])));
      }
      tr.append(td);
    }
    const sit = nd('td', 'bv-txt'); sit.append(nd('span', 'bv-pill ' + (r.confirmar ? 'bv-warn' : 'bv-in'), r.confirmar ? 'confirmar' : 'ok'));
    if (r.observacao) sit.append(nd('span', 'bv-cpv-obs', r.observacao));
    tr.append(sit); tb.append(tr);
  }
  const tf = nd('tfoot'); const fr = nd('tr', 'bv-tot');
  fr.append(nd('td', 'bv-txt', 'Insumos por unidade'), nd('td'), nd('td'));
  for (const [c] of SABORES) fr.append(nd('td', null, un3(d3.sum(s.data, (r) => r['r_' + c] || 0))));
  fr.append(nd('td'));
  tf.append(fr); el.append(tb, tf);
});

dash.draw('cpv-conc', (el) => {
  el.replaceChildren(); const s = dash.data('cpv_conc'); if (s.status !== 'ok') return;
  cabecalho(el, [['fornecedor', 'Insumos', 'bv-txt'], ['comprado', 'Pago'], ['sobra', 'Sobra informada'], ['consumido', 'Consumido'], ['kg_receita', 'Pela receita (kg)'], ['receita', 'Pela receita (R$)'], ['diferenca', 'Diferença'], ['diferenca_pct', '% do consumido']]);
  const tb = nd('tbody');
  for (const r of s.data) {
    const tr = nd('tr'); tr.dataset.key = r.fornecedor;
    const dif = nd('td', null, BV.brl(r.diferenca)); if (r.diferenca > 0) dif.style.color = 'var(--bv-vinho)';
    tr.append(nd('td', 'bv-txt', r.fornecedor), nd('td', null, BV.brl(r.comprado)), nd('td', null, BV.brl(r.sobra)), nd('td', null, BV.brl(r.consumido)),
      nd('td', null, r.kg_receita === null ? '—' : r.kg_receita.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' kg'), nd('td', null, BV.brl(r.receita)), dif,
      nd('td', null, r.diferenca_pct === null ? '—' : r.diferenca_pct.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%'));
    tb.append(tr);
  }
  const tot = (k) => d3.sum(s.data, (r) => r[k] || 0);
  const tf = nd('tfoot'); const fr = nd('tr', 'bv-tot');
  fr.append(nd('td', 'bv-txt', 'Total'), nd('td', null, BV.brl(tot('comprado'))), nd('td', null, BV.brl(tot('sobra'))), nd('td', null, BV.brl(tot('consumido'))), nd('td'), nd('td', null, BV.brl(tot('receita'))), nd('td', null, BV.brl(tot('diferenca'))),
    nd('td', null, (tot('diferenca') / tot('consumido') * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%'));
  tf.append(fr); el.append(tb, tf);
});
const STATUS_CREATOR = { approved: ['na comunidade', 'bv-in'], pending: ['aguardando', 'bv-warn'], denied: ['fora', 'bv-out'] };
const mesNome = (m) => { const [a, n] = String(m).split('-'); return ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][Number(n) - 1] + '/' + a.slice(2); };
const kpi = (rot, val, sub) => { const d = nd('div', 'bv-kpi'); d.append(nd('span', 'bv-kpi-label', rot), nd('span', 'bv-kpi-val', val)); if (sub) d.append(nd('span', 'bv-kpi-sub', sub)); return d; };

dash.draw('inbazz-kpis', (el) => {
  el.replaceChildren(); const s = dash.data('inbazz_mes'); if (s.status !== 'ok' || !s.data.length) return;
  const r = s.data[0];
  el.append(
    kpi('Vendas por cupom · ' + mesNome(r.mes), BV.brl(r.vendas_creators), `${BV.int(r.pedidos_creators)} pedidos · ${BV.pct(r.vendas_loja ? r.vendas_creators / r.vendas_loja : null)} da loja`),
    kpi('Comissões · ' + mesNome(r.mes), BV.brl(r.custos), `${BV.int(r.creators_vendendo)} creators vendendo`),
    kpi('Posts · ' + mesNome(r.mes), BV.int(r.posts), `${BV.int(r.creators_postando)} creators postando`),
    kpi('Retorno sobre influência · ' + mesNome(r.mes), r.investimento ? (r.vendas_creators / r.investimento).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '×' : '—', `investimento ${BV.brl(r.investimento)}`));
});

dash.draw('tab-inbazz-mes', (el) => {
  el.replaceChildren(); const s = dash.data('inbazz_mes'); if (s.status !== 'ok') return;
  cabecalho(el, [['mes', 'Mês', 'bv-txt'], ['vendas_loja', 'Vendas da loja'], ['vendas_creators', 'Vendas por cupom'], ['pedidos_creators', 'Pedidos por cupom'], ['posts', 'Posts'], ['creators_postando', 'Creators postando'], ['custo_influ', 'Bonificações a influenciadores'], ['custos', 'Comissões'], ['investimento', 'Investimento'], ['retorno', 'Retorno']]);
  const tb = nd('tbody');
  for (const r of s.data) {
    const tr = nd('tr'); tr.dataset.key = r.mes;
    tr.append(nd('td', 'bv-txt', mesNome(r.mes)), nd('td', null, BV.brl(r.vendas_loja)), nd('td', null, BV.brl(r.vendas_creators)), nd('td', null, BV.int(r.pedidos_creators)),
      nd('td', null, BV.int(r.posts)), nd('td', null, BV.int(r.creators_postando)), nd('td', null, BV.brl(r.custo_influ)), nd('td', null, BV.brl(r.custos)),
      nd('td', null, BV.brl(r.investimento)), nd('td', null, r.investimento ? (r.vendas_creators / r.investimento).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '×' : '—'));
    tb.append(tr);
  }
  el.append(tb);
});

dash.draw('tab-inbazz-creators', (el) => {
  el.replaceChildren(); const s = dash.data('inbazz_creators'); if (s.status !== 'ok') return;
  cabecalho(el, [['nome', 'Creator', 'bv-txt'], ['partnership_status', 'Situação', 'bv-txt'], ['cupons', 'Cupom', 'bv-txt'], ['posts', 'Posts'], ['ultimo_post', 'Último post'], ['pedidos', 'Pedidos'], ['vendas', 'Vendas'], ['comissao', 'Comissão']]);
  const tb = nd('tbody');
  for (const r of s.data) {
    const tr = nd('tr'); tr.dataset.key = r.creator_id;
    const nome = nd('td', 'bv-txt', r.nome); if (r.instagram) nome.append(nd('span', 'bv-cpv-obs', '@' + r.instagram));
    const [rot, cls] = STATUS_CREATOR[r.partnership_status] || [r.partnership_status || '—', 'bv-warn'];
    const sit = nd('td', 'bv-txt'); sit.append(nd('span', 'bv-pill ' + cls, rot));
    tr.append(nome, sit, nd('td', 'bv-txt', r.cupons || '—'), nd('td', null, BV.int(r.posts)), nd('td', null, r.ultimo_post ? BV.data(r.ultimo_post) : '—'),
      nd('td', null, BV.int(r.pedidos)), nd('td', null, BV.brl(r.vendas)), nd('td', null, BV.brl(r.comissao)));
    tb.append(tr);
  }
  const tot = (k) => d3.sum(s.data, (r) => r[k] || 0);
  const tf = nd('tfoot'); const fr = nd('tr', 'bv-tot');
  fr.append(nd('td', 'bv-txt', `Total · ${s.data.length} creators`), nd('td'), nd('td'), nd('td', null, BV.int(tot('posts'))), nd('td'), nd('td', null, BV.int(tot('pedidos'))), nd('td', null, BV.brl(tot('vendas'))), nd('td', null, BV.brl(tot('comissao'))));
  tf.append(fr); el.append(tb, tf);
});
/* ===== Análise de área: abre ao clicar num card de Metas ===== */
const AN = {
  pdv: { nome: 'PDV', cor: 'var(--bv-pdv)', hex: '#1099D6', canal: 'pdv', itens: 'pdv' },
  organica: { nome: 'Venda orgânica', cor: 'var(--bv-org)', hex: '#8DB52A', canal: 'organica', itens: 'vendas_organicas' },
  performance: { nome: 'Performance', cor: 'var(--bv-perf)', hex: '#F4831F', itens: 'site' },
  influencia: { nome: 'MKT influência', cor: 'var(--bv-infl)', hex: '#D8238E', itens: 'site' },
};
const anArea = () => (AN[dash.params().an_area] ? dash.params().an_area : 'performance');
const anGrao = () => dash.params().an_grao || 'dia';
const num = (v) => Number(v) || 0;
const div = (a, b) => (b ? a / b : null);
const xfmt = (v) => (v === null || v === undefined || !isFinite(v) ? '—' : BV.dec(v) + '×');
const desloca = (iso, dias) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + dias); return d.toISOString().slice(0, 10); };
const ultimoDia = (m) => { const d = new Date(m + '-01T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + 1); d.setUTCDate(0); return d.toISOString().slice(0, 10); };

/* Período escolhido e o período anterior equivalente */
const anPeriodo = () => {
  const hoje = BV.hoje(), mes = hoje.slice(0, 7), ant = BV.mesAnterior(mes);
  const p = dash.params().an_periodo || 'mes_atual';
  if (p === 'mes_anterior') { const a2 = BV.mesAnterior(ant); return { ini: ant + '-01', fim: ultimoDia(ant), pi: a2 + '-01', pf: ultimoDia(a2), rot: BV.mesLongo(ant), rotAnt: BV.mesLongo(a2) }; }
  if (p === 'tudo') return { ini: '2000-01-01', fim: hoje, pi: null, pf: null, rot: 'desde o início', rotAnt: null };
  const n = { ult_7: 7, ult_30: 30, ult_90: 90 }[p];
  if (n) return { ini: desloca(hoje, 1 - n), fim: hoje, pi: desloca(hoje, 1 - 2 * n), pf: desloca(hoje, -n), rot: `últimos ${n} dias`, rotAnt: `${n} dias anteriores` };
  const dia = +hoje.slice(8, 10), fa = ant + '-' + String(Math.min(dia, +ultimoDia(ant).slice(8, 10))).padStart(2, '0');
  return { ini: mes + '-01', fim: hoje, pi: ant + '-01', pf: fa, rot: BV.mesLongo(mes), rotAnt: `mesmo período de ${BV.mesLongo(ant)}` };
};
const dentro = (iso, a, b) => !!iso && a !== null && iso.slice(0, 10) >= a && iso.slice(0, 10) <= b;
const balde = (iso) => {
  const g = anGrao();
  if (g === 'mes') return iso.slice(0, 7);
  if (g === 'semana') { const d = new Date(iso.slice(0, 10) + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); }
  return iso.slice(0, 10);
};
const rotBalde = (k) => (anGrao() === 'mes' ? BV.mesLongo(k) : anGrao() === 'semana' ? 'Semana de ' + BV.data(k) : BV.data(k));

/* Métricas da área num intervalo, a partir de canais_dia (e pedidos/envios para a influência) */
const anMetricas = (area, a, b) => {
  const dias = dash.data('canais_dia').data.filter((r) => dentro(r.data, a, b));
  const s = (k) => d3.sum(dias, (r) => num(r[k]));
  if (area === 'pdv' || area === 'organica') {
    const ped = (dash.data('pedidos_canal').data || []).filter((r) => r.canal === AN[area].canal && dentro(r.data, a, b));
    const rec = s(area), n = s(area + '_pedidos'), cli = new Set(ped.map((r) => r.cliente)).size;
    return { receita: rec, pedidos: n, ticket: div(rec, n), clientes: cli, por_cliente: div(rec, cli) };
  }
  if (area === 'performance') {
    const g = s('gasto'), perf = s('performance'), mv = s('meta_valor'), c = s('meta_compras'), im = s('impressoes'), cl = s('cliques');
    return { gasto: g, receita: perf, roas: div(perf, g), meta_valor: mv, roas_meta: div(mv, g), compras: c, cpa: div(g, c), ctr: div(cl, im), cpm: div(g * 1000, im), cpc: div(g, cl), ticket: div(mv, c) };
  }
  const env = (dash.data('envios_creator').data || []).filter((r) => dentro(r.data, a, b));
  const ped = (dash.data('pedidos_canal').data || []).filter((r) => r.canal === 'influencia_cupom' && dentro(r.data, a, b));
  const inv = d3.sum(env, (r) => num(r.investimento)) + d3.sum(ped, (r) => num(r.comissao));
  const rec = s('influencia'), cup = s('cupom');
  return { receita: rec, cupom: cup, cupom_pedidos: s('cupom_pedidos'), sem_cupom: rec - cup, envios: env.length, custo_envios: d3.sum(env, (r) => num(r.investimento)), comissao: d3.sum(ped, (r) => num(r.comissao)), investimento: inv, retorno_cupom: div(cup, inv), retorno: div(rec, inv) };
};
const anPronto = (el) => {
  const ids = ['canais_dia', 'pedidos_canal'].concat(anArea() === 'influencia' ? ['envios_creator'] : []);
  return BV.status(el, ...ids);
};

dash.draw('an-titulo', (el) => {
  el.replaceChildren(); const a = anArea(), p = anPeriodo();
  el.style.setProperty('--area', AN[a].cor);
  el.append(nd('span', 'bv-eyebrow', 'Análise'), nd('h2', 'bv-h2', `${AN[a].nome} · ${p.rot}`));
  if (p.rotAnt) el.append(nd('span', 'bv-area-sub', 'Comparado com ' + p.rotAnt + '.'));
});

dash.draw('an-kpis', (el) => {
  el.replaceChildren(); if (!anPronto(el)) return;
  const a = anArea(), p = anPeriodo(), m = anMetricas(a, p.ini, p.fim), o = p.pi ? anMetricas(a, p.pi, p.pf) : null;
  const card = (rot, campo, fmt, bom = 1) => {
    const d = nd('div', 'bv-kpi'); d.append(nd('span', 'bv-kpi-label', rot), nd('span', 'bv-kpi-val', fmt(m[campo])));
    if (o && m[campo] !== null && o[campo]) {
      const v = m[campo] / o[campo] - 1; const sub = nd('span', 'bv-kpi-sub', `${v >= 0 ? '+' : ''}${BV.pct(v)} · antes ${fmt(o[campo])}`);
      sub.classList.add(bom === 0 ? 'bv-neutro' : v * bom >= 0 ? 'bv-pos' : 'bv-neg'); d.append(sub);
    } else d.append(nd('span', 'bv-kpi-sub', o ? 'sem base de comparação' : ''));
    el.append(d);
  };
  if (a === 'pdv' || a === 'organica') {
    card('Receita', 'receita', BV.brl); card('Pedidos', 'pedidos', BV.int); card('Ticket médio', 'ticket', BV.brl);
    card('Clientes que compraram', 'clientes', BV.int); card('Receita por cliente', 'por_cliente', BV.brl);
  } else if (a === 'performance') {
    card('Investido no Meta', 'gasto', BV.brl, 0); card('Receita atribuída pelo Meta', 'receita', BV.brl); card('ROAS', 'roas', xfmt);
    card('Compras (Meta)', 'compras', BV.int); card('Custo por compra', 'cpa', BV.brl, -1);
    card('CTR', 'ctr', BV.pct); card('CPM', 'cpm', BV.brl, -1); card('Ticket médio (Meta)', 'ticket', BV.brl);
  } else {
    card('Receita de influência', 'receita', BV.brl); card('Receita por cupom de creator', 'cupom', BV.brl); card('Pedidos com cupom', 'cupom_pedidos', BV.int);
    card('Envios a influenciadores', 'envios', BV.int, 0); card('Investimento (envios + comissões)', 'investimento', BV.brl, 0);
    card('Retorno só por cupom', 'retorno_cupom', xfmt); card('Retorno da influência', 'retorno', xfmt);
  }
});

/* Série por balde (dia, semana ou mês) */
const anSerie = () => {
  const a = anArea(), p = anPeriodo();
  const chaves = [...new Set(dash.data('canais_dia').data.filter((r) => dentro(r.data, p.ini, p.fim)).map((r) => balde(r.data)))].sort();
  return chaves.map((k) => {
    const dias = dash.data('canais_dia').data.filter((r) => dentro(r.data, p.ini, p.fim) && balde(r.data) === k).map((r) => r.data).sort();
    return { k, ...anMetricas(a, dias[0], dias[dias.length - 1]) };
  });
};

/* Tooltip da influência: faturamento do período do balde e quem vendeu pelo cupom */
const anTipInfl = (d) => {
  const p = anPeriodo();
  const dias = dash.data('canais_dia').data.filter((r) => dentro(r.data, p.ini, p.fim) && balde(r.data) === d.k);
  const fat = d3.sum(dias, (r) => num(r.pdv) + num(r.organica) + num(r.site)), site = d3.sum(dias, (r) => num(r.site));
  const ped = (dash.data('pedidos_canal').data || []).filter((r) => r.canal === 'influencia_cupom' && dentro(r.data, p.ini, p.fim) && balde(r.data) === d.k);
  const por = d3.rollups(ped, (v) => ({ n: v.length, val: d3.sum(v, (r) => num(r.total)) }), (r) => r.creator || r.cupom || '(sem nome)').sort((a, b) => b[1].val - a[1].val);
  const linhas = [['Faturamento total', BV.brl(fat)], ['Vendas do site', BV.brl(site)], ['MKT influência', BV.brl(d.receita)], ['Pelo cupom', BV.brl(d.cupom)]];
  for (const [nome, o] of por) linhas.push(['  ' + nome, `${BV.brl(o.val)}${o.n > 1 ? ` (${o.n} pedidos)` : ''}`]);
  if (!por.length) linhas.push(['Vendas pelo cupom', 'nenhuma']);
  linhas.push(['Investimento', BV.brl(d.investimento)]);
  return linhas;
};
dash.draw('an-graf-tit', (el) => { el.textContent = { performance: 'Investido × receita atribuída', influencia: 'Receita de influência e parte que veio por cupom' }[anArea()] || 'Receita por período'; });
dash.draw('an-graf-leg', (el) => {
  el.replaceChildren(); const a = anArea();
  const itens = a === 'performance' ? [['Receita atribuída', AN[a].cor], ['Investido', 'var(--color-fg-muted)']] : a === 'influencia' ? [['Receita de influência', AN[a].cor], ['Linha: por cupom', null]] : [['Receita', AN[a].cor]];
  for (const [t, c] of itens) { const li = nd('li'); if (c) { const sw = nd('span', 'bv-sw'); sw.style.background = c; li.append(sw); } li.append(document.createTextNode(t)); el.append(li); }
});
dash.draw('an-graf', (el) => {
  if (!anPronto(el)) return;
  const a = anArea(), dados = anSerie(), cor = AN[a].hex;
  const base = { data: dados, x: 'k', height: 260, xfmt: anGrao() === 'mes' ? BV.mesCurto : BV.dataCurta, tipTitle: (d) => rotBalde(d.k), vazio: 'Nada no período.' };
  if (a === 'performance') BV.chart(el, { ...base, label: 'Investido e receita atribuída por período', series: [{ key: 'receita', sign: 1, color: cor }, { key: 'gasto', sign: -1, color: 'var(--color-fg-muted)' }],
    tipRows: (d) => [['Receita atribuída', BV.brl(d.receita)], ['Investido', BV.brl(d.gasto)], ['ROAS', xfmt(d.roas)]] });
  else if (a === 'influencia') BV.chart(el, { ...base, label: 'Receita de influência por período', series: [{ key: 'receita', sign: 1, color: cor }], line: { key: 'cupom' },
    tipRows: (d) => anTipInfl(d) });
  else BV.chart(el, { ...base, label: 'Receita por período', series: [{ key: 'receita', sign: 1, color: cor }],
    tipRows: (d) => [['Receita', BV.brl(d.receita)], ['Pedidos', BV.int(d.pedidos)], ['Ticket médio', BV.brl(d.ticket)]] });
});

dash.draw('an-graf2', (el) => {
  if (anArea() !== 'performance') { el.replaceChildren(); return; }
  if (!anPronto(el)) return;
  const dados = anSerie().map((d) => ({ ...d, roas: d.roas || 0 }));
  BV.chart(el, { data: dados, x: 'k', height: 200, label: 'ROAS por período', series: [], line: { key: 'roas' }, yfmt: (v) => BV.dec(v) + '×',
    xfmt: anGrao() === 'mes' ? BV.mesCurto : BV.dataCurta, tipTitle: (d) => rotBalde(d.k), tipRows: (d) => [['ROAS', xfmt(d.roas)], ['Receita', BV.brl(d.receita)], ['Investido', BV.brl(d.gasto)]] });
});

dash.draw('an-tab-per', (el) => {
  el.replaceChildren(); if (!anPronto(el)) return;
  const a = anArea(), dados = anSerie().reverse();
  const cols = a === 'performance'
    ? [['k', 'Período', 'bv-txt', rotBalde], ['gasto', 'Investido', null, BV.brl], ['receita', 'Receita atribuída', null, BV.brl], ['roas', 'ROAS', null, xfmt], ['compras', 'Compras', null, BV.int], ['cpa', 'Custo por compra', null, BV.brl], ['ctr', 'CTR', null, BV.pct]]
    : a === 'influencia'
      ? [['k', 'Período', 'bv-txt', rotBalde], ['receita', 'Influência', null, BV.brl], ['cupom', 'Por cupom', null, BV.brl], ['cupom_pedidos', 'Pedidos com cupom', null, BV.int], ['sem_cupom', 'Sem cupom', null, BV.brl], ['envios', 'Envios', null, BV.int], ['investimento', 'Investimento', null, BV.brl], ['retorno', 'Retorno', null, xfmt]]
      : [['k', 'Período', 'bv-txt', rotBalde], ['pedidos', 'Pedidos', null, BV.int], ['receita', 'Receita', null, BV.brl], ['ticket', 'Ticket médio', null, BV.brl], ['clientes', 'Clientes', null, BV.int]];
  cabecalho(el, cols.map(([f, t, c]) => [f, t, c]));
  const tb = nd('tbody');
  for (const r of dados) { const tr = nd('tr'); for (const [f, , c, fmt] of cols) tr.append(nd('td', c, fmt(r[f]))); tb.append(tr); }
  el.append(tb);
});


dash.draw('an-tab-plat', (el) => {
  el.replaceChildren(); if (anArea() !== 'performance' || !BV.status(el, 'meta_plataforma')) return;
  const p = anPeriodo(), rs = dash.data('meta_plataforma').data.filter((r) => dentro(r.data, p.ini, p.fim));
  const NOMES = { facebook: 'Facebook', instagram: 'Instagram', audience_network: 'Audience Network', messenger: 'Messenger', threads: 'Threads' };
  const g = d3.rollups(rs, (v) => ({ gasto: d3.sum(v, (r) => num(r.gasto)), im: d3.sum(v, (r) => num(r.impressoes)), cl: d3.sum(v, (r) => num(r.cliques)), c: d3.sum(v, (r) => num(r.compras)), val: d3.sum(v, (r) => num(r.valor_compras)) }), (r) => (NOMES[r.plataforma] || r.plataforma) + ' · ' + String(r.posicao).replace(/_/g, ' '))
    .sort((x, y) => y[1].gasto - x[1].gasto);
  const tot = d3.sum(g, (x) => x[1].gasto);
  cabecalho(el, [['k', 'Plataforma · posição', 'bv-txt'], ['gasto', 'Investido'], ['pct', '% do investido'], ['im', 'Impressões'], ['ctr', 'CTR'], ['c', 'Compras'], ['val', 'Valor (Meta)'], ['roas', 'ROAS Meta'], ['cpa', 'Custo por compra']]);
  const tb = nd('tbody');
  if (!g.length) { const tr = nd('tr'); const td = nd('td', 'bv-txt', 'Ainda sem dados por plataforma: chegam na próxima sincronização do Meta.'); td.colSpan = 9; tr.append(td); tb.append(tr); }
  for (const [k, o] of g) {
    const tr = nd('tr');
    tr.append(nd('td', 'bv-txt', k), nd('td', null, BV.brl(o.gasto)), nd('td', null, BV.pct(div(o.gasto, tot))), nd('td', null, BV.int(o.im)), nd('td', null, BV.pct(div(o.cl, o.im))),
      nd('td', null, BV.int(o.c)), nd('td', null, BV.brl(o.val)), nd('td', null, xfmt(div(o.val, o.gasto))), nd('td', null, BV.brl(div(o.gasto, o.c))));
    tb.append(tr);
  }
  el.append(tb);
});

dash.draw('an-tab2-tit', (el) => { el.textContent = { performance: 'Campanhas', influencia: 'Creators: envios, comissão e vendas por cupom no período' }[anArea()] || 'Clientes'; });
dash.draw('an-tab2', (el) => {
  el.replaceChildren(); const a = anArea(), p = anPeriodo();
  const tb = nd('tbody');
  if (a === 'performance') {
    if (!BV.status(el, 'meta_campanhas_dia')) return;
    const rs = dash.data('meta_campanhas_dia').data.filter((r) => dentro(r.data, p.ini, p.fim));
    const g = d3.rollups(rs, (v) => ({ nome: v[v.length - 1].campanha_nome || v[0].campanha, gasto: d3.sum(v, (r) => num(r.gasto)), im: d3.sum(v, (r) => num(r.impressoes)), cl: d3.sum(v, (r) => num(r.cliques)), c: d3.sum(v, (r) => num(r.compras)), val: d3.sum(v, (r) => num(r.valor_compras)) }), (r) => r.campanha)
      .map((x) => x[1]).filter((o) => o.gasto > 0).sort((x, y) => y.gasto - x.gasto);
    cabecalho(el, [['nome', 'Campanha', 'bv-txt'], ['gasto', 'Investido'], ['im', 'Impressões'], ['cl', 'Cliques'], ['ctr', 'CTR'], ['c', 'Compras'], ['val', 'Valor (Meta)'], ['roas', 'ROAS Meta'], ['cpa', 'Custo por compra']]);
    for (const o of g) {
      const tr = nd('tr');
      tr.append(nd('td', 'bv-txt', o.nome), nd('td', null, BV.brl(o.gasto)), nd('td', null, BV.int(o.im)), nd('td', null, BV.int(o.cl)), nd('td', null, BV.pct(div(o.cl, o.im))),
        nd('td', null, BV.int(o.c)), nd('td', null, BV.brl(o.val)), nd('td', null, xfmt(div(o.val, o.gasto))), nd('td', null, BV.brl(div(o.gasto, o.c))));
      tb.append(tr);
    }
  } else if (a === 'influencia') {
    if (!BV.status(el, 'inbazz_creators', 'envios_creator', 'pedidos_canal')) return;
    const env = dash.data('envios_creator').data.filter((r) => dentro(r.data, p.ini, p.fim));
    const ped = dash.data('pedidos_canal').data.filter((r) => r.canal === 'influencia_cupom' && dentro(r.data, p.ini, p.fim));
    const linhas = dash.data('inbazz_creators').data.map((c) => {
      const e = env.filter((r) => r.creator_id === c.creator_id), v = ped.filter((r) => r.creator_id === c.creator_id);
      const custo = d3.sum(e, (r) => num(r.investimento)), com = d3.sum(v, (r) => num(r.comissao)), vend = d3.sum(v, (r) => num(r.total));
      return { ...c, e: e.length, custo, prod: d3.sum(e, (r) => num(r.custo_produto)), com, vend, ped: v.length, ret: div(vend, custo + com) };
    }).filter((r) => r.e || r.ped || r.partnership_status === 'approved').sort((x, y) => y.vend - x.vend || y.custo - x.custo);
    const semCreator = env.filter((r) => !r.creator_id);
    cabecalho(el, [['nome', 'Creator', 'bv-txt'], ['e', 'Envios'], ['prod', 'Produto (CPV)'], ['custo', 'Envio total (produto + frete)'], ['com', 'Comissão'], ['posts', 'Posts (total)'], ['ped', 'Pedidos com cupom'], ['vend', 'Vendas com cupom'], ['ret', 'Retorno']]);
    for (const r of linhas) {
      const tr = nd('tr'); const n = nd('td', 'bv-txt', r.nome); if (r.instagram) n.append(nd('span', 'bv-cpv-obs', '@' + r.instagram));
      tr.append(n, nd('td', null, BV.int(r.e)), nd('td', null, BV.brl(r.prod)), nd('td', null, BV.brl(r.custo)), nd('td', null, BV.brl(r.com)), nd('td', null, BV.int(r.posts)),
        nd('td', null, BV.int(r.ped)), nd('td', null, BV.brl(r.vend)), nd('td', null, xfmt(r.ret)));
      tb.append(tr);
    }
    if (semCreator.length) {
      const tr = nd('tr', 'bv-tot');
      tr.append(nd('td', 'bv-txt', `Envios a quem não está na Inbazz (${semCreator.length})`), nd('td', null, BV.int(semCreator.length)), nd('td', null, BV.brl(d3.sum(semCreator, (r) => num(r.custo_produto)))),
        nd('td', null, BV.brl(d3.sum(semCreator, (r) => num(r.investimento)))), nd('td'), nd('td'), nd('td'), nd('td'), nd('td'));
      tb.append(tr);
    }
  } else {
    if (!anPronto(el)) return;
    const ped = dash.data('pedidos_canal').data.filter((r) => r.canal === AN[a].canal && dentro(r.data, p.ini, p.fim));
    const tot = d3.sum(ped, (r) => num(r.total));
    const g = d3.rollups(ped, (v) => ({ n: v.length, rec: d3.sum(v, (r) => num(r.total)), ult: d3.max(v, (r) => r.data) }), (r) => r.cliente || '(sem nome)').sort((x, y) => y[1].rec - x[1].rec);
    cabecalho(el, [['cliente', 'Cliente', 'bv-txt'], ['n', 'Pedidos'], ['rec', 'Receita'], ['pct', '% da receita'], ['t', 'Ticket médio'], ['ult', 'Último pedido']]);
    for (const [c, o] of g) {
      const tr = nd('tr');
      tr.append(nd('td', 'bv-txt', c), nd('td', null, BV.int(o.n)), nd('td', null, BV.brl(o.rec)), nd('td', null, BV.pct(div(o.rec, tot))), nd('td', null, BV.brl(div(o.rec, o.n))), nd('td', null, BV.data(o.ult)));
      tb.append(tr);
    }
  }
  el.append(tb);
});

dash.draw('an-prod-tit', (el) => { el.textContent = AN[anArea()].itens === 'site' ? 'Produtos vendidos no site (todos os canais do site)' : 'Produtos'; });
dash.draw('an-tab-prod', (el) => {
  el.replaceChildren(); if (!BV.status(el, 'itens_dia')) return;
  const p = anPeriodo(), rs = dash.data('itens_dia').data.filter((r) => r.canal === AN[anArea()].itens && dentro(r.data, p.ini, p.fim));
  const g = d3.rollups(rs, (v) => ({ un: d3.sum(v, (r) => num(r.unidades)), q: d3.sum(v, (r) => num(r.quantidade)), val: d3.sum(v, (r) => num(r.vendas)) }), (r) => r.descricao).sort((x, y) => y[1].val - x[1].val);
  const tot = d3.sum(g, (x) => x[1].val);
  cabecalho(el, [['produto', 'Produto', 'bv-txt'], ['q', 'Itens'], ['un', 'Unidades (cookies e brownies)'], ['val', 'Vendas'], ['pct', '% das vendas']]);
  const tb = nd('tbody');
  for (const [k, o] of g) { const tr = nd('tr'); tr.append(nd('td', 'bv-txt', k), nd('td', null, BV.int(o.q)), nd('td', null, BV.int(o.un)), nd('td', null, BV.brl(o.val)), nd('td', null, BV.pct(div(o.val, tot)))); tb.append(tr); }
  el.append(tb);
});

dash.draw('an-nota', (el) => {
  el.textContent = {
    pdv: 'PDV = loja "PDV" do Bling. Clientes = contato do pedido.',
    organica: 'Venda orgânica = loja "Vendas orgânicas" do Bling e pedidos sem loja.',
    performance: 'Receita atribuída = todo o valor de compras que o Meta informa (compras até 7 dias após o clique ou 1 dia após a visualização), inclusive pedidos que também usaram cupom de creator. ROAS = essa receita ÷ investido no Meta.',
    influencia: 'MKT influência = vendas do site − receita atribuída pelo Meta. Pedidos com cupom de creator aparecem aqui e nos rankings mesmo quando o Meta também os atribui. Investimento = envios a influenciadores (produto pelo CPV de cada formato + frete médio do mês) + comissões. Creators ligados aos envios do Bling pelo nome ou pelo @; vínculos manuais ficam na tabela inbazz_vinculo_envio.',
  }[anArea()];
});

/* Controles: abrir a análise ao clicar num card de área; chips; voltar */
(() => {
  const abrirSec = (nome) => {
    document.querySelectorAll('[data-sec]').forEach((s) => { s.hidden = s.dataset.sec !== nome; });
    document.querySelectorAll('.bv-tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === nome)));
    dash.setLink(nome); window.scrollTo({ top: 0 });
  };
  const ir = (area) => { abrirSec('analise'); dash.setParams({ an_area: area }); };
  document.querySelectorAll('#metas .bv-area[id^="area-"]').forEach((art) => {
    const area = art.id.replace('area-', ''); if (!AN[area]) return;
    art.addEventListener('click', () => ir(area));
    art.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ir(area); } });
  });
  document.querySelectorAll('[data-area-an]').forEach((b) => b.addEventListener('click', () => dash.setParams({ an_area: b.dataset.areaAn })));
  document.querySelectorAll('[data-abrir]').forEach((b) => b.addEventListener('click', () => abrirSec(b.dataset.abrir)));
  const marca = () => document.querySelectorAll('[data-area-an]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.areaAn === anArea())));
  marca(); dash.onData(marca);
})();
/* ===== Liga dos embaixadores (análise de MKT influência; usa o período da página) ===== */
const NIVEIS = [
  { nome: 'Bronze', min: 0, cor: '#B07A4A' },
  { nome: 'Prata', min: 500, cor: '#9AA3AD' },
  { nome: 'Ouro', min: 1500, cor: '#D9A520' },
  { nome: 'Platina', min: 5000, cor: '#5FB3B3' },
  { nome: 'Diamante', min: 15000, cor: '#7C6CF2' },
];
const nivelDe = (v) => { let i = 0; NIVEIS.forEach((n, k) => { if (v >= n.min) i = k; }); return i; };
const pillNivel = (n) => { const s = nd('span', 'bv-emb-nivel', NIVEIS[n].nome); s.style.setProperty('--nivel', NIVEIS[n].cor); return s; };

const embLinhas = () => {
  const p = anPeriodo();
  const ped = (dash.data('pedidos_canal').data || []).filter((r) => r.canal === 'influencia_cupom' && r.creator_id);
  const env = (dash.data('envios_creator').data || []).filter((r) => r.creator_id);
  const cr = new Map((dash.data('inbazz_creators').data || []).map((c) => [c.creator_id, c]));
  const agrega = (a, b) => {
    const m = new Map();
    for (const r of ped) if (dentro(r.data, a, b)) {
      const o = m.get(r.creator_id) || { pedidos: 0, vendas: 0, comissao: 0, envios: 0, custo_envios: 0 };
      o.pedidos++; o.vendas += num(r.total); o.comissao += num(r.comissao); m.set(r.creator_id, o);
    }
    for (const r of env) if (dentro(r.data, a, b) && m.has(r.creator_id)) { const o = m.get(r.creator_id); o.envios++; o.custo_envios += num(r.investimento); }
    return m;
  };
  const carreira = agrega('2000-01-01', BV.hoje()), periodo = agrega(p.ini, p.fim), anterior = p.pi ? agrega(p.pi, p.pf) : null;
  const primeira = new Map(); for (const r of ped) { const d = primeira.get(r.creator_id); if (!d || r.data < d) primeira.set(r.creator_id, r.data); }
  const ls = [...periodo].map(([id, o]) => {
    const c = cr.get(id) || {}, car = carreira.get(id).vendas, n = nivelDe(car), prox = NIVEIS[n + 1], inv = o.comissao + o.custo_envios, ant = anterior ? anterior.get(id) : null;
    return { id, nome: c.nome || '(sem nome)', instagram: c.instagram, posts: num(c.posts), ...o, ticket: div(o.vendas, o.pedidos), investimento: inv, retorno: div(o.vendas, inv),
      carreira: car, nivel: n, prox, falta: prox ? prox.min - car : 0, estreia: dentro(primeira.get(id), p.ini, p.fim) && p.ini !== '2000-01-01', alta: !!(ant && o.vendas > ant.vendas), conquistas: [] };
  }).sort((a, b) => b.vendas - a.vendas || b.pedidos - a.pedidos);
  const melhor = (k) => { const v = ls.filter((r) => r[k] !== null && r[k] > 0); return v.length ? v.reduce((a, b) => (b[k] > a[k] ? b : a)) : null; };
  const dar = (r, t) => { if (r) r.conquistas.push(t); };
  dar(melhor('vendas'), 'Top vendas'); dar(melhor('retorno'), 'Melhor retorno'); dar(melhor('pedidos'), 'Mais pedidos'); dar(melhor('ticket'), 'Maior ticket');
  ls.forEach((r) => { if (r.estreia) r.conquistas.push('Estreia'); if (r.alta) r.conquistas.push('Em alta'); });
  return ls;
};

dash.draw('emb-tabela', (el) => {
  el.replaceChildren(); if (anArea() !== 'influencia' || !BV.status(el, 'pedidos_canal', 'envios_creator', 'inbazz_creators')) return;
  const ls = embLinhas();
  cabecalho(el, [['pos', '#', 'bv-txt'], ['nome', 'Embaixador', 'bv-txt'], ['nivel', 'Nível', 'bv-txt'], ['conquistas', 'Conquistas', 'bv-txt'], ['pedidos', 'Pedidos'], ['vendas', 'Vendas'], ['ticket', 'Ticket médio'], ['comissao', 'Comissão'], ['envios', 'Envios'], ['retorno', 'Retorno'], ['posts', 'Posts']]);
  const tb = nd('tbody');
  if (!ls.length) { const tr = nd('tr'); const td = nd('td', 'bv-txt', 'Ninguém vendeu pelo cupom neste período.'); td.colSpan = 11; tr.append(td); tb.append(tr); }
  ls.forEach((r, i) => {
    const tr = nd('tr', i < 3 ? 'bv-emb-top' : null);
    const pos = nd('td', 'bv-txt'); pos.append(nd('span', 'bv-rank-pos' + (i < 3 ? ' bv-rank-top' : ''), (i + 1) + 'º'));
    const nome = nd('td', 'bv-txt', r.nome); if (r.instagram) nome.append(nd('span', 'bv-cpv-obs', '@' + r.instagram));
    const niv = nd('td', 'bv-txt'); niv.append(pillNivel(r.nivel), nd('span', 'bv-cpv-obs', r.prox ? `faltam ${BV.brl(r.falta)} para ${r.prox.nome}` : 'nível máximo'));
    const conq = nd('td', 'bv-txt'); if (r.conquistas.length) r.conquistas.forEach((c) => conq.append(nd('span', 'bv-emb-conq', c), document.createTextNode(' '))); else conq.textContent = '—';
    tr.append(pos, nome, niv, conq, nd('td', null, BV.int(r.pedidos)), nd('td', null, BV.brl(r.vendas)), nd('td', null, BV.brl(r.ticket)), nd('td', null, BV.brl(r.comissao)),
      nd('td', null, `${BV.int(r.envios)} · ${BV.brl(r.custo_envios)}`), nd('td', null, xfmt(r.retorno)), nd('td', null, BV.int(r.posts)));
    tb.append(tr);
  });
  el.append(tb);
  if (ls.length) {
    const s = (k) => d3.sum(ls, (r) => r[k]); const tf = nd('tfoot'); const fr = nd('tr', 'bv-tot');
    fr.append(nd('td'), nd('td', 'bv-txt', `${ls.length} embaixadores`), nd('td'), nd('td'), nd('td', null, BV.int(s('pedidos'))), nd('td', null, BV.brl(s('vendas'))), nd('td', null, BV.brl(div(s('vendas'), s('pedidos')))),
      nd('td', null, BV.brl(s('comissao'))), nd('td', null, `${BV.int(s('envios'))} · ${BV.brl(s('custo_envios'))}`), nd('td', null, xfmt(div(s('vendas'), s('investimento')))), nd('td'));
    tf.append(fr); el.append(tf);
  }
});

dash.draw('emb-regras', (el) => {
  el.replaceChildren();
  el.append(nd('li', null, 'Entram no ranking os embaixadores com pelo menos um pedido com o próprio cupom no período escolhido no topo da página. Vendas = valor do pedido no Bling.'));
  el.append(nd('li', null, 'Nível pela carreira, somando todas as vendas pelo cupom: ' + NIVEIS.map((n, i) => `${n.nome} ${i ? 'a partir de ' + BV.brl0(n.min) : 'na primeira venda'}`).join(' · ') + '.'));
  el.append(nd('li', null, 'Conquistas do período: Top vendas, Melhor retorno, Mais pedidos, Maior ticket, Estreia (primeira venda da carreira no período) e Em alta (vendeu mais que no período anterior).'));
  el.append(nd('li', null, 'Retorno = vendas ÷ (envios no período, pelo CPV + frete, + comissão). Envios ligados ao embaixador pelo nome ou @ do destinatário no Bling.'));
});
