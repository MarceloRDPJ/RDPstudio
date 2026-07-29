(() => {
  const translations = {
    kind:'Live platform',lead:'One shared foundation for people, forms, teams, events and network access — without scattering the community workflow across spreadsheets and isolated tools.',
    site:'Open public website',app:'Access platform',understand:'Understand the product',caption:'Real administrative interface. Sensitive data is not exposed in this presentation.',
    front:'Interface',scope:'Scope',scopeValue:'CRM, forms, teams and Wi-Fi',oneJourney:'One journey, not six systems.',oneJourneyText:'An entry may begin on the website, in a form or through the Wi-Fi portal. From there, the same person moves into follow-up, communication, teams and analysis without being registered again at every step.',
    adminTitle:'The daily operation becomes visible in one place.',adminText:'The dashboard brings people, answers, events, teams, schedules and indicators together. The interface follows the work the team performs, not the database tables.',
    crm:'History, tags and follow-up for people.',teams:'Teams, schedules and availability.',analytics:'Journey source, completion and abandonment.',formsTitle:'Every answer starts connected.',formsText:'Public forms feed the relationship flow without manual transcription. Autosave, progressive identification and validation reduce data loss.',formsCaption:'Public registration and relationship experience.',
    wifiTitle:'Network access can also begin a journey.',wifiText:'The portal identifies the visitor, records the device and connects access to the same profile used by the CRM. The operation combines public UI, session rules and network integration.',wifiCaption:'Captive portal used for organization network access.',
    architecture:'Architecture shaped by the operation.',architectureText:'Cloudflare Pages delivers the interfaces. Supabase handles authentication, PostgreSQL, realtime, functions and SQL procedures. This separation keeps deployment simple without hiding business rules.',
    privacy:'This page presents the structure and authorized screens. Profiles, internal rules and community data remain restricted to the operational environment.',back:'Back to projects'
  };
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach(item => item.setAttribute('aria-selected', String(item === button)));
    document.querySelectorAll('[role="tabpanel"]').forEach(panel => { panel.hidden = panel.id !== `panel-${button.dataset.tab}`; });
  }));
  const applyLanguage = () => {
    const english = document.documentElement.dataset.lang === 'en';
    document.querySelectorAll('[data-i18n]').forEach(node => {
      node.dataset.pt ||= node.textContent;
      node.textContent = english ? translations[node.dataset.i18n] || node.dataset.pt : node.dataset.pt;
    });
  };
  new MutationObserver(applyLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['data-lang']});
  applyLanguage();
})();
