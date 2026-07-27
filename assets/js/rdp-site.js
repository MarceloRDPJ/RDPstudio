(() => {
  const root = document.documentElement;
  const THEME_KEY = 'rdp-theme-mode';
  const LANG_KEY = 'rdp-language';
  const supported = ['pt-BR', 'en'];
  const memoryStorage = Object.create(null);
  const storage = {
    get(key) { try { return localStorage.getItem(key) ?? memoryStorage[key] ?? null; } catch (_) { return memoryStorage[key] ?? null; } },
    set(key, value) { memoryStorage[key] = value; try { localStorage.setItem(key, value); } catch (_) {} }
  };

  const systemTheme = () => matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  function applyTheme(mode) {
    const safe = ['system','light','dark','contrast'].includes(mode) ? mode : 'system';
    root.dataset.themeMode = safe;
    root.dataset.theme = safe === 'system' ? systemTheme() : safe;
    storage.set(THEME_KEY, safe);
    document.querySelectorAll('[data-theme-select]').forEach(el => el.value = safe);
    document.querySelectorAll('[data-theme-option]').forEach(el => {
      const selected = el.dataset.themeOption === safe;
      el.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-theme-current]').forEach(el => {
      const labels = { system: 'Sistema', light: 'Pistache', dark: 'Eucalipto', contrast: 'Contraste' };
      el.textContent = labels[safe];
    });
  }
  function currentLang() {
    const stored = storage.get(LANG_KEY);
    if (supported.includes(stored)) return stored;
    return navigator.language && navigator.language.toLowerCase().startsWith('en') ? 'en' : 'pt-BR';
  }
  function applyLanguage(lang) {
    const safe = supported.includes(lang) ? lang : 'pt-BR';
    storage.set(LANG_KEY, safe);
    root.lang = safe;
    root.dataset.lang = safe;
    document.querySelectorAll('[data-lang-select]').forEach(el => el.value = safe);
    document.querySelectorAll('[data-lang-option]').forEach(el => {
      el.setAttribute('aria-pressed', String(el.dataset.langOption === safe));
    });
    const dict = (window.RDP_I18N || {})[safe] || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = dict[el.dataset.i18n];
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const value = dict[el.dataset.i18nPlaceholder];
      if (value != null) el.setAttribute('placeholder', value);
    });
    document.dispatchEvent(new CustomEvent('rdp:language', { detail: { lang: safe }}));
  }

  const initialTheme = storage.get(THEME_KEY) || 'system';
  applyTheme(initialTheme);
  applyLanguage(currentLang());
  const directProjectLinks = {
    'igreja-casa': '../projects/igreja-casa/index.html',
    'scanner-game-free': '../projects/scanner-game-free/index.html',
    'abertura-chamados-glpi': '../projects/abertura-chamados-glpi/index.html'
  };
  document.querySelectorAll('a[href^="projeto.html?slug="]').forEach(link => {
    const slug = new URL(link.href).searchParams.get('slug');
    if (directProjectLinks[slug]) link.href = directProjectLinks[slug];
  });

  matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', () => {
    if ((storage.get(THEME_KEY) || 'system') === 'system') applyTheme('system');
  });

  document.addEventListener('change', event => {
    if (event.target.matches('[data-theme-select]')) applyTheme(event.target.value);
    if (event.target.matches('[data-lang-select]')) applyLanguage(event.target.value);
  });
  document.addEventListener('click', event => {
    const theme = event.target.closest('[data-theme-option]');
    if (theme) applyTheme(theme.dataset.themeOption);
    const lang = event.target.closest('[data-lang-option]');
    if (lang) applyLanguage(lang.dataset.langOption);
  });

  const menuBtn = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      const dict = (window.RDP_I18N || {})[root.dataset.lang] || {};
      menuBtn.setAttribute('aria-label', open ? (dict['menu.close'] || 'Fechar menu') : (dict['menu.open'] || 'Abrir menu'));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded','false');
    }));
  }
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
