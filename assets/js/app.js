
(function () {
  'use strict';

  const folha     = document.getElementById('folha');
  const palco     = document.getElementById('palco');
  const contador  = document.getElementById('contador');
  const rotuloPag = document.getElementById('rotulo-pagina');
  const barraProg = document.getElementById('progresso-barra');
  const btnAnt    = document.getElementById('nav-ant');
  const btnProx   = document.getElementById('nav-prox');
  const btnTudo   = document.getElementById('btn-tudo');
  const btnNota   = document.getElementById('btn-nota');
  const cortina   = document.getElementById('cortina');

  let pagAtual = 0;
  let revelados = 0;
  let baloes = [];

  function el(tag, classe, texto) {
    const n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function linhas(pai, arr) {
    arr.forEach((t, i) => {
      if (i) pai.appendChild(document.createElement('br'));
      pai.appendChild(document.createTextNode(t));
    });
    return pai;
  }

  function quadroDe(pag, indice) {
    const quadros = QUADROS[pag.layout] || QUADROS.FULL;
    return quadros[indice] || quadros[0];
  }

  function posicionar(node, quadro, b) {
    const v = b.ancora[0], h = b.ancora[1];
    const insetX = 1.8, insetY = 2.0;

    node.style.width = (quadro.w * b.w / 100) + '%';

    if (v === 't') {
      node.style.top = (quadro.y + insetY) + '%';
    } else if (v === 'b') {
      node.style.bottom = (100 - quadro.y - quadro.h + insetY) + '%';
    } else {
      node.style.top = (quadro.y + quadro.h / 2) + '%';
      node.style.setProperty('--ty', '-50%');
    }

    if (h === 'l') {
      node.style.left = (quadro.x + insetX) + '%';
    } else if (h === 'r') {
      node.style.right = (100 - quadro.x - quadro.w + insetX) + '%';
    } else {
      node.style.left = (quadro.x + quadro.w / 2) + '%';
      node.style.setProperty('--tx', '-50%');
    }
  }

  function montarRabo(node, ancora) {
    const v = ancora[0], h = ancora[1];
    const rabo = el('span', 'rabo');

    if (v === 't')      rabo.classList.add('b');
    else if (v === 'b') rabo.classList.add('t');
    else                rabo.classList.add(h === 'r' ? 'e' : 'd');

    if (v === 't' || v === 'b') {
      rabo.style.left = (h === 'l') ? '68%' : (h === 'r') ? '26%' : '47%';
    } else {
      rabo.style.top = '58%';
    }
    node.appendChild(rabo);
  }

  function mistura(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const m = v => Math.round(v + (255 - v) * 0.86);
    return 'rgb(' + m(r) + ',' + m(g) + ',' + m(b) + ')';
  }

  function criarArte(pag) {
    const img = new Image();
    img.className = 'arte';
    img.src = pag.img;
    img.alt = pag.titulo ? ('Quadrinho: ' + pag.titulo) : (pag.rotulo || '');
    return img;
  }

  function montarCapa(alvo, pag) {
    alvo.appendChild(criarArte(pag));

    const caixa = el('div', 'capa-texto');

    const alto = el('div', 'capa-alto');
    const h1 = el('h1');
    linhas(h1, ['A Viagem pelo', 'Mundo dos Átomos']);
    alto.appendChild(h1);
    alto.appendChild(el('p', null,
      'A história dos modelos atômicos, de Demócrito a Bohr'));

    const baixo = el('div', 'capa-baixo');
    const nomes = el('div', 'nomes');
    GRUPO.forEach(n => nomes.appendChild(el('span', null, n)));
    baixo.appendChild(nomes);
    const escola = el('div', 'escola');
    linhas(escola, [
      FICHA.escola + ' · ' + FICHA.turma,
      FICHA.disciplina + ' · ' + FICHA.professor,
      FICHA.etapa
    ]);
    baixo.appendChild(escola);

    caixa.appendChild(alto);
    caixa.appendChild(baixo);
    alvo.appendChild(caixa);
    return [];
  }

  function montarCreditos(alvo, pag) {
    alvo.appendChild(criarArte(pag));

    const caixa = el('div', 'creditos-texto');
    caixa.appendChild(el('h2', null, 'Fim'));

    const b1 = el('div', 'creditos-bloco');
    b1.appendChild(el('span', 'rot', 'Integrantes do grupo'));
    linhas(b1, GRUPO);
    caixa.appendChild(b1);

    const b2 = el('div', 'creditos-bloco');
    b2.appendChild(el('span', 'rot', 'Inteligência artificial utilizada'));
    linhas(b2, [
      'Imagens geradas com ' + FICHA.ia + '.',
      'Diálogos, legendas e explicações científicas foram',
      'escritos e sobrepostos às imagens em HTML e CSS.'
    ]);
    caixa.appendChild(b2);

    const b3 = el('div', 'creditos-bloco');
    b3.appendChild(el('span', 'rot', 'Disciplina'));
    linhas(b3, [
      FICHA.disciplina + ' · ' + FICHA.professor,
      FICHA.escola + ' · ' + FICHA.turma,
      'Entrega: ' + FICHA.entrega
    ]);
    caixa.appendChild(b3);

    alvo.appendChild(caixa);
    return [];
  }

  function montarPersonagens(alvo) {
    const caixa = el('div', 'personagens');
    caixa.appendChild(el('h2', null, 'Os personagens'));
    caixa.appendChild(el('p', 'sub',
      'Duas pessoas que não existiram e seis que mudaram o mundo'));

    const dupla = el('div', 'dupla');
    PERSONAGENS.protagonistas.forEach(p => {
      const c = el('div', 'cartao');
      const img = new Image();
      img.src = p.img; img.alt = p.nome;
      const txt = el('div', 'txt');
      txt.appendChild(el('h3', null, p.nome));
      txt.appendChild(el('div', 'papel', p.papel));
      txt.appendChild(el('p', null, p.texto));
      c.appendChild(img); c.appendChild(txt);
      dupla.appendChild(c);
    });
    caixa.appendChild(dupla);

    caixa.appendChild(el('p', 'faixa-titulo',
      'Os cientistas, na ordem em que aparecem'));

    const grade = el('div', 'grade-cientistas');
    PERSONAGENS.cientistas.forEach(c => {
      const card = el('div', 'cientista');
      const img = new Image();
      img.src = c.img; img.alt = c.nome;
      card.appendChild(img);
      card.appendChild(el('h4', null, c.nome));
      card.appendChild(el('div', 'datas', c.datas));
      card.appendChild(el('p', null, c.texto));
      grade.appendChild(card);
    });
    caixa.appendChild(grade);

    alvo.appendChild(caixa);
    return [];
  }

  function montarQuadrinho(alvo, pag) {
    alvo.appendChild(criarArte(pag));
    const lista = [];

    pag.baloes.forEach(b => {
      const tipo = b.tipo || 'fala';
      const node = el('div', 'balao ' + tipo);
      posicionar(node, quadroDe(pag, b.painel), b);

      if (tipo !== 'legenda' && b.quem && ELENCO[b.quem]) {
        node.appendChild(el('span', 'quem', ELENCO[b.quem].nome));
        node.style.background = mistura(ELENCO[b.quem].cor);
      }
      node.appendChild(document.createTextNode(b.texto));
      if (tipo !== 'legenda') montarRabo(node, b.ancora);

      alvo.appendChild(node);
      lista.push(node);
    });
    return lista;
  }

  function montarPagina(alvo, pag) {
    if (pag.tipo === 'capa')        return montarCapa(alvo, pag);
    if (pag.tipo === 'creditos')    return montarCreditos(alvo, pag);
    if (pag.tipo === 'personagens') return montarPersonagens(alvo);
    return montarQuadrinho(alvo, pag);
  }

  function render() {
    const pag = PAGINAS[pagAtual];
    folha.textContent = '';
    revelados = 0;
    baloes = montarPagina(folha, pag);

    contador.textContent = (pagAtual + 1) + ' / ' + PAGINAS.length;
    rotuloPag.textContent = pag.rotulo + (pag.titulo ? ' · ' + pag.titulo : '');
    barraProg.style.width = ((pagAtual + 1) / PAGINAS.length * 100) + '%';

    btnAnt.disabled  = pagAtual === 0;
    btnProx.disabled = pagAtual === PAGINAS.length - 1;
    btnNota.style.display = pag.nota ? '' : 'none';
    btnNota.classList.remove('ativo');
    btnTudo.style.display = baloes.length ? '' : 'none';

    marcarIndiceAtual();
    if (baloes.length) revelarProximo();
  }

  function revelarProximo() {
    if (revelados >= baloes.length) return false;
    baloes[revelados].classList.add('visivel');
    revelados++;
    return true;
  }

  function revelarTodos() {
    baloes.forEach(n => n.classList.add('visivel'));
    revelados = baloes.length;
  }

  function avancar() {
    if (revelarProximo()) return;
    if (pagAtual < PAGINAS.length - 1) irPara(pagAtual + 1);
  }

  function voltar() {
    if (pagAtual > 0) { irPara(pagAtual - 1); revelarTodos(); }
  }

  function irPara(n) {
    pagAtual = Math.max(0, Math.min(PAGINAS.length - 1, n));
    render();
  }

  function montarIndice() {
    const lista = document.getElementById('lista-indice');
    lista.textContent = '';
    PAGINAS.forEach((pag, i) => {
      const b = el('button', 'item-indice');
      b.dataset.i = i;
      if (pag.img) {
        const img = new Image();
        img.src = pag.img; img.alt = ''; img.loading = 'lazy';
        b.appendChild(img);
      } else {
        b.appendChild(el('div', 'semimg', 'Personagens'));
      }
      const miolo = el('div', 'miolo');
      miolo.appendChild(el('span', 'num', 'Página ' + (i + 1)));
      miolo.appendChild(el('span', 'rot', pag.rotulo));
      b.appendChild(miolo);
      b.addEventListener('click', () => { irPara(i); fecharPaineis(); });
      lista.appendChild(b);
    });
  }

  function marcarIndiceAtual() {
    document.querySelectorAll('.item-indice').forEach(n => {
      n.classList.toggle('atual', Number(n.dataset.i) === pagAtual);
    });
  }

  function montarTranscricao() {
    const corpo = document.getElementById('transcricao-corpo');
    corpo.textContent = '';

    PAGINAS.forEach((pag, i) => {
      if (pag.tipo !== 'quadrinho') return;
      corpo.appendChild(el('h3', null,
        'Página ' + (i + 1) + ' · ' + pag.titulo));

      let quadro = -1;
      pag.baloes.forEach(b => {
        if (b.painel !== quadro) {
          quadro = b.painel;
          corpo.appendChild(el('p', 'tr-quadro', 'Quadro ' + (quadro + 1)));
        }
        if ((b.tipo || 'fala') === 'legenda') {
          corpo.appendChild(el('p', 'tr-legenda', b.texto));
        } else {
          const p = el('p', 'tr-fala');
          const forte = el('b', null, ((ELENCO[b.quem] || {}).nome || '') + ':');
          p.appendChild(forte);
          p.appendChild(document.createTextNode(' ' + b.texto));
          corpo.appendChild(p);
        }
      });

      if (pag.nota) {
        const n = el('div', 'tr-nota');
        n.appendChild(el('b', null, pag.nota.titulo + '. '));
        n.appendChild(document.createTextNode(pag.nota.texto));
        corpo.appendChild(n);
      }
    });
  }

  function abrir(id) {
    fecharPaineis();
    document.getElementById(id).hidden = false;
    cortina.hidden = false;
  }

  function fecharPaineis() {
    document.querySelectorAll('.painel').forEach(p => { p.hidden = true; });
    cortina.hidden = true;
    btnNota.classList.remove('ativo');
  }

  function abrirNota() {
    const pag = PAGINAS[pagAtual];
    if (!pag.nota) return;
    const corpo = document.getElementById('nota-corpo');
    corpo.textContent = '';
    corpo.appendChild(el('span', 'marcador', pag.rotulo));
    const t = el('p', 'nota-cabeca', pag.nota.titulo);
    corpo.appendChild(t);
    corpo.appendChild(el('p', null, pag.nota.texto));
    abrir('painel-nota');
    btnNota.classList.add('ativo');
  }

  function montarPilha() {
    const pilha = el('div', 'pilha-impressao');
    pilha.id = 'pilha-impressao';

    PAGINAS.forEach(pag => {
      const f = el('div', 'folha');
      const lista = montarPagina(f, pag);
      lista.forEach(n => n.classList.add('visivel'));
      pilha.appendChild(f);
    });

    palco.appendChild(pilha);
    return pilha;
  }

  function imprimirTudo() {
    if (document.body.classList.contains('modo-pdf')) return;

    document.body.classList.add('modo-pdf');
    const voltar = el('button', 'voltar-leitura', 'Voltar para a leitura');
    document.body.appendChild(voltar);

    let fechado = false;
    const limpar = () => {
      if (fechado) return;
      fechado = true;
      window.removeEventListener('afterprint', limpar);
      voltar.remove();
      document.body.classList.remove('modo-pdf');
    };

    voltar.addEventListener('click', limpar);
    window.addEventListener('afterprint', limpar);

    window.print();
  }

  function modoPdf() {
    document.body.classList.add('modo-pdf');
  }

  folha.addEventListener('click', () => {
    if (PAGINAS[pagAtual].tipo === 'personagens') return;
    avancar();
  });

  btnProx.addEventListener('click', () => irPara(pagAtual + 1));
  btnAnt.addEventListener('click', () => irPara(pagAtual - 1));
  btnTudo.addEventListener('click', revelarTodos);

  btnNota.addEventListener('click', () => {
    if (!document.getElementById('painel-nota').hidden) fecharPaineis();
    else abrirNota();
  });
  document.getElementById('btn-indice').addEventListener('click', () => {
    if (!document.getElementById('painel-indice').hidden) fecharPaineis();
    else abrir('painel-indice');
  });
  document.getElementById('btn-transcricao').addEventListener('click', () => {
    if (!document.getElementById('painel-transcricao').hidden) fecharPaineis();
    else abrir('painel-transcricao');
  });
  document.getElementById('btn-imprimir').addEventListener('click', imprimirTudo);

  document.querySelectorAll('[data-fechar]').forEach(b => {
    b.addEventListener('click', fecharPaineis);
  });
  cortina.addEventListener('click', fecharPaineis);

  function algumPainelAberto() {
    return [...document.querySelectorAll('.painel')].some(p => !p.hidden);
  }

  document.addEventListener('keydown', e => {
    if (algumPainelAberto()) {
      if (e.key === 'Escape') fecharPaineis();
      return;
    }
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': e.preventDefault(); avancar(); break;
      case ' ':                           e.preventDefault(); avancar(); break;
      case 'ArrowLeft':  case 'PageUp':   e.preventDefault(); voltar(); break;
      case 'Home':                        e.preventDefault(); irPara(0); break;
      case 'End':                         e.preventDefault(); irPara(PAGINAS.length - 1); break;
      case 'a': case 'A': revelarTodos(); break;
      case 's': case 'S': abrirNota(); break;
      case 'i': case 'I': abrir('painel-indice'); break;
      case 't': case 'T': abrir('painel-transcricao'); break;
      case 'Escape':      fecharPaineis(); break;
    }
  });

  let tx0 = null, ty0 = null;
  folha.addEventListener('touchstart', e => {
    tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY;
  }, { passive: true });
  folha.addEventListener('touchend', e => {
    if (tx0 == null) return;
    const dx = e.changedTouches[0].clientX - tx0;
    const dy = e.changedTouches[0].clientY - ty0;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) { revelarTodos(); irPara(pagAtual + 1); }
      else voltar();
    }
    tx0 = ty0 = null;
  }, { passive: true });

  montarIndice();
  montarTranscricao();
  render();
  montarPilha();
  if (/(^|[?&])pdf($|[=&])/.test(location.search)) modoPdf();

})();
