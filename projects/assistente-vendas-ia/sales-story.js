(()=>{
  const stageSteps=[...document.querySelectorAll('[data-stage-step]')];
  const status=document.querySelector('#stage-status');
  const progress=document.querySelector('#stage-progress');
  const labels=['Intenção identificada','Produto localizado','Quantidade validada','Pronto para revisão'];
  let active=0,timer;
  function drawStage(index){
    active=index;
    stageSteps.forEach((step,position)=>{
      step.classList.toggle('is-current',position===index);
      step.classList.toggle('is-complete',position<index);
    });
    progress.style.width=`${(index+1)*25}%`;
    status.textContent=labels[index];
  }
  function playStage(){
    clearInterval(timer);drawStage(0);
    if(matchMedia('(prefers-reduced-motion:reduce)').matches){stageSteps.forEach(step=>step.classList.add('is-complete'));progress.style.width='100%';status.textContent=labels[3];return}
    timer=setInterval(()=>drawStage((active+1)%stageSteps.length),1450);
  }
  const revealTargets=document.querySelectorAll('.sales-lab,.sales-architecture,.sales-boundaries,.sales-recruiter');
  revealTargets.forEach(node=>node.classList.add('sales-reveal'));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});
  revealTargets.forEach(node=>observer.observe(node));
  const english={
    kind:'Interactive case · conversational commerce',
    title:'From intent to order. Without handing decisions to the model.',
    lead:'Write like a person. The system translates conversation into known functions, reads data and stops any action that still requires confirmation.',
    try:'Try it now',understand:'Open technical decisions',stage:'One request, four decisions',localSim:'local simulation',
    demo:'Usable product',demoTitle:'Talk. Then inspect every decision.',demoText:'Choose a scenario or try to break the flow with free text. Nothing leaves the browser and no real inventory is changed.',
    recruiter:'Case reading',recruiterTitle:'The value is not a polished answer. It is keeping that answer connected to the system.',
    skill1:'Conversation design',skill1Text:'Short turns, contextual suggestions and repair when an intent is not recognized.',
    skill2:'Function calling',skill2Text:'Actions limited by known contracts instead of free text executing operations.',
    skill3:'Transactional state',skill3Text:'Cart, quantity, total and confirmation live outside the model response.',
    skill4:'Verifiable boundaries',skill4Text:'Payment and real reservation are blocked when the required integration does not exist.'
  };
  function translate(){
    const isEnglish=document.documentElement.dataset.lang==='en';
    document.querySelectorAll('[data-i18n]').forEach(node=>{
      const key=node.dataset.i18n;if(!english[key])return;
      node.dataset.storyPt??=node.textContent;
      node.textContent=isEnglish?english[key]:node.dataset.storyPt;
    });
  }
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
  translate();playStage();
})();
