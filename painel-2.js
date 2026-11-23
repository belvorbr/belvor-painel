
/* ---------- abas e controles (só escutam e ajustam valores) ---------- */
(() => {


  document.querySelectorAll('.bv-sw[data-c]').forEach((s) => { s.style.background = BV.cores[+s.dataset.c % BV.cores.length]; });

  const sincronizar = () => {
    const p = dash.params();
    document.querySelectorAll('[data-param]').forEach((el) => {
      if (document.activeElement === el) return;
      const v = p[el.dataset.param];
      el.value = v === undefined || v === null ? (el.type === 'number' ? '' : el.value) : String(v);
    });
  };
  document.querySelectorAll('select[data-param]').forEach((el) => el.addEventListener('change', () => dash.setParams({ [el.dataset.param]: el.value })));
  document.querySelectorAll('input[data-param]').forEach((el) => {
    el.addEventListener('change', () => { const n = Number(el.value); dash.setParams({ [el.dataset.param]: isFinite(n) ? Math.round(n * 100) / 100 : 0 }); });
  });
  sincronizar();
  dash.onData(sincronizar);
})();
