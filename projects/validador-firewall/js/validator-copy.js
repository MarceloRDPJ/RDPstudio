(()=>{
  const set=(selector,text)=>{const node=document.querySelector(selector);if(node)node.textContent=text};
  const title=document.querySelector('.text-center.mb-12 h1');
  if(title)title.innerHTML='Preparador de objetos <span class="text-gradient">FortiGate</span>';
  set('.text-center.mb-12 p','Cole uma lista ou importe CSV/TXT. A ferramenta identifica nomes e endereços MAC, separa as linhas que precisam de correção e prepara os comandos para sua revisão.');
  set('header span','Ferramenta local');
  const buttons=document.querySelectorAll('.text-center.mb-12 button span');
  if(buttons[0])buttons[0].textContent='CARREGAR EXEMPLO';
  if(buttons[1])buttons[1].textContent='COMO FUNCIONA';
  const flowTitle=document.querySelector('.mb-16 > .text-xs');
  if(flowTitle)flowTitle.textContent='Etapas do processamento';
  [['#step-input h4','Entrada'],['#step-input p','CSV, TXT ou texto'],['#step-engine h4','Leitura'],['#step-engine p','Nome e MAC'],['#step-validation h4','Validação'],['#step-validation p','Duplicatas e formato'],['#step-output h4','Saída'],['#step-output p','Objetos e grupo']].forEach(([selector,text])=>set(selector,text));
  document.querySelector('.absolute.bottom-4.right-4')?.remove();
})();
