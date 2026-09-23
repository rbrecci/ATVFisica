/* Roteiro da HQ "A Viagem pelo Mundo dos Átomos".
   Fonte única de verdade: o app monta tudo a partir daqui.

   Posicionamento de balão: cada balão vive DENTRO de um quadro (painel).
   "painel" é o índice do quadro na página, "ancora" é o canto onde ele encosta.
   Âncoras: tl tc tr / ml mc mr / bl bc br. "w" é a largura em % do quadro.
   Isso é bem mais robusto que coordenada absoluta: se a arte variar um pouco,
   o balão continua encostado no canto certo. */

/* Retângulo de cada quadro, em % da página.

   ATENÇÃO: estes números NÃO são chutados. A arte gerada não segue um grid
   exato (cada página saiu com proporções um pouco diferentes), então os
   valores abaixo foram medidos pixel a pixel pelas calhas brancas, com
   prompts/detectar-quadros.py. Se alguma página for regerada, rode o script
   de novo e cole a saída aqui, senão o balão cai na calha entre os quadros. */
const QUADROS = {
  grecia:     [{ x: 4.6, y: 3.8, w: 91.0, h: 51.5 }, { x: 4.6, y: 56.2, w: 46.5, h: 40.2 }, { x: 52.1, y: 56.2, w: 43.4, h: 40.2 }],
  dalton:     [{ x: 4.5, y: 4.3, w: 52.9, h: 36.7 }, { x: 58.6, y: 4.3, w: 36.9, h: 36.7 }, { x: 4.5, y: 41.9, w: 91.1, h: 54.4 }],
  thomson:    [{ x: 4.6, y: 3.8, w: 91.0, h: 51.5 }, { x: 4.6, y: 56.2, w: 42.1, h: 40.2 }, { x: 48.0, y: 56.2, w: 47.5, h: 40.2 }],
  rutherford: [{ x: 4.6, y: 3.8, w: 58.5, h: 45.8 }, { x: 64.3, y: 3.8, w: 31.2, h: 45.8 }, { x: 4.6, y: 50.4, w: 91.0, h: 45.9 }],
  nuclear:    [{ x: 4.6, y: 3.8, w: 91.0, h: 45.8 }, { x: 4.6, y: 50.4, w: 45.5, h: 45.9 }, { x: 51.3, y: 50.4, w: 44.2, h: 45.9 }],
  bohr:       [{ x: 4.6, y: 4.3, w: 44.6, h: 45.0 }, { x: 50.8, y: 4.3, w: 44.6, h: 45.0 }, { x: 4.6, y: 50.5, w: 90.8, h: 45.8 }],
  tecnologia: [{ x: 4.6, y: 4.8, w: 44.6, h: 44.5 }, { x: 50.8, y: 4.8, w: 44.6, h: 44.5 }, { x: 4.6, y: 50.9, w: 90.8, h: 45.9 }],
  conclusao:  [{ x: 4.6, y: 4.3, w: 90.8, h: 45.0 }, { x: 4.6, y: 50.5, w: 90.8, h: 45.8 }],
  // página sem quadros (capa, créditos)
  FULL:       [{ x: 0, y: 0, w: 100, h: 100 }]
};

const GRUPO = [
  'Rafael Brecci de Souza',
  'Kelvyn Ottolini Lima',
  'Vinicius Vila Nova',
  'Eduardo Zanetti Luis'
];

const FICHA = {
  escola: 'SESI Parque Jaçatuba',
  turma: 'CE nº 221, Santo André',
  disciplina: 'Física',
  professor: 'Prof. Fabio Yonashiro',
  etapa: 'Avaliação da III Etapa',
  entrega: '28 de setembro de 2026',
  ia: 'Google Gemini (modelo Flash, geração de imagens)'
};

const ELENCO = {
  nina:        { nome: 'Nina',        cor: '#f5b12e' },
  elio:        { nome: 'Prof. Élio',  cor: '#2f9e8f' },
  democrito:   { nome: 'Demócrito',   cor: '#d8c9a3' },
  aristoteles: { nome: 'Aristóteles', cor: '#b49ad0' },
  dalton:      { nome: 'Dalton',      cor: '#9aa6bf' },
  thomson:     { nome: 'Thomson',     cor: '#d3a3a8' },
  rutherford:  { nome: 'Rutherford',  cor: '#d8bd85' },
  bohr:        { nome: 'Bohr',        cor: '#a9a9d4' },
  geiger:      { nome: 'Geiger',      cor: '#c9c1b0' },
  marsden:     { nome: 'Marsden',     cor: '#c9c1b0' }
};

const PERSONAGENS = {
  protagonistas: [
    {
      id: 'nina', img: 'assets/img/nina.png', nome: 'Nina',
      papel: 'A estudante curiosa',
      texto: 'Tem 16 anos e uma mania perigosa: perguntar "por quê" depois que o professor já respondeu. Foi essa mania que abriu o Cronoscópio.'
    },
    {
      id: 'elio', img: 'assets/img/elio.png', nome: 'Professor Élio',
      papel: 'O cientista-guia',
      texto: 'Carrega o Cronoscópio, um relógio de bolso que só para onde uma pergunta começou. Nunca entrega a resposta pronta: entrega o experimento.'
    }
  ],
  cientistas: [
    {
      id: 'democrito', img: 'assets/img/democrito.png',
      nome: 'Demócrito de Abdera', datas: 'c. 460 a.C. a 370 a.C.',
      texto: 'Criou a palavra átomo, de "a" (não) e "tomos" (divisível). Chegou nela pensando, não medindo.'
    },
    {
      id: 'aristoteles', img: 'assets/img/aristoteles.png',
      nome: 'Aristóteles', datas: '384 a.C. a 322 a.C.',
      texto: 'Negou o vazio e os átomos. Defendeu a matéria contínua, feita de quatro elementos. Venceu o debate por quase dois mil anos.'
    },
    {
      id: 'dalton', img: 'assets/img/dalton.png',
      nome: 'John Dalton', datas: '1766 a 1844',
      texto: 'Trouxe o átomo das ideias para a balança. Modelo da esfera maciça e indivisível, a "bola de bilhar".'
    },
    {
      id: 'thomson', img: 'assets/img/thomson.png',
      nome: 'J. J. Thomson', datas: '1856 a 1940',
      texto: 'Descobriu o elétron em 1897 e provou que o átomo tem parte interna. Modelo do "pudim de passas".'
    },
    {
      id: 'rutherford', img: 'assets/img/rutherford.png',
      nome: 'Ernest Rutherford', datas: '1871 a 1937',
      texto: 'O experimento da folha de ouro revelou o núcleo em 1911. Descobriu que o átomo é quase todo vazio.'
    },
    {
      id: 'bohr', img: 'assets/img/bohr.png',
      nome: 'Niels Bohr', datas: '1885 a 1962',
      texto: 'Em 1913 salvou o modelo nuclear com os níveis de energia e o salto quântico. Explicou por que cada elemento tem sua cor.'
    }
  ]
};

const PAGINAS = [

  /* ------------------------------------------------ 1. CAPA */
  {
    id: 'capa', tipo: 'capa', img: 'paginas/p01-capa.jpg',
    rotulo: 'Capa'
  },

  /* ---------------------------------------- 2. PERSONAGENS */
  {
    id: 'personagens', tipo: 'personagens',
    rotulo: 'Personagens'
  },

  /* --------------------------------------------- 3. GRÉCIA */
  {
    id: 'grecia', tipo: 'quadrinho', img: 'paginas/p03-grecia.jpg',
    layout: 'grecia', rotulo: 'Grécia, 400 a.C.',
    titulo: 'A palavra nasce sem prova',
    baloes: [
      { painel: 0, ancora: 'tl', w: 44, tipo: 'legenda',
        texto: 'Grécia Antiga, por volta de 400 a.C. Primeira parada: o lugar onde a palavra "átomo" foi inventada.' },
      { painel: 0, ancora: 'bl', w: 38, quem: 'nina',
        texto: 'Professor, o senhor me tirou da aula de Física e me jogou em 400 a.C.?' },
      { painel: 0, ancora: 'br', w: 40, quem: 'elio',
        texto: 'O Cronoscópio só para onde a pergunta começou. E a sua começou aqui.' },

      { painel: 1, ancora: 'tl', w: 40, tipo: 'legenda',
        texto: 'Demócrito de Abdera.' },
      { painel: 1, ancora: 'tr', w: 48, quem: 'democrito',
        texto: 'Corta esta pedra ao meio. Corta de novo. E de novo. Uma hora não dá mais.' },
      { painel: 1, ancora: 'bl', w: 44, quem: 'nina',
        texto: 'E como o senhor sabe que chega?' },
      { painel: 1, ancora: 'br', w: 44, quem: 'democrito',
        texto: 'Não sei. Eu penso. Chamo de átomo: o que não se corta.' },

      { painel: 2, ancora: 'tl', w: 50, tipo: 'legenda',
        texto: 'Aristóteles. O homem mais influente do mundo antigo discordou.' },
      { painel: 2, ancora: 'mr', w: 50, quem: 'aristoteles',
        texto: 'Vazio não existe. A matéria é contínua e nasce de quatro elementos: terra, água, ar e fogo.' },
      { painel: 2, ancora: 'bc', w: 84, tipo: 'legenda',
        texto: 'Aristóteles venceu o debate. Por quase dois mil anos, ninguém mais levou átomos a sério.' }
    ],
    nota: {
      titulo: 'Por que a ideia certa perdeu',
      texto: 'Demócrito não fez um único experimento. O atomismo grego era filosofia, não ciência: uma ideia coerente, mas sem teste possível. Como nenhum dos dois lados podia ser verificado, a disputa foi decidida por prestígio, e Aristóteles tinha mais. A ideia de Demócrito estava mais próxima do que hoje aceitamos, mas ele não tinha como provar, e isso importa.'
    }
  },

  /* --------------------------------------------- 4. DALTON */
  {
    id: 'dalton', tipo: 'quadrinho', img: 'paginas/p04-dalton.jpg',
    layout: 'dalton', rotulo: 'Dalton, 1803',
    titulo: 'O átomo entra na balança',
    baloes: [
      { painel: 0, ancora: 'tl', w: 56, tipo: 'legenda',
        texto: 'Manchester, Inglaterra, 1803. Dois mil anos depois, um professor resolve pesar a ideia.' },
      { painel: 0, ancora: 'bl', w: 46, quem: 'dalton',
        texto: 'Filosofia não me interessa, menina. Me interessa a balança.' },
      { painel: 0, ancora: 'br', w: 40, quem: 'nina',
        texto: 'E o que a balança diz?' },

      { painel: 1, ancora: 'tr', w: 60, quem: 'dalton',
        texto: 'Que dois elementos sempre se combinam na mesma proporção de massa. Sempre. Isso não é acaso.' },
      { painel: 1, ancora: 'bl', w: 58, quem: 'dalton',
        texto: 'Se a proporção é fixa, é porque existem unidades. Cada elemento tem a sua, com massa própria.' },

      { painel: 2, ancora: 'tl', w: 40, tipo: 'legenda',
        texto: 'O modelo de Dalton: a bola de bilhar. Esfera maciça, indivisível e indestrutível.' },
      { painel: 2, ancora: 'tr', w: 40, quem: 'elio',
        texto: 'Repare no que mudou. O átomo de Demócrito era uma ideia. O de Dalton é uma conclusão tirada de medida.' },
      { painel: 2, ancora: 'bl', w: 38, quem: 'nina',
        texto: 'Maciço e indivisível. Parece definitivo.' },
      { painel: 2, ancora: 'br', w: 38, quem: 'elio',
        texto: 'Todo modelo parece definitivo. Até o próximo experimento.' }
    ],
    nota: {
      titulo: 'As leis que Dalton usou',
      texto: 'Dalton se apoiou nas leis ponderais: a conservação da massa, de Lavoisier, e as proporções definidas, de Proust. Ele mesmo formulou a lei das proporções múltiplas. Seus postulados: a matéria é feita de partículas esféricas, maciças e indivisíveis; átomos de um mesmo elemento são idênticos em massa; átomos de elementos diferentes têm massas diferentes; e os compostos se formam pela união de átomos em proporções de números inteiros e pequenos. Pela primeira vez o átomo entrou na ciência por medida, e não por argumento.'
    }
  },

  /* -------------------------------------------- 5. THOMSON */
  {
    id: 'thomson', tipo: 'quadrinho', img: 'paginas/p05-thomson.jpg',
    layout: 'thomson', rotulo: 'Thomson, 1897',
    titulo: 'O indivisível se parte',
    baloes: [
      { painel: 0, ancora: 'tl', w: 40, tipo: 'legenda',
        texto: 'Laboratório Cavendish, Cambridge, 1897.' },
      { painel: 0, ancora: 'tr', w: 42, quem: 'thomson',
        texto: 'Faço vácuo no tubo, aplico alta tensão, e alguma coisa sai do cátodo e atravessa até o outro lado.' },
      { painel: 0, ancora: 'bl', w: 34, quem: 'nina',
        texto: 'Isso é luz?' },
      { painel: 0, ancora: 'br', w: 40, quem: 'thomson',
        texto: 'Luz não entorta com ímã. Este feixe entorta.' },

      { painel: 1, ancora: 'tl', w: 56, tipo: 'legenda',
        texto: 'O feixe se desvia na direção da placa positiva.' },
      { painel: 1, ancora: 'bc', w: 84, quem: 'elio',
        texto: 'Atraído pelo positivo. Logo, a carga dele é negativa.' },

      { painel: 2, ancora: 'tl', w: 42, tipo: 'legenda',
        texto: 'O modelo do pudim de passas.' },
      { painel: 2, ancora: 'tr', w: 48, quem: 'thomson',
        texto: 'Medi a razão entre carga e massa. Dá o mesmo valor com qualquer gás e qualquer eletrodo.' },
      { painel: 2, ancora: 'bl', w: 42, quem: 'nina',
        texto: 'Então essa partícula está em tudo.' },
      { painel: 2, ancora: 'br', w: 46, quem: 'elio',
        texto: 'E quase duas mil vezes mais leve que o átomo de hidrogênio. O indivisível de Dalton se partiu.' }
    ],
    nota: {
      titulo: 'O que Thomson realmente mediu',
      texto: 'Thomson não pesou o elétron: mediu a razão entre a carga e a massa dele, desviando o feixe com campo elétrico e campo magnético ao mesmo tempo. O resultado dava sempre igual, não importa o gás dentro do tubo nem o metal do eletrodo. Isso só fazia sentido se a partícula fosse a mesma em toda matéria. Como o átomo é neutro, precisava existir carga positiva em algum lugar: ele imaginou uma esfera positiva difusa com os elétrons incrustados, como passas num pudim.'
    }
  },

  /* ----------------------------------------- 6. RUTHERFORD */
  {
    id: 'rutherford', tipo: 'quadrinho', img: 'paginas/p06-rutherford.jpg',
    layout: 'rutherford', rotulo: 'Rutherford, 1911',
    titulo: 'A bala que voltou',
    baloes: [
      { painel: 0, ancora: 'tl', w: 64, tipo: 'legenda',
        texto: 'Manchester, 1909. Geiger e Marsden passam meses no escuro contando cintilações.' },
      { painel: 0, ancora: 'mr', w: 50, quem: 'rutherford',
        texto: 'Atirem partículas alfa na folha de ouro. Contem onde cada uma chega.' },
      { painel: 0, ancora: 'bl', w: 56, quem: 'geiger',
        texto: 'Já contamos milhares, senhor. Quase todas passam direto, como se não houvesse nada ali.' },

      { painel: 1, ancora: 'tl', w: 62, tipo: 'legenda',
        texto: 'Cada risco verde é uma partícula alfa batendo na tela.' },
      { painel: 1, ancora: 'bc', w: 76, quem: 'marsden',
        texto: 'Senhor... algumas estão voltando.' },

      { painel: 2, ancora: 'tl', w: 40, tipo: 'legenda',
        texto: 'Se o átomo fosse um pudim, nada poderia ricochetear.' },
      { painel: 2, ancora: 'tr', w: 40, quem: 'rutherford',
        texto: 'Foi como disparar contra uma folha de papel e a bala voltar na sua própria cara.' },
      { painel: 2, ancora: 'br', w: 40, quem: 'nina',
        texto: 'Então tem alguma coisa pequena e muito dura lá dentro.' }
    ],
    nota: {
      titulo: 'Os números do experimento',
      texto: 'A lâmina de ouro tinha cerca de 0,00001 cm de espessura, o que ainda assim representa milhares de átomos de profundidade. As partículas alfa são núcleos de hélio, com carga positiva. A grande maioria atravessou sem desvio, poucas se desviaram e cerca de uma em cada vinte mil voltou. Pelo modelo do pudim, a carga positiva estaria espalhada e nenhuma partícula teria como ricochetear. O único jeito de explicar era admitir que toda a carga positiva estava concentrada num volume minúsculo.'
    }
  },

  /* -------------------------------------- 7. MODELO NUCLEAR */
  {
    id: 'nuclear', tipo: 'quadrinho', img: 'paginas/p07-nuclear.jpg',
    layout: 'nuclear', rotulo: 'O vazio e o defeito',
    titulo: 'Quase tudo é nada',
    baloes: [
      { painel: 0, ancora: 'tl', w: 40, tipo: 'legenda',
        texto: 'Bem-vinda ao interior de um átomo.' },
      { painel: 0, ancora: 'bl', w: 34, quem: 'nina',
        texto: 'Cadê o resto?' },
      { painel: 0, ancora: 'br', w: 42, quem: 'elio',
        texto: 'Não tem resto. O átomo é quase inteiramente vazio.' },

      { painel: 1, ancora: 'tc', w: 88, tipo: 'legenda',
        texto: 'Se o núcleo fosse uma bolinha de gude no centro do campo, os elétrons estariam na última fileira da arquibancada. Entre os dois, nada.' },

      { painel: 2, ancora: 'tl', w: 44, tipo: 'legenda',
        texto: 'Mas o modelo nasceu com um defeito fatal.' },
      { painel: 2, ancora: 'tr', w: 48, quem: 'elio',
        texto: 'Pelo eletromagnetismo clássico, toda carga acelerada emite radiação. E o elétron em órbita está acelerado.' },
      { painel: 2, ancora: 'bl', w: 42, quem: 'nina',
        texto: 'Se ele perde energia, ele cai no núcleo.' },
      { painel: 2, ancora: 'br', w: 46, quem: 'elio',
        texto: 'Em menos de um bilionésimo de segundo. Pela física de 1911, você não deveria existir.' }
    ],
    nota: {
      titulo: 'O que o modelo acertou e o que errou',
      texto: 'Rutherford acertou a estrutura: um núcleo pequeno, denso e positivo, que concentra quase toda a massa, cercado por uma eletrosfera praticamente vazia, dezenas de milhares de vezes maior que o núcleo. Errou na estabilidade. Pela teoria de Maxwell, um elétron em órbita está em aceleração centrípeta, deveria irradiar energia e espiralar para dentro em cerca de dez picossegundos. O modelo também não explicava por que cada elemento só emite luz em cores específicas. O próton foi identificado por Rutherford por volta de 1919, e o nêutron só em 1932, por James Chadwick.'
    }
  },

  /* ----------------------------------------------- 8. BOHR */
  {
    id: 'bohr', tipo: 'quadrinho', img: 'paginas/p08-bohr.jpg',
    layout: 'bohr', rotulo: 'Bohr, 1913',
    titulo: 'A escada sem degraus intermediários',
    baloes: [
      { painel: 0, ancora: 'tl', w: 66, tipo: 'legenda',
        texto: 'Copenhague, 1913. Um jovem dinamarquês que trabalhou com Rutherford decide salvar o modelo do chefe.' },
      { painel: 0, ancora: 'br', w: 54, quem: 'bohr',
        texto: 'E se o elétron simplesmente não puder perder energia aos poucos?' },

      { painel: 1, ancora: 'tl', w: 50, tipo: 'legenda',
        texto: 'Os postulados de Bohr.' },
      { painel: 1, ancora: 'mr', w: 54, quem: 'bohr',
        texto: 'Existem órbitas permitidas. Nelas, o elétron gira sem emitir nada.' },
      { painel: 1, ancora: 'bl', w: 58, quem: 'nina',
        texto: 'O senhor está postulando que a regra antiga não vale aqui dentro.' },

      { painel: 2, ancora: 'tl', w: 38, tipo: 'legenda',
        texto: 'O salto quântico.' },
      { painel: 2, ancora: 'tr', w: 42, quem: 'elio',
        texto: 'Para subir de nível, o elétron absorve energia. Para descer, devolve, na forma de um fóton.' },
      { painel: 2, ancora: 'bl', w: 42, quem: 'elio',
        texto: 'E a energia do fóton é exatamente a diferença entre os dois níveis. Por isso cada elemento emite suas próprias cores.' },
      { painel: 2, ancora: 'br', w: 40, quem: 'nina',
        texto: 'É por isso que fogo de artifício tem cor conforme o sal que colocam nele.' }
    ],
    nota: {
      titulo: 'Onde Bohr acerta e onde para',
      texto: 'Bohr importou a quantização de Planck e Einstein para dentro do átomo. Seus postulados: o elétron só ocupa órbitas de energia definida; nelas, não irradia; e a transição entre duas órbitas emite ou absorve um fóton cuja energia é exatamente a diferença entre os níveis. Isso explicou com precisão o espectro de linhas do hidrogênio, o teste da chama e a cor dos fogos de artifício. Mas o modelo falha para átomos com mais de um elétron. Vieram depois as órbitas elípticas de Sommerfeld e, nos anos 1920, o modelo quântico atual, em que o elétron não tem mais órbita definida e sim orbital, uma região de probabilidade.'
    }
  },

  /* ---------------------------------------- 9. TECNOLOGIA */
  {
    id: 'tecnologia', tipo: 'quadrinho', img: 'paginas/p09-tecnologia.jpg',
    layout: 'tecnologia', rotulo: 'Hoje',
    titulo: 'O que isso virou',
    baloes: [
      { painel: 0, ancora: 'tl', w: 40, tipo: 'legenda',
        texto: 'Hoje. Cirurgia a laser.' },
      { painel: 0, ancora: 'mr', w: 54, quem: 'elio',
        texto: 'Laser é o salto de Bohr usado de propósito: excita muitos elétrons de uma vez e faz todos caírem juntos.' },
      { painel: 0, ancora: 'bl', w: 50, quem: 'nina',
        texto: 'E aí a luz sai toda igual.' },

      { painel: 1, ancora: 'tl', w: 50, tipo: 'legenda',
        texto: 'Ressonância magnética.' },
      { painel: 1, ancora: 'mr', w: 50, quem: 'elio',
        texto: 'Aqui não é a eletrosfera, é o núcleo. O campo alinha os prótons de hidrogênio da água do seu corpo.' },
      { painel: 1, ancora: 'bl', w: 52, quem: 'elio',
        texto: 'Um pulso de rádio desalinha. Ao voltarem, eles emitem sinal, e o computador transforma isso em imagem.' },

      { painel: 2, ancora: 'tl', w: 40, tipo: 'legenda',
        texto: 'E o que você tem na mão.' },
      { painel: 2, ancora: 'tr', w: 40, quem: 'elio',
        texto: 'Os níveis de energia dos átomos de silício viram bandas. Dopando o cristal, a gente controla quem passa e quem não passa.' },
      { painel: 2, ancora: 'bl', w: 34, quem: 'nina',
        texto: 'Transistor.' },
      { painel: 2, ancora: 'br', w: 42, quem: 'elio',
        texto: 'Bilhões deles nesse chip. Tudo porque alguém quis saber onde ficava o elétron.' }
    ],
    nota: {
      titulo: 'As três tecnologias, em uma linha cada',
      texto: 'Laser: emissão estimulada. Muitos elétrons são levados ao estado excitado e um único fóton provoca a queda em cadeia, gerando luz monocromática e coerente, usada em leitor de código de barras, fibra óptica e cirurgia. Ressonância magnética: usa o spin dos núcleos de hidrogênio da água do corpo, alinhados por um campo magnético forte e perturbados por um pulso de radiofrequência; o sinal da volta ao alinhamento vira imagem. Semicondutor e transistor: os níveis de energia dos átomos no cristal de silício formam bandas, e a dopagem controlada permite governar a corrente. O transistor é a chave liga e desliga que sustenta todo computador e todo celular.'
    }
  },

  /* ----------------------------------------- 10. CONCLUSÃO */
  {
    id: 'conclusao', tipo: 'quadrinho', img: 'paginas/p10-conclusao.jpg',
    layout: 'conclusao', rotulo: 'Conclusão',
    titulo: 'Nenhum deles foi mentira',
    baloes: [
      { painel: 0, ancora: 'tl', w: 44, tipo: 'legenda',
        texto: 'Nenhum desses modelos foi mentira. Cada um explicava tudo o que se sabia na época, e caiu quando apareceu uma medida que ele não dava conta de explicar.' },
      { painel: 0, ancora: 'tr', w: 40, tipo: 'legenda',
        texto: 'Isso não é fracasso da ciência. É exatamente como ela funciona.' },
      { painel: 0, ancora: 'bl', w: 40, quem: 'nina',
        texto: 'E a nuvem lá no fim da estrada, também vai cair um dia?' },
      { painel: 0, ancora: 'br', w: 42, quem: 'elio',
        texto: 'Provavelmente. E quem derrubar vai precisar de todos os que vieram antes.' },

      { painel: 1, ancora: 'tl', w: 42, tipo: 'legenda',
        texto: 'A ideia de Demócrito levou 2.400 anos para virar um chip.' },
      { painel: 1, ancora: 'br', w: 46, quem: 'nina', tipo: 'pensamento',
        texto: 'Tudo o que eu sou é feito de uma coisa que, por quase dois mil anos, quase ninguém acreditou que existia.' }
    ],
    nota: {
      titulo: 'A importância da ciência para entender a matéria',
      texto: 'A sequência Demócrito, Dalton, Thomson, Rutherford e Bohr não é uma fila de erros corrigidos: é um método funcionando. Cada modelo foi derrubado por uma evidência nova, e não por opinião, e cada queda deixou de pé a parte que resistia ao teste. Foi assim que a humanidade saiu de uma intuição filosófica sem prova e chegou a manipular a matéria átomo a átomo, em aparelhos que salvam vida e cabem no bolso. O modelo quântico de hoje também é provisório, e isso é o que há de mais confiável nele.'
    }
  },

  /* ------------------------------------------ 11. CRÉDITOS */
  {
    id: 'creditos', tipo: 'creditos', img: 'paginas/p11-creditos.jpg',
    rotulo: 'Créditos'
  }
];
