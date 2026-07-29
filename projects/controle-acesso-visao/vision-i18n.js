(() => {
  const dictionary = new Map(Object.entries({
    'Ir para o conteúdo':'Skip to content',
    '← Voltar aos projetos':'← Back to projects',
    'Controle de acesso · TCC publicado em 2024':'Access control · graduation project published in 2024',
    'Um protótipo físico de acesso facial, explicado sem esconder o que se perdeu.':'A physical facial-access prototype, explained without hiding what was lost.',
    'O trabalho combinou câmera, identificação facial, acionamento de fechadura e monitoramento remoto. O artigo preserva a arquitetura e os resultados; o código original não está disponível. Esta página separa esses fatos da demonstração web criada depois.':'The work combined a camera, facial identification, lock actuation and remote monitoring. The paper preserves the architecture and results; the original source code is unavailable. This page keeps those facts separate from the web demonstration created later.',
    'Testar demonstração':'Try the demonstration',
    'Ler o artigo na RBMC ↗':'Read the RBMC paper ↗',
    'Trabalho original':'Original work',
    'Controle de acesso com reconhecimento facial':'Facial-recognition access control',
    'Camada embarcada':'Embedded layer',
    'Aplicação desktop':'Desktop application',
    'Estado do portfólio':'Portfolio status',
    'Reconstrução documental com demo independente':'Documentary reconstruction with an independent demo',
    'Duas entregas diferentes':'Two different deliverables',
    'O artigo documenta o sistema. A demo atual não finge reproduzi-lo.':'The paper documents the system. The current demo does not pretend to reproduce it.',
    'Projeto acadêmico':'Academic project',
    'Reconhecimento e atuação física':'Recognition and physical actuation',
    'O protótipo descrito na publicação tratava captura facial, cadastro, verificação, comunicação entre dispositivos e abertura da fechadura.':'The prototype described in the publication covered facial capture, enrolment, verification, communication between devices and lock opening.',
    'ESP32-CAM para captura e identificação':'ESP32-CAM for capture and identification',
    'ESP32 WROOM para relé, sensor e buzzer':'ESP32 WROOM for relay, sensor and buzzer',
    'Aplicação desktop para cadastro e acompanhamento':'Desktop application for enrolment and monitoring',
    'Demonstração do portfólio':'Portfolio demonstration',
    'Detecção local de objetos':'Local object detection',
    'A experiência disponível hoje usa a câmera do navegador e o COCO-SSD. Ela demonstra inferência local e estados de interface, não reconhecimento facial nem controle de fechadura.':'The current experience uses the browser camera and COCO-SSD. It demonstrates local inference and interface states, not facial recognition or lock control.',
    'Imagem processada no próprio navegador':'Image processed in the browser',
    'Modelo carregado somente quando solicitado':'Model loaded only when requested',
    'Sem cadastro de pessoas ou envio de vídeo':'No person enrolment or video upload',
    'Arquitetura registrada':'Recorded architecture',
    'Quatro responsabilidades, cada uma com um limite claro.':'Four responsibilities, each with a clear boundary.',
    'Capturar':'Capture','Decidir':'Decide','Acionar':'Actuate','Administrar':'Administer',
    'A ESP32-CAM fornece a imagem e mantém os identificadores necessários à operação embarcada.':'The ESP32-CAM provides the image and stores the identifiers required for embedded operation.',
    'A identificação facial determina se a solicitação de acesso deve seguir para a camada de atuação.':'Facial identification determines whether the access request should proceed to the actuation layer.',
    'A ESP32 WROOM controla relé, fecho eletromagnético, sensor magnético e buzzer.':'The ESP32 WROOM controls the relay, electromagnetic lock, magnetic sensor and buzzer.',
    'A aplicação desktop organiza cadastros e oferece uma interface de acompanhamento do sistema.':'The desktop application organises enrolments and provides a system-monitoring interface.',
    'O que pode ser verificado':'What can be verified',
    'A fonte primária continua sendo o artigo.':'The paper remains the primary source.',
    'A publicação apresenta motivação, componentes, arquitetura, materiais, desafios e trabalhos futuros. Ela também é o registro disponível do projeto depois da perda do código-fonte original.':'The publication covers motivation, components, architecture, materials, challenges and future work. It is also the available record of the project after the original source code was lost.',
    'Por isso, esta reconstrução não acrescenta precisão, desempenho ou resultados que não estejam documentados. Quando uma informação não pode ser confirmada, ela permanece fora da apresentação.':'For that reason, this reconstruction does not add undocumented accuracy, performance or results. Information that cannot be confirmed remains outside the presentation.',
    'Título':'Title','Publicação':'Publication',
    'Sistema de controle de acesso através de reconhecimento facial com monitoramento remoto':'Access-control system using facial recognition with remote monitoring',
    'Revista Brasileira Militar de Ciências, volume 10, número 24':'Brazilian Journal of Military Sciences, volume 10, issue 24',
    'Limites atuais':'Current limits',
    'O que a página consegue mostrar — e o que ainda falta.':'What the page can show — and what is still missing.',
    'Disponível:':'Available:','Indisponível:':'Unavailable:','Material visual pendente:':'Pending visual material:',
    'artigo, arquitetura reconstruída, stack documentada e uma demonstração funcional de visão computacional no navegador.':'paper, reconstructed architecture, documented stack and a functional in-browser computer-vision demonstration.',
    'código-fonte original, firmware, banco de dados e aplicação desktop usados no TCC.':'original source code, firmware, database and desktop application used in the graduation project.',
    'fotografias originais do protótipo físico e capturas autorizadas da aplicação.':'original photographs of the physical prototype and authorised application screenshots.',
    'Experiência independente':'Independent experience',
    'Use a câmera para observar a inferência local — não para simular reconhecimento facial.':'Use the camera to observe local inference — not to simulate facial recognition.',
    'Abrir demonstração':'Open demonstration','Ler documentação técnica →':'Read technical documentation →',
    'Controle de Acesso Vision · reconstrução documental':'Controle de Acesso Vision · documentary reconstruction',
    'Sobre o projeto':'About the project','Demo local':'Local demo',
    'Demonstração no navegador':'In-browser demonstration',
    'Detecção local de objetos pela câmera.':'Local object detection through the camera.',
    'Esta experiência não reproduz o reconhecimento facial do TCC. Ela carrega o COCO-SSD sob demanda, processa a imagem no navegador e mostra as classes que o modelo consegue identificar.':'This experience does not reproduce the graduation project’s facial recognition. It loads COCO-SSD on demand, processes the image in the browser and shows the classes the model can identify.',
    'Modelo não carregado':'Model not loaded','Modelo indisponível':'Model unavailable',
    'Confiança mínima':'Minimum confidence','Câmera':'Camera','Frontal':'Front','Traseira':'Rear','Modo':'Mode',
    'Leitura estabilizada':'Stabilised reading','Agrupa sinais entre frames para reduzir ruído.':'Groups signals across frames to reduce noise.',
    'Pronto para observar a cena':'Ready to observe the scene',
    'Clique em iniciar para carregar o modelo, pedir permissão da câmera e ativar a leitura local da imagem no navegador.':'Select start to load the model, request camera permission and enable local image analysis in the browser.',
    'Iniciar câmera':'Start camera','Parar câmera':'Stop camera','Foco operacional':'Operational focus',
    'Classes com boa aderência no modelo base':'Classes with reliable coverage in the base model',
    'Pessoa':'Person','Celular':'Mobile phone','Mochila':'Backpack','Bolsa':'Handbag','Acessório':'Accessory','Colher':'Spoon','Faca':'Knife','Tesoura':'Scissors',
    'Telemetria':'Telemetry','Status':'Status','Detecções':'Detections','Objeto principal':'Top object','Confiança':'Confidence','Objetos estabilizados':'Stabilised objects',
    'Ocioso':'Idle','Inicializando':'Initialising','Executando':'Running','Falha':'Failed','Nenhum':'None',
    'Sinais de atenção':'Attention signals','Triagem contextual da cena':'Contextual scene screening','Sem alerta':'No alert','Nível':'Level','Objetos sensíveis':'Sensitive objects','Baixo':'Low',
    'Nenhum padrão de atenção identificado.':'No attention pattern identified.',
    'Leitura especializada':'Specialised reading','Nenhum destaque operacional ainda.':'No operational highlight yet.',
    'Classes recentes':'Recent classes','Sem deteccoes':'No detections','Sem detecções':'No detections',
    'Notas da demo':'Demo notes',
    'Ela não tenta substituir o sistema do TCC. O papel aqui é demonstrar visão computacional de forma viva e honesta.':'It does not attempt to replace the graduation-project system. Its role is to demonstrate computer vision directly and honestly.',
    'O processamento acontece no cliente. O vídeo não precisa sair do navegador.':'Processing happens on the client. Video does not need to leave the browser.',
    'Os alertas de suspeita são heurísticas de triagem. Eles ajudam a chamar atenção, mas não substituem critério humano.':'The attention alerts are screening heuristics. They can draw attention but do not replace human judgement.',
    'Itens muito pequenos ou fora do vocabulário base, como chave, cabo e óculos, podem não aparecer com consistência nessa versão web.':'Very small items or items outside the base vocabulary, such as keys, cables and glasses, may not appear consistently in this web version.',
    'Sistema pronto. Nenhum evento ainda.':'System ready. No events yet.'
  }))

  const originals = new WeakMap()
  let translating = false
  const targetLanguage = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'pt-BR'

  function translated(value) {
    const trimmed = value.trim()
    if (dictionary.has(trimmed)) return value.replace(trimmed, dictionary.get(trimmed))
    return value
  }

  function apply() {
    if (translating) return
    translating = true
    const english = targetLanguage() === 'en'
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.parentElement || node.parentElement.closest('[data-rdp-shell]') || /SCRIPT|STYLE|CODE|PRE|TEXTAREA/.test(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT
        return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      }
    })
    let node
    while ((node = walker.nextNode())) {
      if (!originals.has(node)) originals.set(node, node.textContent)
      const original = originals.get(node)
      const next = english ? translated(original) : original
      if (node.textContent !== next) node.textContent = next
    }
    const nextTitle = english
      ? (document.body.classList.contains('vision-demo-page') ? 'Computer vision demonstration | Controle de Acesso Vision' : 'Controle de Acesso Vision — RDP Studio')
      : (document.body.classList.contains('vision-demo-page') ? 'Demonstração de visão computacional | Controle de Acesso Vision' : 'Controle de Acesso Vision — RDP Studio')
    if (document.title !== nextTitle) document.title = nextTitle
    translating = false
  }

  new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.type === 'attributes' || mutation.type === 'childList' || mutation.type === 'characterData')) queueMicrotask(apply)
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'], childList: true, characterData: true, subtree: true })

  apply()
})()
