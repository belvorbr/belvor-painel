
/* ---------- leitura das respostas do Supabase ---------- */
dash.loader('dre', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => ({ ...r, ordem: Number(r.ordem), valor: Number(r.valor) }));
} });
dash.loader('caixa', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  const n = (v) => (v === null || v === undefined ? null : Number(v));
  return JSON.parse(m[1]).map((r) => ({ ...r, id: String(r.id), situacao: n(r.situacao), valor: n(r.valor), valor_baixado: n(r.valor_baixado), valor_em_aberto: n(r.valor_em_aberto) }));
} });
dash.loader('pedidos_mes', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => ({ ...r, pedidos: Number(r.pedidos), faturamento: Number(r.faturamento) }));
} });
dash.loader('marketing_mes', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => {
    const o = { ...r };
    for (const k of Object.keys(o)) if (k !== 'mes' && o[k] !== null) o[k] = Number(o[k]);
    return o;
  });
} });
dash.loader('bonificacoes', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  const num = ['unidades', 'valor_tabela', 'custo_produto', 'custo_envio', 'custo_embalagem', 'investimento'];
  return JSON.parse(m[1]).map((r) => { const o = { ...r, id: String(r.id) }; for (const k of num) o[k] = o[k] === null ? null : Number(o[k]); return o; });
} });
dash.loader('sync', { description: 'Lê o JSON que o Supabase devolve.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]);
} });

dash.loader('canais_mes', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => { const o = { ...r }; for (const k of Object.keys(o)) if (k !== 'mes' && k !== 'perf_fonte' && o[k] !== null) o[k] = Number(o[k]); return o; });
} });
dash.loader('vendas_dia', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => ({ ...r, pedidos: Number(r.pedidos), receita: Number(r.receita) }));
} });

dash.loader('dre_categorias', { description: 'Lê o JSON que o Supabase devolve.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]);
} });

/* ---------- cálculos ---------- */
dash.loader('meta_campanhas_dia', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  const num = ['gasto', 'impressoes', 'cliques', 'compras', 'valor_compras'];
  return JSON.parse(m[1]).map((r) => { const o = { ...r }; for (const k of num) o[k] = Number(o[k] || 0); return o; });
} });
dash.loader('itens_dia', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => ({ ...r, quantidade: Number(r.quantidade), unidades: Number(r.unidades), vendas: Number(r.vendas) }));
} });

dash.calc('pulso', {
  inputs: ['vendas_dia', 'meta_campanhas_dia', 'canais_mes'],
  title: 'Pulso do negócio por período',
  description: 'Para mês atual, últimos 7, 30 e 90 dias (até hoje) e o período anterior de mesmo tamanho: faturamento por canal, pedidos, ticket médio, investimento e receita atribuída do Meta, ROAS, custo por compra e a meta do período (meta mensal dividida pelos dias do mês, somada dia a dia).',
  fn: (vendas, meta, canais) => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    const dia = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    const diasMes = (m) => new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0)).getUTCDate();
    const ini = hoje.slice(0, 8) + '01';
    const dm = new Date(ini + 'T00:00:00Z'); dm.setUTCMonth(dm.getUTCMonth() - 1);
    const iniAnt = dm.toISOString().slice(0, 10);
    const fimAnt = iniAnt.slice(0, 8) + String(Math.min(+hoje.slice(8, 10), diasMes(iniAnt.slice(0, 7)))).padStart(2, '0');
    const per = [
      ['mes', 'Mês atual', ini, hoje, iniAnt, fimAnt],
      ['7d', 'Últimos 7 dias', dia(hoje, -6), hoje, dia(hoje, -13), dia(hoje, -7)],
      ['30d', 'Últimos 30 dias', dia(hoje, -29), hoje, dia(hoje, -59), dia(hoje, -30)],
      ['90d', 'Últimos 90 dias', dia(hoje, -89), hoje, dia(hoje, -179), dia(hoje, -90)],
    ];
    const mesInfo = {};
    for (const c of canais) mesInfo[c.mes] = c;
    const cota = (iso) => { const c = mesInfo[iso.slice(0, 7)]; if (!c || (c.pdv_meta === null && c.site_meta === null)) return null; return ((c.pdv_meta || 0) + (c.site_meta || 0)) / diasMes(iso.slice(0, 7)); };
    const cotaInv = (iso) => { const c = mesInfo[iso.slice(0, 7)]; return c && c.meta_investimento_meta ? c.meta_investimento_meta / diasMes(iso.slice(0, 7)) : null; };
    const soma = (a, b) => {
      const v = vendas.filter((r) => r.data >= a && r.data <= b);
      const mm = meta.filter((r) => r.data >= a && r.data <= b);
      const s = (f, arr, k) => d3.sum(arr.filter(f), (r) => r[k]);
      const o = {
        fat: s(() => true, v, 'receita'), pedidos: s(() => true, v, 'pedidos'),
        pdv: s((r) => r.canal === 'pdv', v, 'receita'), site: s((r) => r.canal === 'site', v, 'receita'), org: s((r) => r.canal === 'vendas_organicas', v, 'receita'),
        invest: d3.sum(mm, (r) => r.gasto), receita_meta: d3.sum(mm, (r) => r.valor_compras), compras: d3.sum(mm, (r) => r.compras),
        impressoes: d3.sum(mm, (r) => r.impressoes), cliques: d3.sum(mm, (r) => r.cliques),
      };
      o.ticket = o.pedidos ? o.fat / o.pedidos : null;
      o.roas = o.invest ? o.receita_meta / o.invest : null;
      o.cpa = o.compras ? o.invest / o.compras : null;
      return o;
    };
    const var_ = (a, b) => (a === null || b === null || !b ? null : a / b - 1);
    const r2 = (x) => (x === null || x === undefined || isNaN(x) ? null : Math.round(x * 100) / 100);
    return per.map(([periodo, nome, a, b, pa, pb]) => {
      const c = soma(a, b), p = soma(pa, pb);
      let metaFat = 0, temMeta = false, metaInv = 0, temInv = false;
      for (let d = a; d <= b; d = dia(d, 1)) { const q = cota(d); if (q !== null) { metaFat += q; temMeta = true; } const qi = cotaInv(d); if (qi !== null) { metaInv += qi; temInv = true; } }
      const out = { periodo, nome, inicio: a, fim: b, inicio_ant: pa, fim_ant: pb };
      for (const k of ['fat', 'pedidos', 'pdv', 'site', 'org', 'invest', 'receita_meta', 'compras', 'impressoes', 'cliques', 'ticket', 'roas', 'cpa']) {
        out[k] = r2(c[k]); out[k + '_ant'] = r2(p[k]); out[k + '_var'] = var_(c[k], p[k]);
      }
      out.influencia = r2(Math.max(0, c.site - c.receita_meta));
      out.meta_fat = temMeta ? r2(metaFat) : null;
      out.pct_meta_fat = temMeta && metaFat ? c.fat / metaFat : null;
      out.meta_invest = temInv ? r2(metaInv) : null;
      out.pct_meta_invest = temInv && metaInv ? c.invest / metaInv : null;
      out.roas_meta = 2;
      out.cpa_meta = c.ticket ? r2(c.ticket / 2) : null;
      return out;
    });
  },
});

dash.calc('serie_dia', {
  inputs: ['vendas_dia', 'meta_campanhas_dia', 'canais_mes'],
  title: 'Série diária (últimos 90 dias)',
  description: 'Por dia, nos últimos 90 dias: faturamento por canal, pedidos, investimento e receita atribuída do Meta, e a cota diária da meta (meta do mês ÷ dias do mês).',
  fn: (vendas, meta, canais) => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    const dia = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    const diasMes = (m) => new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0)).getUTCDate();
    const mesInfo = {}; for (const c of canais) mesInfo[c.mes] = c;
    const out = [];
    for (let d = dia(hoje, -89); d <= hoje; d = dia(d, 1)) {
      const v = vendas.filter((r) => r.data === d), m = meta.filter((r) => r.data === d);
      const c = mesInfo[d.slice(0, 7)];
      const cota = c && (c.pdv_meta !== null || c.site_meta !== null) ? ((c.pdv_meta || 0) + (c.site_meta || 0)) / diasMes(d.slice(0, 7)) : null;
      const sv = (canal) => d3.sum(v.filter((r) => r.canal === canal), (r) => r.receita);
      const pdv = sv('pdv'), site = sv('site'), org = sv('vendas_organicas');
      const gasto = d3.sum(m, (r) => r.gasto), rec = d3.sum(m, (r) => r.valor_compras);
      out.push({
        data: d, pdv: Math.round(pdv * 100) / 100, site: Math.round(site * 100) / 100, org: Math.round(org * 100) / 100,
        total: Math.round((pdv + site + org) * 100) / 100, pedidos: d3.sum(v, (r) => r.pedidos),
        gasto_meta: Math.round(gasto * 100) / 100, receita_meta: Math.round(rec * 100) / 100,
        roas: gasto ? Math.round((rec / gasto) * 100) / 100 : null, cota: cota === null ? null : Math.round(cota * 100) / 100,
      });
    }
    return out;
  },
});

dash.calc('campanhas_periodo', {
  inputs: ['meta_campanhas_dia'],
  title: 'Campanhas do Meta por período',
  description: 'Para mês atual e últimos 7, 30 e 90 dias: investimento, impressões, cliques, CTR, CPC, compras, receita atribuída, ROAS e custo por compra de cada campanha.',
  fn: (meta) => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    const dia = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    const per = [['mes', hoje.slice(0, 8) + '01'], ['7d', dia(hoje, -6)], ['30d', dia(hoje, -29)], ['90d', dia(hoje, -89)]];
    const out = [];
    for (const [periodo, a] of per) {
      const g = d3.rollups(meta.filter((r) => r.data >= a && r.data <= hoje), (rs) => ({
        nome: rs[rs.length - 1].campanha_nome, gasto: d3.sum(rs, (r) => r.gasto), impressoes: d3.sum(rs, (r) => r.impressoes),
        cliques: d3.sum(rs, (r) => r.cliques), compras: d3.sum(rs, (r) => r.compras), receita: d3.sum(rs, (r) => r.valor_compras),
      }), (r) => r.campanha);
      for (const [campanha, o] of g) {
        if (!o.gasto && !o.impressoes) continue;
        out.push({
          periodo, campanha, nome: o.nome, investimento: Math.round(o.gasto * 100) / 100, impressoes: o.impressoes, cliques: o.cliques,
          ctr: o.impressoes ? o.cliques / o.impressoes : null, cpc: o.cliques ? Math.round((o.gasto / o.cliques) * 100) / 100 : null,
          compras: o.compras, receita: Math.round(o.receita * 100) / 100,
          roas: o.gasto ? Math.round((o.receita / o.gasto) * 100) / 100 : null, cpa: o.compras ? Math.round((o.gasto / o.compras) * 100) / 100 : null,
        });
      }
    }
    return out.sort((a, b) => b.investimento - a.investimento);
  },
});

dash.calc('skus_periodo', {
  inputs: ['itens_dia'],
  title: 'Produtos mais vendidos por período',
  description: 'Para mês atual e últimos 7, 30 e 90 dias: unidades vendidas (cookies e brownies), itens e valor vendido de cada produto, e a participação no total de vendas de produtos.',
  fn: (itens) => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    const dia = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    const per = [['mes', hoje.slice(0, 8) + '01'], ['7d', dia(hoje, -6)], ['30d', dia(hoje, -29)], ['90d', dia(hoje, -89)]];
    const out = [];
    for (const [periodo, a] of per) {
      const rs = itens.filter((r) => r.data >= a && r.data <= hoje);
      const total = d3.sum(rs, (r) => r.vendas) || 1;
      const g = d3.rollups(rs, (v) => ({ unidades: d3.sum(v, (r) => r.unidades), itens: d3.sum(v, (r) => r.quantidade), vendas: d3.sum(v, (r) => r.vendas) }), (r) => r.descricao);
      for (const [produto, o] of g) out.push({ periodo, produto, unidades: o.unidades, itens: o.itens, vendas: Math.round(o.vendas * 100) / 100, pct: o.vendas / total });
    }
    return out.sort((a, b) => b.vendas - a.vendas);
  },
});

dash.calc('placar', {
  inputs: ['canais_mes'],
  title: 'Placar de metas por área',
  description: 'Para cada mês e área (PDV, venda orgânica, performance, MKT influência, ecommerce e geral): realizado, meta, % atingido, quanto deveria ter vendido até hoje no ritmo da meta, projeção no ritmo atual, quanto falta, cota por dia, ticket médio e pedidos que faltam. Performance: meta = 2 × o maior entre o pago ao Facebook e o investimento planejado. MKT influência = site − receita do Meta; sem a receita do Meta, aparece somada à performance.',
  fn: (canais) => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    const mesAtual = hoje.slice(0, 7);
    const r2 = (x) => (x === null || x === undefined || isNaN(x) ? null : Math.round(x * 100) / 100);
    const niveis = [[0.25, 'Largada'], [0.5, 'Movimento'], [0.75, 'Ascensão'], [1, 'Reta final'], [1.2, 'Conquista'], [Infinity, 'Soberania']];
    const ultimo = {};
    const tk = (k, rec, ped) => { if (ped > 0) ultimo[k] = rec / ped; return ultimo[k] ?? null; };
    const out = [];
    for (const r of [...canais].sort((a, b) => (a.mes < b.mes ? -1 : 1))) {
      const dias = new Date(Date.UTC(+r.mes.slice(0, 4), +r.mes.slice(5, 7), 0)).getUTCDate();
      const atual = r.mes === mesAtual, passado = r.mes < mesAtual;
      const decorridos = atual ? +hoje.slice(8, 10) : passado ? dias : 0;
      const restantes = atual ? dias - decorridos + 1 : 0;
      const push = (area, nome, realizado, meta, o) => {
        o = o || {};
        const ticket = o.ticket ?? null;
        const pct = meta > 0 && realizado !== null ? realizado / meta : null;
        const esperado = meta !== null ? (meta * decorridos) / dias : null;
        const projecao = realizado === null ? null : atual ? (decorridos > 0 ? (realizado / decorridos) * dias : null) : passado ? realizado : null;
        const falta = meta !== null && realizado !== null ? Math.max(0, meta - realizado) : null;
        const porDia = atual && falta !== null && restantes > 0 ? falta / restantes : null;
        const nv = pct === null ? null : niveis.findIndex(([lim]) => pct < lim);
        out.push({
          mes: r.mes, area, nome, realizado: r2(realizado), meta: r2(meta), pct,
          esperado_hoje: r2(esperado), diferenca_ritmo: realizado !== null && esperado !== null ? r2(realizado - esperado) : null,
          projecao: r2(projecao), pct_projecao: meta > 0 && projecao !== null ? projecao / meta : null,
          falta: r2(falta), por_dia: r2(porDia), ritmo_atual_dia: decorridos > 0 && realizado !== null ? r2(realizado / decorridos) : null,
          pedidos: o.pedidos ?? null, ticket: r2(ticket),
          pedidos_faltam: falta !== null && ticket ? Math.ceil(falta / ticket) : null,
          pedidos_por_dia: porDia !== null && ticket ? Math.round((porDia / ticket) * 10) / 10 : null,
          nivel: nv === null ? null : niveis[nv][1], nivel_ordem: nv,
          dias_mes: dias, dias_passados: decorridos, dias_restantes: restantes,
          investido: o.investido ?? null, roas: o.roas ?? null, roas_meta: o.roas_meta ?? null, combinado: !!o.combinado,
        });
      };
      const org = r.organicas_receita, site = r.site_receita, pdv = r.pdv_receita;
      const tPdv = tk('pdv', pdv, r.pdv_pedidos), tOrg = tk('org', org, r.organicas_pedidos), tSite = tk('site', site, r.site_pedidos);
      const tEco = tk('eco', site + org, r.site_pedidos + r.organicas_pedidos);
      const tTot = tk('tot', pdv + site + org, r.pdv_pedidos + r.site_pedidos + r.organicas_pedidos);
      const roasMeta = r.roas_meta ?? 2;
      const gastoMeta = r.meta_gasto_api ?? r.meta_investido;
      const base = Math.max(r.meta_investimento_meta || 0, r.meta_investido || 0, r.meta_gasto_api || 0);
      const metaPerf = base > 0 ? roasMeta * base : null;
      const perf = r.perf_receita;
      push('pdv', 'PDV', pdv, r.pdv_meta, { pedidos: r.pdv_pedidos, ticket: tPdv });
      push('organica', 'Venda orgânica', org, null, { pedidos: r.organicas_pedidos, ticket: tOrg });
      push('performance', 'Performance', perf, metaPerf, { ticket: tSite, investido: gastoMeta, roas_meta: roasMeta, roas: perf !== null && gastoMeta > 0 ? r2(perf / gastoMeta) : null });
      if (perf !== null) {
        push('influencia', 'MKT influência', Math.max(0, site - perf), r.site_meta !== null ? Math.max(0, r.site_meta - (metaPerf || 0) - org) : null, { ticket: tSite });
      } else {
        push('influencia', 'MKT influência + performance', site, r.site_meta !== null ? Math.max(0, r.site_meta - org) : null, { pedidos: r.site_pedidos, ticket: tSite, combinado: true });
      }
      push('ecommerce', 'Ecommerce', site + org, r.site_meta, { pedidos: r.site_pedidos + r.organicas_pedidos, ticket: tEco });
      const metaTot = r.pdv_meta === null && r.site_meta === null ? null : (r.pdv_meta || 0) + (r.site_meta || 0);
      push('total', 'Meta geral', pdv + site + org, metaTot, { pedidos: r.pdv_pedidos + r.site_pedidos + r.organicas_pedidos, ticket: tTot });
    }
    return out;
  },
});

dash.calc('dre_tabela', {
  inputs: ['dre'],
  title: 'DRE mês a mês, com subtotais',
  description: 'Soma as linhas da DRE por mês e calcula receita líquida, lucro bruto, margem de contribuição, resultado operacional, lucro líquido e margem líquida.',
  fn: (dre) => {
    const meses = [...new Set(dre.map((r) => r.mes))].sort();
    const v = {};
    for (const r of dre) { v[r.linha] = v[r.linha] || {}; v[r.linha][r.mes] = (v[r.linha][r.mes] || 0) + r.valor; }
    const linhas = [
      ['receita_bruta', 'Receita bruta (pedidos)', 'linha'],
      ['das', '(−) Simples Nacional (DAS)', 'linha'],
      ['deducoes', '(−) Devoluções e descontos', 'linha'],
      ['receita_liquida', 'Receita líquida', 'sub', ['receita_bruta', 'das', 'deducoes']],
      ['cmv', '(−) CMV (unidades vendidas × custo por unidade)', 'linha'],
      ['lucro_bruto', 'Lucro bruto', 'sub', ['receita_bruta', 'das', 'deducoes', 'cmv']],
      ['variaveis', '(−) Despesas variáveis de venda', 'linha'],
      ['margem_contribuicao', 'Margem de contribuição', 'sub', ['receita_bruta', 'das', 'deducoes', 'cmv', 'variaveis']],
      ['marketing', '(−) Marketing (Meta Ads, conteúdo, influência…)', 'linha'],
      ['bonificacoes', '(−) Marketing: bonificações enviadas', 'linha'],
      ['comerciais', '(−) Comerciais e logística fixa', 'linha'],
      ['administrativas', '(−) Administrativas', 'linha'],
      ['pessoal', '(−) Pessoal e pró-labore', 'linha'],
      ['sem_categoria', '(−) Sem categoria no Bling', 'linha'],
      ['resultado_operacional', 'Resultado operacional', 'sub', ['receita_bruta', 'das', 'deducoes', 'cmv', 'variaveis', 'marketing', 'bonificacoes', 'comerciais', 'administrativas', 'pessoal', 'sem_categoria']],
      ['financeiro', '(±) Resultado financeiro', 'linha'],
      ['impostos_lucro', '(−) IR e CSLL (no Simples, já inclusos no DAS)', 'linha'],
      ['lucro_liquido', 'Lucro líquido', 'tot', ['receita_bruta', 'das', 'deducoes', 'cmv', 'variaveis', 'marketing', 'bonificacoes', 'comerciais', 'administrativas', 'pessoal', 'sem_categoria', 'financeiro', 'impostos_lucro']],
    ];
    const rows = linhas.map(([codigo, nome, tipo, soma], ordem) => {
      const row = { codigo, nome, tipo, ordem };
      let total = 0;
      for (const m of meses) {
        const x = (soma || [codigo]).reduce((s, c) => s + ((v[c] && v[c][m]) || 0), 0);
        row[m] = Math.round(x * 100) / 100;
        total += x;
      }
      row.total = Math.round(total * 100) / 100;
      return row;
    });
    const rec = rows.find((r) => r.codigo === 'receita_bruta');
    const luc = rows.find((r) => r.codigo === 'lucro_liquido');
    const pct = { codigo: 'margem_liquida', nome: 'Margem líquida (% da receita bruta)', tipo: 'pct', ordem: rows.length };
    for (const m of [...meses, 'total']) pct[m] = rec[m] > 0 ? luc[m] / rec[m] : null;
    rows.push(pct);
    // Memória (fora do resultado): compras de produção x produto consumido = estoque estimado
    const g = (c, m) => (v[c] && v[c][m]) || 0;
    const compras = { codigo: 'memo_compras', nome: 'Memória: compras de produção (vão para estoque)', tipo: 'memo', ordem: rows.length };
    const consumo = { codigo: 'memo_consumo', nome: 'Memória: produto consumido (vendas + bonificações) ao custo por unidade', tipo: 'memo', ordem: rows.length + 1 };
    const estoque = { codigo: 'memo_estoque', nome: 'Memória: estoque estimado acumulado (compras − consumo)', tipo: 'memo', ordem: rows.length + 2 };
    let acc = 0, tc = 0, tu = 0;
    for (const m of meses) {
      const c = -g('compras_producao', m), u = -g('cmv', m) + g('bonif_produto', m);
      compras[m] = Math.round(c * 100) / 100; consumo[m] = Math.round(u * 100) / 100;
      acc += c - u; estoque[m] = Math.round(acc * 100) / 100; tc += c; tu += u;
    }
    compras.total = Math.round(tc * 100) / 100; consumo.total = Math.round(tu * 100) / 100; estoque.total = Math.round(acc * 100) / 100;
    rows.push(compras, consumo, estoque);
    return rows;
  },
});

dash.loader('dre_caixa', { description: 'Lê o JSON que o Supabase devolve e converte os valores para número.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => ({ ...r, valor: Number(r.valor) }));
} });

dash.calc('dre_tabela_caixa', {
  inputs: ['dre_caixa'],
  title: 'DRE de caixa mês a mês',
  description: 'Entradas de venda pela data do recebimento (venda a prazo) ou do pedido (Shopify, PDV, à vista) e saídas pela data real do pagamento, por linha da DRE, com subtotais. Aportes, empréstimos e distribuições ficam abaixo, fora do resultado.',
  fn: (caixa) => {
    const meses = [...new Set(caixa.map((r) => r.mes))].sort();
    const v = {};
    for (const r of caixa) { v[r.linha] = v[r.linha] || {}; v[r.linha][r.mes] = (v[r.linha][r.mes] || 0) + r.valor; }
    const op = ['receita_caixa', 'das', 'deducoes', 'compras_producao', 'variaveis', 'marketing', 'comerciais', 'administrativas', 'pessoal', 'sem_categoria'];
    const linhas = [
      ['receita_caixa', 'Receita recebida', 'linha'],
      ['das', '(−) Simples Nacional (DAS) pago', 'linha'],
      ['deducoes', '(−) Devoluções e descontos', 'linha'],
      ['receita_liquida_caixa', 'Receita líquida recebida', 'sub', ['receita_caixa', 'das', 'deducoes']],
      ['compras_producao', '(−) Compras de produção pagas', 'linha'],
      ['resultado_bruto_caixa', 'Resultado bruto de caixa', 'sub', ['receita_caixa', 'das', 'deducoes', 'compras_producao']],
      ['variaveis', '(−) Despesas variáveis de venda', 'linha'],
      ['margem_caixa', 'Margem de contribuição de caixa', 'sub', ['receita_caixa', 'das', 'deducoes', 'compras_producao', 'variaveis']],
      ['marketing', '(−) Marketing', 'linha'],
      ['comerciais', '(−) Comerciais e logística fixa', 'linha'],
      ['administrativas', '(−) Administrativas', 'linha'],
      ['pessoal', '(−) Pessoal e pró-labore', 'linha'],
      ['sem_categoria', '(−) Sem categoria no Bling', 'linha'],
      ['resultado_operacional_caixa', 'Resultado operacional de caixa', 'sub', op],
      ['financeiro', '(±) Resultado financeiro', 'linha'],
      ['impostos_lucro', '(−) IR e CSLL (no Simples, já inclusos no DAS)', 'linha'],
      ['geracao_caixa', 'Geração de caixa do negócio', 'tot', [...op, 'financeiro', 'impostos_lucro']],
      ['fora_entradas', 'Fora do resultado: aportes e empréstimos recebidos', 'memo'],
      ['fora_saidas', 'Fora do resultado: distribuições e transferências pagas', 'memo'],
      ['variacao_caixa', 'Variação de caixa no mês (geração + fora do resultado)', 'memo', [...op, 'financeiro', 'impostos_lucro', 'fora_entradas', 'fora_saidas']],
    ];
    return linhas.map(([codigo, nome, tipo, soma], ordem) => {
      const row = { codigo, nome, tipo, ordem }; let total = 0;
      for (const m of meses) { const x = (soma || [codigo]).reduce((s, c) => s + ((v[c] && v[c][m]) || 0), 0); row[m] = Math.round(x * 100) / 100; total += x; }
      row.total = Math.round(total * 100) / 100;
      return row;
    });
  },
});

dash.loader('cpv_lotes', { description: 'Lê o JSON que o Supabase devolve e converte números que vêm como texto.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => {
    const o = {};
    for (const [k, v] of Object.entries(r)) o[k] = typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v) && k !== 'mes' && k !== 'codigo' ? Number(v) : v;
    return o;
  });
} });
const lerSupabase = ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => {
    const o = {};
    for (const [k, v] of Object.entries(r)) o[k] = typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v;
    return o;
  });
};
for (const id of ['cpv_sku', 'cpv_receita', 'cpv_conc', 'inbazz_mes', 'inbazz_creators', 'canais_dia', 'pedidos_canal', 'meta_plataforma', 'envios_creator', 'ranking_creators']) dash.loader(id, { description: 'Lê o JSON que o Supabase devolve e converte números que vêm como texto.', fn: lerSupabase });
dash.loader('cpv_comp', { description: 'Lê o JSON que o Supabase devolve e converte números que vêm como texto.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => {
    const o = {};
    for (const [k, v] of Object.entries(r)) o[k] = typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v) && k !== 'mes' && k !== 'codigo' ? Number(v) : v;
    return o;
  });
} });
dash.loader('cpv_canal', { description: 'Lê o JSON que o Supabase devolve e converte números que vêm como texto.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => {
    const o = {};
    for (const [k, v] of Object.entries(r)) o[k] = typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v) && k !== 'mes' && k !== 'codigo' ? Number(v) : v;
    return o;
  });
} });
dash.loader('frete_entrega', { description: 'Lê o JSON que o Supabase devolve e converte números que vêm como texto.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => {
    const o = {};
    for (const [k, v] of Object.entries(r)) o[k] = typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v) && k !== 'mes' && k !== 'codigo' ? Number(v) : v;
    return o;
  });
} });
dash.loader('lotes_prod', { description: 'Lê o JSON que o Supabase devolve e converte números que vêm como texto.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => {
    const o = {};
    for (const [k, v] of Object.entries(r)) o[k] = typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v) && k !== 'mes' && k !== 'codigo' ? Number(v) : v;
    return o;
  });
} });
dash.loader('parametros', { description: 'Lê o JSON que o Supabase devolve e converte números que vêm como texto.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => {
    const o = {};
    for (const [k, v] of Object.entries(r)) o[k] = typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v) && k !== 'mes' && k !== 'codigo' ? Number(v) : v;
    return o;
  });
} });

dash.loader('cpv_formato', { description: 'Lê o JSON que o Supabase devolve e converte números que vêm como texto.', fn: ({ answer }) => {
  const t = typeof answer === 'string' ? answer : (answer && answer.result);
  if (Array.isArray(answer)) return answer;
  const m = typeof t === 'string' && t.match(/<untrusted-data-[\w-]*>\s*(\[[\s\S]*\])\s*<\/untrusted-data-/);
  if (!m) throw new Error(typeof t === 'string' ? t.slice(0, 400) : 'Resposta inesperada do Supabase');
  return JSON.parse(m[1]).map((r) => ({ ...r, cpv_unitario: Number(r.cpv_unitario), embalagem_canal: Number(r.embalagem_canal) }));
} });

dash.calc('cpv_resumo', {
  inputs: ['cpv_lotes'],
  title: 'CPV por lote e médio',
  description: 'Para cada lote e para a média dos lotes (ponderada pelas unidades): custo total, custo por unidade e o custo por unidade de cada grupo (insumos, industrialização, embalagem primária, frete de insumos, formas).',
  fn: (linhas) => {
    const grupos = ['insumos', 'industrializacao', 'embalagem_primaria', 'frete_insumos', 'ferramental'];
    const lotes = [...new Set(linhas.map((r) => r.lote))].sort((a, b) => a - b);
    const out = [];
    let totU = 0; const totG = {};
    for (const l of lotes) {
      const rs = linhas.filter((r) => r.lote === l);
      const u = rs[0].unidades; totU += u;
      const row = { lote: String(l), nome: 'Lote ' + l, data: rs[0].data, unidades: u, total: 0 };
      for (const g of grupos) { const v = d3.sum(rs.filter((r) => r.grupo === g), (r) => r.valor); row[g] = Math.round((v / u) * 10000) / 10000; row.total += v; totG[g] = (totG[g] || 0) + v; }
      row.unitario = Math.round((row.total / u) * 10000) / 10000; row.total = Math.round(row.total * 100) / 100;
      out.push(row);
    }
    if (lotes.length) {
      const med = { lote: 'medio', nome: 'Média dos lotes', data: null, unidades: totU, total: 0 };
      for (const g of grupos) { med[g] = Math.round(((totG[g] || 0) / totU) * 10000) / 10000; med.total += totG[g] || 0; }
      med.unitario = Math.round((med.total / totU) * 10000) / 10000; med.total = Math.round(med.total * 100) / 100;
      out.push(med);
    }
    return out;
  },
});

dash.calc('cpv_formatos', {
  inputs: ['cpv_resumo', 'cpv_canal', 'frete_entrega'],
  title: 'Custo do produto entregue por formato',
  description: 'Unidade avulsa, caixa de 12 do e-commerce e display de 12 do PDV: produto (CPV de fábrica × unidades) e embalagem de canal (valor ÷ quantidade comprada). O frete de entrega ao cliente (Mandaê) não entra: é despesa de venda, e parte é paga pelo próprio cliente.',
  fn: (resumo, canal, frete) => {
    const med = resumo.find((r) => r.lote === 'medio'); if (!med) return [];
    const u = med.unitario;
    const emb = (txt) => { const c = canal.find((x) => (x.item || '').toLowerCase().includes(txt)); return c ? c.custo_por_embalagem : null; };
    const caixaEcom = emb('e-commerce'), display = emb('displays'), master = emb('master');
    const ult = frete.filter((f) => f.frete_por_pedido !== null).sort((a, b) => (a.mes < b.mes ? 1 : -1))[0];
    const fr = ult ? ult.frete_por_pedido : null;
    const r2 = (x) => (x === null ? null : Math.round(x * 100) / 100);
    const linha = (formato, nome, unidades, embalagem, entrega, nota) => ({
      formato, nome, unidades, produto: r2(u * unidades), embalagem: r2(embalagem), entrega: r2(entrega),
      total: embalagem === null && formato !== 'avulsa' ? null : r2(u * unidades + (embalagem || 0) + (entrega || 0)), nota,
    });
    return [
      linha('avulsa', 'Unidade 45 g (saindo da fábrica)', 1, 0, 0, null),
      linha('ecommerce', 'Caixa de 12 · e-commerce', 12, caixaEcom, 0, null),
      linha('pdv', 'Display de 12 · PDV', 12, display === null ? null : display + (master === null ? 0 : master / 4), 0, master === null ? 'sem a caixa master' : null),
    ];
  },
});

dash.calc('dre_mensal', {
  inputs: ['dre'],
  title: 'Receita, despesas e resultado por mês',
  description: 'Por mês de competência: receita bruta dos pedidos, soma de custos e despesas, e o resultado (receita − despesas).',
  fn: (dre) => {
    const memoria = ['compras_producao', 'bonif_produto'];
    const por = d3.rollups(dre.filter((r) => !memoria.includes(r.linha)), (rs) => {
      const receita = d3.sum(rs, (r) => (r.linha === 'receita_bruta' ? r.valor : 0));
      const resultado = d3.sum(rs, (r) => r.valor);
      return { receita, despesas: receita - resultado, resultado };
    }, (r) => r.mes);
    return por.map(([mes, o]) => ({ mes, receita: Math.round(o.receita * 100) / 100, despesas: Math.round(o.despesas * 100) / 100, resultado: Math.round(o.resultado * 100) / 100 }))
      .sort((a, b) => d3.ascending(a.mes, b.mes));
  },
});

dash.calc('janelas', {
  inputs: ['caixa'],
  title: 'Em aberto por prazo',
  description: 'Contas em aberto (saldo a pagar ou a receber) somadas por prazo de vencimento, contado a partir de hoje no horário de Brasília.',
  fn: (caixa) => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    const mais = (dias) => { const d = new Date(hoje + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + dias); return d.toISOString().slice(0, 10); };
    const abertos = caixa.filter((r) => r.valor_em_aberto > 0 && r.vencimento);
    const faixa = (janela, nome, ok) => {
      const rs = abertos.filter((r) => ok(r.vencimento));
      const entradas = d3.sum(rs, (r) => (r.tipo === 'receber' ? r.valor_em_aberto : 0));
      const saidas = d3.sum(rs, (r) => (r.tipo === 'pagar' ? r.valor_em_aberto : 0));
      return { janela, nome, entradas: Math.round(entradas * 100) / 100, saidas: Math.round(saidas * 100) / 100, saldo: Math.round((entradas - saidas) * 100) / 100,
        n_receber: rs.filter((r) => r.tipo === 'receber').length, n_pagar: rs.filter((r) => r.tipo === 'pagar').length };
    };
    return [
      faixa('atraso', 'Em atraso', (v) => v < hoje),
      faixa('d7', 'Hoje até 7 dias', (v) => v >= hoje && v <= mais(7)),
      faixa('d30', 'Hoje até 30 dias', (v) => v >= hoje && v <= mais(30)),
      faixa('d60', 'Hoje até 60 dias', (v) => v >= hoje && v <= mais(60)),
      faixa('d90', 'Hoje até 90 dias', (v) => v >= hoje && v <= mais(90)),
      faixa('futuro', 'Tudo a vencer', (v) => v >= hoje),
    ];
  },
});

dash.calc('previsao_diaria', {
  inputs: ['caixa'],
  title: 'Previsão dia a dia (90 dias)',
  description: 'Para cada dia de hoje até 90 dias: saldo a receber e a pagar que vence no dia, e o acumulado (começando em zero).',
  fn: (caixa) => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    const dias = [];
    for (let i = 0; i <= 90; i++) { const d = new Date(hoje + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + i); dias.push(d.toISOString().slice(0, 10)); }
    const fim = dias[dias.length - 1];
    const ab = caixa.filter((r) => r.valor_em_aberto > 0 && r.vencimento >= hoje && r.vencimento <= fim);
    let acc = 0;
    return dias.map((data) => {
      const rs = ab.filter((r) => r.vencimento === data);
      const entradas = d3.sum(rs, (r) => (r.tipo === 'receber' ? r.valor_em_aberto : 0));
      const saidas = d3.sum(rs, (r) => (r.tipo === 'pagar' ? r.valor_em_aberto : 0));
      acc += entradas - saidas;
      return { data, entradas: Math.round(entradas * 100) / 100, saidas: Math.round(saidas * 100) / 100, liquido: Math.round((entradas - saidas) * 100) / 100, acumulado: Math.round(acc * 100) / 100, lancamentos: rs.length };
    });
  },
});

dash.calc('realizado_periodos', {
  inputs: ['caixa'],
  title: 'Pago e recebido por período',
  description: 'Valores baixados no Bling (data real do borderô) por período: entradas, das quais aportes e empréstimos de sócios, saídas e saldo.',
  fn: (caixa) => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    const mesAtual = hoje.slice(0, 7);
    const d = new Date(hoje.slice(0, 7) + '-01T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() - 1);
    const mesAnt = d.toISOString().slice(0, 7);
    const d90 = new Date(hoje + 'T00:00:00Z'); d90.setUTCDate(d90.getUTCDate() - 89);
    const ini90 = d90.toISOString().slice(0, 10);
    const periodos = [
      ['mes_atual', 'Mês atual', (x) => x.slice(0, 7) === mesAtual],
      ['mes_anterior', 'Mês anterior', (x) => x.slice(0, 7) === mesAnt],
      ['ult_90', 'Últimos 90 dias', (x) => x >= ini90 && x <= hoje],
      ['ano', 'Ano atual', (x) => x.slice(0, 4) === hoje.slice(0, 4)],
      ['tudo', 'Tudo', () => true],
    ];
    const socios = ['Aporte de Capital', 'Empréstimo de sócios'];
    const pagos = caixa.filter((r) => r.data_baixa && r.valor_baixado > 0);
    return periodos.map(([periodo, nome, ok]) => {
      const rs = pagos.filter((r) => ok(r.data_baixa));
      const entradas = d3.sum(rs, (r) => (r.tipo === 'receber' ? r.valor_baixado : 0));
      const aportes = d3.sum(rs, (r) => (r.tipo === 'receber' && socios.includes(r.categoria) ? r.valor_baixado : 0));
      const saidas = d3.sum(rs, (r) => (r.tipo === 'pagar' ? r.valor_baixado : 0));
      return { periodo, nome, entradas: Math.round(entradas * 100) / 100, aportes_socios: Math.round(aportes * 100) / 100,
        entradas_operacionais: Math.round((entradas - aportes) * 100) / 100, saidas: Math.round(saidas * 100) / 100, saldo: Math.round((entradas - saidas) * 100) / 100 };
    });
  },
});

dash.calc('saidas_categoria', {
  inputs: ['caixa'],
  title: 'Saídas pagas por categoria',
  description: 'Contas a pagar já pagas (data real da baixa), somadas por categoria do Bling em cada período.',
  fn: (caixa) => {
    const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    const mesAtual = hoje.slice(0, 7);
    const d = new Date(hoje.slice(0, 7) + '-01T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() - 1);
    const mesAnt = d.toISOString().slice(0, 7);
    const d90 = new Date(hoje + 'T00:00:00Z'); d90.setUTCDate(d90.getUTCDate() - 89);
    const ini90 = d90.toISOString().slice(0, 10);
    const periodos = [
      ['mes_atual', (x) => x.slice(0, 7) === mesAtual],
      ['mes_anterior', (x) => x.slice(0, 7) === mesAnt],
      ['ult_90', (x) => x >= ini90 && x <= hoje],
      ['ano', (x) => x.slice(0, 4) === hoje.slice(0, 4)],
      ['tudo', () => true],
    ];
    const pagos = caixa.filter((r) => r.tipo === 'pagar' && r.data_baixa && r.valor_baixado > 0);
    const out = [];
    for (const [periodo, ok] of periodos) {
      const g = d3.rollups(pagos.filter((r) => ok(r.data_baixa)), (rs) => ({ valor: d3.sum(rs, (r) => r.valor_baixado), n: rs.length, linha: rs[0].linha_dre }), (r) => r.categoria || 'Sem categoria');
      for (const [categoria, o] of g) out.push({ periodo, categoria, linha_dre: o.linha, valor: Math.round(o.valor * 100) / 100, lancamentos: o.n });
    }
    return out.sort((a, b) => d3.descending(a.valor, b.valor));
  },
});

dash.calc('setores_mes', {
  inputs: ['pedidos_mes'],
  title: 'Setores por mês',
  description: 'Faturamento e pedidos de venda de PDV e Ecommerce (com o detalhe por loja) e ticket médio. Bonificações da loja Marketing não entram.',
  fn: (pedidos) => {
    const meses = [...new Set(pedidos.map((r) => r.mes))].sort();
    return meses.map((mes) => {
      const p = pedidos.filter((r) => r.mes === mes);
      const s = (f) => Math.round(d3.sum(p.filter(f), (r) => r.faturamento) * 100) / 100;
      const n = (f) => d3.sum(p.filter(f), (r) => r.pedidos);
      const total_fat = s(() => true), total_ped = n(() => true);
      return {
        mes,
        pdv_fat: s((r) => r.setor === 'PDV'), pdv_ped: n((r) => r.setor === 'PDV'),
        ecom_fat: s((r) => r.setor === 'Ecommerce'), ecom_ped: n((r) => r.setor === 'Ecommerce'),
        shopify_fat: s((r) => r.loja === 'Shopify'), organicas_fat: s((r) => r.loja === 'Vendas orgânicas'), semloja_fat: s((r) => r.loja === 'Sem loja'),
        total_fat, total_ped, ticket: total_ped ? Math.round((total_fat / total_ped) * 100) / 100 : null,
      };
    });
  },
});

dash.calc('marketing_resumo', {
  inputs: ['marketing_mes', 'setores_mes'],
  title: 'Marketing por mês, com indicadores',
  description: 'Investimento em marketing por mês com custo médio por envio a influenciador (envios de até 24 unidades; acima disso é ação de volume, como evento ou parceiro), retorno do Meta Ads (resultado informado ÷ investimento) e peso do marketing sobre o faturamento de vendas.',
  fn: (marketing, setores) => marketing.map((r) => {
    const fat = (setores.find((s) => s.mes === r.mes) || {}).total_fat || 0;
    return {
      ...r,
      custo_por_envio: r.envios_influ ? Math.round((r.custo_influ / r.envios_influ) * 100) / 100 : null,
      custo_por_envio_todos: r.envios ? Math.round((r.bonificacoes / r.envios) * 100) / 100 : null,
      roas_meta: r.meta_ads > 0 && r.resultado_performance !== null ? Math.round((r.resultado_performance / r.meta_ads) * 100) / 100 : null,
      faturamento_vendas: fat,
      pct_faturamento: fat > 0 ? r.investimento_total / fat : null,
    };
  }),
});

/* ---------- formatos e utilidades (compartilhados) ---------- */
(() => {
  const loc = d3.formatLocale({ decimal: ',', thousands: '.', grouping: [3], currency: ['R$ ', ''] });
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const MESL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const brl = loc.format('$,.2f'), brl0 = loc.format('$,.0f'), int = loc.format(',d'), pct = loc.format('.1%'), dec = loc.format(',.2f');
  const hoje = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  const BV = window.BV = {
    cores: ['#1099D6', '#F4831F', '#8DB52A', '#D8238E', '#602D8F', '#E61E25', '#ED3867'],
    brl: (v) => (v === null || v === undefined || isNaN(v) ? '—' : brl(v)),
    brl0: (v) => (v === null || v === undefined || isNaN(v) ? '—' : brl0(v)),
    curto: (v) => { if (v === null || isNaN(v)) return '—'; const a = Math.abs(v); return a >= 1e6 ? 'R$ ' + loc.format(',.1f')(v / 1e6) + ' mi' : a >= 1e3 ? 'R$ ' + loc.format(',.1f')(v / 1e3) + ' mil' : brl0(v); },
    int: (v) => (v === null || isNaN(v) ? '—' : int(v)),
    pct: (v) => (v === null || v === undefined || isNaN(v) ? '—' : pct(v)),
    dec: (v) => (v === null || v === undefined || isNaN(v) ? '—' : dec(v)),
    hoje,
    mesAtual: () => hoje().slice(0, 7),
    mesAnterior: (m) => { const d = new Date((m || hoje().slice(0, 7)) + '-01T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() - 1); return d.toISOString().slice(0, 7); },
    mesCurto: (m) => MES[+m.slice(5, 7) - 1] + '/' + m.slice(2, 4),
    mesLongo: (m) => MESL[+m.slice(5, 7) - 1] + ' de ' + m.slice(0, 4),
    data: (iso) => (iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4) : '—'),
    dataCurta: (iso) => (iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) : '—'),
    status(el, ...ids) {
      const st = ids.map((id) => dash.data(id).status);
      if (st.every((s) => s === 'ok')) return true;
      if (st.some((s) => s === 'loading' || s === 'connect')) return false;
      if (st.some((s) => s === 'error' || s === 'declined' || s === 'missing')) el.classList.remove('dash-skeleton');
      return false;
    },
    fail(el) { const p = document.createElement('div'); p.className = 'bv-fail'; p.textContent = 'Não foi possível carregar.'; el.replaceChildren(p); },
    sinal(el, v) { el.classList.toggle('bv-neg', v < 0); el.classList.toggle('bv-pos', v > 0); },
    mark(el, source, field, where) { el.dataset.source = source; el.dataset.field = field; if (where) el.dataset.where = where; else delete el.dataset.where; },
    valor(el, source, field, where, text, signo) {
      el.classList.remove('dash-skeleton');
      BV.mark(el, source, field, where);
      el.textContent = text;
    },
    /* Gráfico de barras para cima (positivo) e para baixo (negativo), com linha opcional. */
    chart(el, o) {
      const width = Math.max(280, el.clientWidth || 600);
      const height = o.height || 260;
      el.replaceChildren();
      if (!o.data.length) { const p = document.createElement('div'); p.className = 'bv-fail'; p.textContent = o.vazio || 'Nada no período.'; el.append(p); return; }
      const svg = d3.select(el).append('svg').attr('width', width).attr('height', height).attr('role', 'img').attr('aria-label', o.label);
      const tip = d3.select(el).append('div').attr('class', 'bv-tip').style('display', 'none');
      const keys = o.data.map((d) => d[o.x]);
      const vals = [];
      for (const d of o.data) { for (const s of o.series) vals.push(s.sign * (d[s.key] || 0)); if (o.line) vals.push(d[o.line.key] || 0); }
      const y = d3.scaleLinear().domain([Math.min(0, d3.min(vals)), Math.max(0, d3.max(vals))]).nice();
      const m = { t: 10, r: 10, b: 26, l: 40 };
      const gy = svg.append('g');
      y.range([height - m.b, m.t]);
      gy.call(d3.axisLeft(y).ticks(5).tickFormat((v) => (o.yfmt || BV.curto)(v)).tickSize(0)).call((g) => g.select('.domain').remove());
      let wl = 0; gy.selectAll('text').each(function () { wl = Math.max(wl, this.getComputedTextLength ? this.getComputedTextLength() : 0); });
      m.l = Math.ceil(wl) + 10;
      gy.attr('transform', `translate(${m.l},0)`);
      gy.selectAll('.tick line').remove();
      svg.insert('g', ':first-child').selectAll('line').data(y.ticks(5)).join('line')
        .attr('x1', m.l).attr('x2', width - m.r).attr('y1', (v) => y(v)).attr('y2', (v) => y(v))
        .style('stroke', (v) => (v === 0 ? 'var(--cds-chart-axis)' : 'var(--cds-chart-grid)'));
      const x = d3.scaleBand().domain(keys).range([m.l, width - m.r]).padding(keys.length > 40 ? 0.15 : 0.25);
      const every = Math.max(1, Math.ceil(keys.length / Math.max(2, Math.floor((width - m.l) / 64))));
      svg.append('g').attr('transform', `translate(0,${height - m.b})`)
        .call(d3.axisBottom(x).tickValues(keys.filter((k, i) => i % every === 0)).tickFormat(o.xfmt).tickSize(0).tickPadding(8))
        .call((g) => g.select('.domain').remove());
      for (const s of o.series) {
        svg.append('g').selectAll('rect').data(o.data).join('rect')
          .attr('x', (d) => x(d[o.x])).attr('width', x.bandwidth())
          .attr('y', (d) => Math.min(y(0), y(s.sign * (d[s.key] || 0))))
          .attr('height', (d) => Math.abs(y(0) - y(s.sign * (d[s.key] || 0))))
          .attr('rx', Math.min(2, x.bandwidth() / 4))
          .style('fill', s.color).style('opacity', (d) => (o.dim && o.dim(d) ? 0.4 : 1));
      }
      if (o.line) {
        const line = d3.line().x((d) => x(d[o.x]) + x.bandwidth() / 2).y((d) => y(d[o.line.key] || 0));
        svg.append('path').datum(o.data).attr('d', line).style('fill', 'none').style('stroke', 'var(--color-fg)').style('stroke-width', 1.5);
        if (o.data.length <= 40) svg.append('g').selectAll('circle').data(o.data).join('circle')
          .attr('cx', (d) => x(d[o.x]) + x.bandwidth() / 2).attr('cy', (d) => y(d[o.line.key] || 0)).attr('r', 3)
          .style('fill', 'var(--color-bg)').style('stroke', 'var(--color-fg)').style('stroke-width', 1.5);
        const last = o.data[o.data.length - 1];
        svg.append('text').attr('x', Math.min(width - m.r, x(last[o.x]) + x.bandwidth() / 2)).attr('y', y(last[o.line.key] || 0) - 8)
          .attr('text-anchor', 'end').style('fill', 'var(--color-fg)').style('font-size', 'var(--cds-font-size-caption)').style('font-variant-numeric', 'tabular-nums')
          .text((o.yfmt || BV.curto)(last[o.line.key] || 0));
      }
      const hl = svg.append('rect').style('fill', 'var(--color-fg)').style('opacity', 0).attr('pointer-events', 'none');
      svg.append('g').selectAll('rect').data(o.data).join('rect')
        .attr('x', (d) => x(d[o.x]) - (x.step() * x.paddingInner()) / 2).attr('width', x.step()).attr('y', m.t).attr('height', height - m.t - m.b)
        .style('fill', 'transparent')
        .on('pointerenter pointermove', (ev, d) => {
          hl.attr('x', x(d[o.x]) - (x.step() * x.paddingInner()) / 2).attr('width', x.step()).attr('y', m.t).attr('height', height - m.t - m.b).style('opacity', 0.06);
          tip.style('display', null).replaceChildren();
          const t = tip.node();
          const h = document.createElement('b'); h.textContent = o.tipTitle(d); t.append(h);
          for (const r of o.tipRows(d)) {
            const row = document.createElement('div'); row.className = 'bv-tip-row';
            const a = document.createElement('span'); a.textContent = r[0];
            const b = document.createElement('span'); b.textContent = r[1];
            row.append(a, b); t.append(row);
          }
          const [px, py] = d3.pointer(ev, el);
          const tw = t.offsetWidth, th = t.offsetHeight;
          t.style.left = Math.max(0, Math.min(el.clientWidth - tw, px + 12)) + 'px';
          t.style.top = Math.max(0, Math.min(height - th, py - th - 8)) + 'px';
        })
        .on('pointerleave', () => { tip.style('display', 'none'); hl.style('opacity', 0); });
    },
  };
})();
