/* Пометка: Измени имя, специализацию, Telegram и ссылки на соцсети в HTML-страницах. */
document.addEventListener('DOMContentLoaded', () => {
  // Навигация: подсветка текущей страницы и мобильное меню.
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  if (toggle && mobileMenu) toggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

  // Эффект Glow, следующий за курсором. На сенсорных устройствах отключён.
  const glow = document.querySelector('.hero-glow');
  if (glow && matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY + window.scrollY}px`;
    }, {passive:true});
  }

  // Typewriter: последовательная печать специализаций.
  const typeTarget = document.querySelector('[data-typewriter]');
  if (typeTarget) {
    const phrases = { ru: ['Fullstack-разработчик', 'Frontend-инженер', 'Автоматизация процессов'], en: ['Full-stack developer', 'Frontend engineer', 'Process automation'] };
    const currentPhrases = () => phrases[document.documentElement.lang === 'ru' ? 'ru' : 'en'];
    let phrase = 0, char = 0, deleting = false;
    const tick = () => {
      const current = currentPhrases()[phrase % currentPhrases().length];
      typeTarget.textContent = current.slice(0, char);
      if (!deleting && char < current.length) { char++; setTimeout(tick, 75); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1300); }
      else if (char > 0) { char--; setTimeout(tick, 32); }
      else { deleting = false; phrase = (phrase + 1) % currentPhrases().length; setTimeout(tick, 260); }
    };
    tick();
  }

  // Фильтр карточек проектов по категориям.
  const filterButtons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.toggle('active', b === btn));
    const filter = btn.dataset.filter;
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  }));

  // Слайдер «До / После»: ползунок регулирует видимую ширину исправленного кода.
  const compareRange = document.querySelector('[data-compare-range]');
  const afterPane = document.querySelector('[data-compare-after]');
  if (compareRange && afterPane) {
    const updateCompare = () => afterPane.style.width = `${compareRange.value}%`;
    compareRange.addEventListener('input', updateCompare);
    updateCompare();
  }

  // Калькулятор стоимости. Пометка: Измени базовую цену в объекте servicePrices ниже.
  const calc = document.querySelector('[data-calculator]');
  if (calc) {
    const service = calc.querySelector('[name="service"]');
    const quantity = calc.querySelector('[name="quantity"]');
    const quantitySlider = calc.querySelector('#quantity-slider');
    const quantityOutput = calc.querySelector('[data-quantity-output]');
    const options = [...calc.querySelectorAll('[name="extra"]')];
    const priceOutput = calc.querySelector('[data-price]');
    const breakdown = calc.querySelector('[data-breakdown]');
    const orderButton = calc.querySelector('[data-order]');
    // Пометка: Измени базовую цену в калькуляторе здесь -->
    const servicePrices = { landing: 30, multipage: 35, script: 25, fixes: 15 };
    const serviceNames = { landing: {ru:'Лендинг',en:'Landing page'}, multipage: {ru:'Многостраничный сайт',en:'Multi-page website'}, script: {ru:'Скрипт / автоматизация',en:'Script / automation'}, fixes: {ru:'Исправление ошибок',en:'Code fixes'} };
    const extras = { responsive: {label:{ru:'Адаптивная версия',en:'Responsive layout'},price:8}, seo:{label:{ru:'Базовая SEO-настройка',en:'Basic SEO setup'},price:7}, urgent:{label:{ru:'Срочный срок',en:'Rush delivery'},price:15}, animation:{label:{ru:'Микроанимации',en:'Micro-animations'},price:6} };
    const money = n => `$${Math.round(n).toLocaleString(document.documentElement.lang === 'ru' ? 'ru-RU' : 'en-US')}`;
    let shown = 0, animationFrame = 0;
    const animatePrice = target => {
      cancelAnimationFrame(animationFrame);
      const start = shown, startTime = performance.now(), duration = 320;
      const step = now => {
        const progress = Math.min(1, (now - startTime) / duration);
        shown = Math.round(start + (target - start) * (1 - Math.pow(1-progress, 3)));
        priceOutput.textContent = money(shown);
        if (progress < 1) animationFrame = requestAnimationFrame(step);
      };
      animationFrame = requestAnimationFrame(step);
    };
    const quantityControl = calc.querySelector('[data-quantity-control]');
    const extrasHeading = calc.querySelector('[data-extras-heading]') || calc.querySelector('.mt-7 .font-medium');
    const extraCards = [...calc.querySelectorAll('[data-extra]')];
    const serviceRules = {
      landing:   { quantity: false, extras: ['responsive','seo','urgent','animation'] },
      multipage: { quantity: true,  extras: ['responsive','seo','urgent','animation'] },
      script:    { quantity: false, extras: ['urgent'] },
      fixes:     { quantity: false, extras: ['urgent'] }
    };
    const syncServiceOptions = () => {
      const rules = serviceRules[service.value] || serviceRules.landing;
      if (quantityControl) quantityControl.hidden = !rules.quantity;
      quantity.required = rules.quantity;
      if (!rules.quantity) quantity.value = '1';
      if (quantitySlider) quantitySlider.value = quantity.value || '1';
      extraCards.forEach(card => {
        const input = card.querySelector('input[name="extra"]');
        const visible = rules.extras.includes(card.dataset.extra);
        card.hidden = !visible;
        if (!visible && input) input.checked = false;
      });
      if (extrasHeading) extrasHeading.hidden = rules.extras.length === 0;
      if (quantityOutput) quantityOutput.textContent = quantity.value || '1';
    };
    const calculate = () => {
      const rules = serviceRules[service.value] || serviceRules.landing;
      const parsed = Number(quantity.value);
      const validQuantity = !rules.quantity || (Number.isInteger(parsed) && parsed >= 1 && parsed <= 15);
      const qty = rules.quantity && validQuantity ? parsed : 1;
      quantity.setCustomValidity(!rules.quantity || validQuantity ? '' : (document.documentElement.lang === 'ru' ? 'Введите целое число от 1 до 15.' : 'Enter a whole number from 1 to 15.'));
      if (quantityOutput) quantityOutput.textContent = qty;
      // Лендинг, скрипт и исправления — фиксированная базовая ставка; количество учитывается только для многостраничного сайта.
      const base = servicePrices[service.value] * (service.value === 'multipage' ? qty : 1);
      const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
      const chosen = options.filter(o => o.checked && rules.extras.includes(o.value)).map(o => extras[o.value]).filter(Boolean);
      const extraTotal = chosen.reduce((sum, item) => sum + item.price, 0);
      const total = base + extraTotal;
      breakdown.textContent = lang === 'ru' ? `${money(base)} базовая стоимость + ${money(extraTotal)} опции` : `${money(base)} base price + ${money(extraTotal)} add-ons`;
      animatePrice(total);
      return { service: serviceNames[service.value][lang], quantity: rules.quantity ? qty : null, base, extras: chosen.map(x => x.label[lang]), total, currency: 'USD' };
    };
    service.addEventListener('change', () => { syncServiceOptions(); calculate(); });
    quantity.addEventListener('input', () => {
      if (quantitySlider && Number(quantity.value) >= 1 && Number(quantity.value) <= 15) quantitySlider.value = quantity.value;
      calculate();
    });
    if (quantitySlider) quantitySlider.addEventListener('input', () => {
      quantity.value = quantitySlider.value;
      quantity.dispatchEvent(new Event('input', { bubbles: true }));
    });
    options.forEach(el => el.addEventListener('input', calculate));
    orderButton.addEventListener('click', () => {
      if (serviceRules[service.value]?.quantity && !quantity.reportValidity()) return;
      const order = calculate();
      // Сохраняем язык, выбранный именно в калькуляторе, для шаблона сообщения.
      order.lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
      order.createdAt = new Date().toISOString();
      localStorage.setItem('developerPortfolioOrder', JSON.stringify(order));
      window.location.href = 'contacts.html?from=calculator';
    });
    syncServiceOptions();
    calculate();
    document.addEventListener('portfolio:languagechange', () => calculate());
  }

  // Контакты: автоматически переносим детали расчёта в сообщение.
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    const message = contactForm.querySelector('[name="message"]');
    const saved = localStorage.getItem('developerPortfolioOrder');
    if (saved && message && (new URLSearchParams(location.search).has('from') || !message.value)) {
      try {
        const order = JSON.parse(saved);
        const orderLang = order.lang || (document.documentElement.lang === 'ru' ? 'ru' : 'en');
        message.value = orderLang === 'ru'
          ? `Здравствуйте! Хочу обсудить заказ:\nУслуга: ${order.service}${order.quantity ? `\nКоличество страниц: ${order.quantity}` : ''}\nДополнительные опции: ${order.extras.length ? order.extras.join(', ') : 'нет'}\n\nМой комментарий: `
          : `Hello! I'd like to discuss this project:\nService: ${order.service}${order.quantity ? `\nNumber of pages: ${order.quantity}` : ''}\nAdd-ons: ${order.extras.length ? order.extras.join(', ') : 'none'}\n\nAdditional notes: `;
      } catch (e) { console.warn('Не удалось прочитать сохранённый заказ', e); }
    }
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      const status = contactForm.querySelector('[data-form-status]');
      const keyField = contactForm.querySelector('[name="access_key"]');
      // Пометка: Вставь API-ключ Web3Forms в поле access_key в contacts.html.
      if (!keyField || !keyField.value || keyField.value === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        status.textContent = document.documentElement.lang === 'ru' ? 'Перед отправкой добавь свой ключ Web3Forms в contacts.html. Тестовая отправка не выполнена.' : 'Add your Web3Forms key in contacts.html before sending. No test submission was made.';
        status.classList.remove('hidden');
        return;
      }
      const submit = contactForm.querySelector('[type="submit"]');
      submit.disabled = true; submit.textContent = document.documentElement.lang === 'ru' ? 'Отправляем…' : 'Sending…';
      try {
        const response = await fetch('https://api.web3forms.com/submit', { method:'POST', body:new FormData(contactForm) });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Ошибка отправки');
        contactForm.closest('.form-screen')?.classList.add('hide');
        document.querySelector('[data-success-screen]')?.classList.add('show');
        localStorage.removeItem('developerPortfolioOrder');
      } catch (error) {
        status.textContent = document.documentElement.lang === 'ru' ? 'Не удалось отправить сообщение. Проверь подключение к интернету и ключ Web3Forms, затем попробуй ещё раз.' : 'Could not send the message. Check your internet connection and Web3Forms key, then try again.';
        status.classList.remove('hidden');
      } finally {
        submit.disabled = false; submit.textContent = document.documentElement.lang === 'ru' ? 'Отправить сообщение ↗' : 'Send message ↗';
      }
    });
  }

  // Ненавязчивое появление блоков при прокрутке.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold:.08});
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('visible'));

  // RU / EN language switcher. Preference is saved locally; no backend required.
  const translations = {
    'Главная':'Home','Портфолио':'Portfolio','Услуги и прайс':'Services & pricing','Контакты':'Contact','Обсудить проект':'Discuss a project',
    'Независимый разработчик · Remote friendly':'Independent developer · Remote friendly','Создаю цифровые':'I build digital','решения без шума.':'solutions without the noise.',
    'Услуги веб-разработки и интерактивный калькулятор стоимости проекта.':'Web development services and an interactive project cost calculator.',
    'Превращаю идеи в быстрые, удобные и надёжные интерфейсы. Чистый код, продуманный UX и автоматизация рутины.':'I turn ideas into fast, useful, reliable interfaces. Clean code, thoughtful UX, and automation.',
    'Fullstack-разработчик':'Full-stack developer','Frontend-инженер':'Frontend engineer','Автоматизация процессов':'Process automation',
    'Смотреть работы ↗':'Explore concepts ↗','Узнать стоимость':'Estimate a project','Быстрая загрузка':'Fast loading','Есть задача?':'Have a project in mind?',
    'Давайте соберём что-то полезное.':"Let’s build something useful.",'Опиши идею — обсудим решение и сроки.':'Tell me about your idea and we’ll discuss the approach and timeline.','Связаться со мной ↗':'Get in touch ↗',
    'Разработка сайтов':'Website development','Лендинги и многостраничные сайты с адаптивной сеткой, доступной разметкой и аккуратными деталями.':'Landing pages and multi-page websites with responsive layouts, accessible markup, and careful details.',
    'Рефакторинг и правки':'Refactoring & fixes','Разбираюсь с багами, ускоряю интерфейсы и привожу сложный код к понятной структуре.':'I debug issues, improve interface performance, and make complex code easier to maintain.',
    'Скрипты и автоматизация':'Scripts & automation','Убираю повторяющиеся задачи с помощью небольших инструментов и интеграций.':'I reduce repetitive work with small tools and integrations.',
    'Портфолио разработчика':'Developer portfolio','Работы, где важна':'Work where every','каждая деталь.':'detail matters.','Пока нет клиентских кейсов? Это нормально. Здесь — концепт-лаборатория: самостоятельные UI-концепции, интерактивные демонстрации и примеры инженерного подхода. Никаких выдуманных клиентов или метрик.':'No client projects yet? That’s fine. This concept lab showcases self-initiated UI concepts, interactive demos, and engineering approach—without invented clients or metrics.',
    'Все проекты':'All concepts','Лендинги':'Landing pages','Скрипты':'Scripts','Правки':'Code improvements','Orbit — SaaS-концепт':'Orbit — SaaS concept','Flow — automation concept':'Flow — automation concept','Code care — demo':'Code care — demo',
    'До / После: качество кода':'Before / After: code quality','Перемещай ползунок, чтобы сравнить условный фрагмент с ошибками и его более чистую версию.':'Move the slider to compare a sample with issues against a cleaner version.',
    'Есть похожая задача?':'Have a similar challenge?','Разберём исходники и определим самый короткий путь к результату.':'We’ll review the code and find a practical path to the result.','Обсудить задачу ↗':'Discuss your project ↗',
    'Понятный процесс.':'A clear process.','Прозрачная стоимость.':'Transparent pricing.','Выбери тип задачи, объём и дополнительные опции — калькулятор покажет предварительную оценку. Финальная цена зависит от технического задания.':'Choose a task type, scope, and add-ons to get an estimate. Final pricing depends on the project brief.',
    'Калькулятор проекта':'Project calculator','Быстрый выбор сценария':'Quick start','Тип услуги':'Service type','Количество страниц / экранов':'Number of pages / sections','Дополнительные опции':'Add-ons','Адаптивная версия':'Responsive layout','Базовая SEO-настройка':'Basic SEO setup','Срочный срок':'Rush delivery','Микроанимации':'Micro-animations','Предварительная стоимость':'Estimated total','Заказать с этими параметрами ↗':'Continue with this estimate ↗',
    'Нажимая кнопку, ты сохраняешь конфигурацию в этом браузере и переходишь к контактам.':'Your configuration is saved in this browser before you continue to contact details.',
    'Сайты и лендинги':'Websites & landing pages','Исправления и оптимизация':'Fixes & optimization','Скрипты и интеграции':'Scripts & integrations',
    'Есть идея?':'Have an idea?','Давайте обсудим.':'Let’s talk.','Расскажи, что нужно сделать. Я отвечу, уточню детали и предложу следующие шаги.':'Tell me what you need. I’ll follow up with questions and suggested next steps.',
    'Удобный способ связи':'Ways to reach me','Замени контакты ниже на свои перед публикацией.':'Replace the contact details before publishing.','Имя *':'Name *','Email *':'Email *','Тема':'Topic','Сообщение *':'Message *','Отправить сообщение ↗':'Send message ↗',
    'Успешно отправлено!':'Message sent successfully!','Спасибо за сообщение. Я свяжусь с тобой в ближайшее время.':'Thanks for reaching out. I’ll get back to you soon.','На главную':'Back home',
    'Новый проект':'New project','Исправление / рефакторинг':'Fixes / refactoring','Скрипт и автоматизация':'Script / automation','Другой вопрос':'Other question',
    'Почта ↗':'Email ↗','Zuravlov. Сделано с вниманием к деталям.':'Zuravlov. Built with attention to detail.','Сделано с вниманием к деталям.':'Built with attention to detail.','Обычно отвечаю в течение двух рабочих дней.':'I usually reply within two business days.',
    'Коротко опиши задачу, сроки и желаемый результат…':'Briefly describe the task, timeline, and desired outcome…','Как к тебе обращаться':'What should I call you','Тестовая отправка не выполнена.':'No test submission was made.'
  };
  Object.assign(translations, {
    'Услуги и цены ↗':'Services & pricing ↗','Mobile-first':'Mobile-first','GitHub Pages ready':'GitHub Pages ready',
    'Услуги и прайс':'Services & pricing','Контакты':'Contact','Понятный процесс.':'A clear process.','Прозрачная стоимость.':'Transparent pricing.',
    'Что я могу разработать':'What I can build','Услуги, ориентированные на ваши цели':'Services built around your goals',
    'Практичные веб-решения, аккуратная реализация и прозрачный объём работ — без лишней сложности.':'Practical web solutions, clean implementation and transparent scope — without unnecessary complexity.',
    'Создание сайтов под ключ':'Websites from start to launch','Современные лендинги и многостраничные сайты с понятной структурой, продуманной визуальной иерархией, доступной разметкой и файлами, готовыми к публикации.':'Modern landing pages and multi-page websites with clear structure, polished visual hierarchy, accessible markup and launch-ready files.',
    'Лендинги и сайты для бизнеса':'Landing pages and business websites','Структура контента и повторно используемые секции':'Content structure and reusable sections','Базовое SEO и помощь с публикацией':'Basic SEO and deployment support',
    'Надёжно на любом экране':'Reliable on every screen','Адаптивные макеты для телефонов, планшетов и компьютеров, с читаемым, поддерживаемым HTML/CSS и проверкой в разных браузерах.':'Responsive layouts for phones, tablets and desktops, with readable, maintainable HTML/CSS and cross-browser checks.',
    'Адаптивная вёрстка mobile-first':'Mobile-first responsive layout','Семантический HTML по стандартам':'Semantic, standards-based HTML','Очистка CSS и проверка браузеров':'CSS cleanup and browser testing',
    'Интерфейсы, которые реагируют':'Interfaces that respond','Лёгкие JavaScript-взаимодействия, кастомные формы, анимации, калькуляторы и динамические элементы интерфейса.':'Lightweight JavaScript interactions, custom forms, animations, calculators and dynamic UI elements designed to feel natural.',
    'Формы и проверка данных на стороне клиента':'Forms and client-side validation','Интерактивные виджеты и калькуляторы':'Interactive widgets and calculators','Микровзаимодействия и состояния интерфейса':'Micro-interactions and UI states',
    'Мой инструментарий':'My toolkit','Практичный стек':'A focused, practical stack','Подходящие инструменты для быстрых и лёгких сайтов — с акцентом на поддержку, доступность и адаптивность.':'The right tools for fast, lightweight websites — with an emphasis on maintainability, accessibility and responsive behavior.',
    'Введите целое число от 1 до 15.':'Enter a whole number from 1 to 15.','Быстрый выбор сценария':'Quick start','Количество страниц / экранов':'Number of pages / sections',
    'Лендинг':'Landing page','Сайт на несколько страниц':'Multi-page website','Автоматизация':'Automation','Исправить код':'Fix code',
    'от $30 / лендинг':'From $30 / landing page','от $15 / задача':'From $15 / task','от $25 / задача':'From $25 / task',
    'USD · estimate':'USD · estimate','Предварительная стоимость':'Estimated total','Базовая стоимость':'Base price','опции':'add-ons',
    'Есть идея?':'Have an idea?','Давайте обсудим.':'Let’s talk.','Расскажи, что нужно сделать. Я отвечу, уточню детали и предложу следующие шаги.':'Tell me what you need. I’ll follow up with questions and suggested next steps.',
    'Удобный способ связи':'Ways to reach me','Замени контакты ниже на свои перед публикацией.':'Replace the contact details before publishing.',
    'Имя *':'Name *','Сообщение *':'Message *','Отправить сообщение ↗':'Send message ↗','Почта ↗':'Email ↗','Zuravlov. Сделано с вниманием к деталям.':'Zuravlov. Built with attention to detail.',
    'Сделано с вниманием к деталям.':'Built with attention to detail.','Обычно отвечаю в течение двух рабочих дней.':'I usually reply within two business days.',
    'Коротко опиши задачу, сроки и желаемый результат…':'Briefly describe the task, timeline, and desired outcome…','Как к тебе обращаться':'What should I call you',
    'Отправляем…':'Sending…','Перед отправкой добавь свой ключ Web3Forms в contacts.html. Тестовая отправка не выполнена.':'Add your Web3Forms key in contacts.html before sending. No test submission was made.',
    'Не удалось отправить сообщение. Проверь подключение к интернету и ключ Web3Forms, затем попробуй ещё раз.':'Could not send the message. Check your internet connection and Web3Forms key, then try again.',
    'Успешно отправлено!':'Message sent successfully!','Спасибо за сообщение. Я свяжусь с тобой в ближайшее время.':'Thanks for reaching out. I’ll get back to you soon.',
    'Нажимая кнопку, ты сохраняешь конфигурацию в этом браузере и переходишь к контактам.':'Your configuration is saved in this browser before you continue to contact details.',
    'Выбери тип задачи, объём и дополнительные опции — калькулятор покажет предварительную оценку. Финальная цена зависит от технического задания.':'Choose a task type, scope, and add-ons to get an estimate. Final pricing depends on the project brief.',
    'Понятный процесс.':'A clear process.','Прозрачная стоимость.':'Transparent pricing.',
    'Базовая SEO-настройка':'Basic SEO setup','Срочный срок':'Rush delivery','Микроанимации':'Micro-animations','Адаптивная версия':'Responsive layout'
  });
  Object.assign(translations, {
    'Разработчик и автоматизация — Zuravlov':'Developer & automation — Zuravlov',
    'Главная':'Home','Узнать стоимость':'Get an estimate','Быстрая загрузка':'Fast loading',
    '01 / Build':'01 / Build','02 / Fix':'02 / Fix','03 / Automate':'03 / Automate',
    'Рефакторинг и правки':'Refactoring & fixes','Разбираюсь с багами, ускоряю интерфейсы и привожу сложный код к понятной структуре.':'I debug issues, improve interface performance, and make complex code easier to maintain.',
    'Есть задача?':'Have a project in mind?','Опиши идею — обсудим решение и сроки.':'Tell me about your idea and we’ll discuss the approach and timeline.',
    'Services / Transparent pricing':'Services / Transparent pricing','Выбери тип задачи, объём и дополнительные опции — калькулятор покажет предварительную оценку. Финальная цена зависит от технического задания.':'Choose a task type, scope, and add-ons to get an estimate. Final pricing depends on the project brief.',
    'Лендинг — от $30':'Landing page — from $30','Многостраничный сайт — от $35 за страницу':'Multi-page website — from $35 per page','Скрипт / автоматизация — от $25 за блок работ':'Script / automation — from $25 per task','Исправление ошибок — от $15 за блок работ':'Code fixes — from $15 per task',
    'Стоимость рассчитывается автоматически':'The estimate updates automatically','Заказать с этими параметрами ↗':'Continue with this estimate ↗',
    'Структура, дизайн-система, адаптивная вёрстка, интерактивные элементы и подготовка к публикации.':'Structure, design system, responsive layout, interactive elements and launch preparation.',
    'Поиск причин ошибок, улучшение производительности, рефакторинг и проверка на разных экранах.':'Debugging, performance improvements, refactoring and checks across screen sizes.',
    'Утилиты, небольшие автоматизации и связка сервисов там, где можно сэкономить время.':'Utilities, lightweight automations and service integrations that save time.',
    'Это предварительная оценка, а не фиксированная оферта. После заявки уточним объём, сроки и технические детали.':'This is an estimate, not a fixed offer. We’ll confirm scope, timeline and technical details after your enquiry.',
    'Contact / Let’s talk':'Contact / Let’s talk','Direct links':'Direct links','Typical response':'Typical response','часов':'hours',
    'Напиши сообщение':'Send a message','Поля со звёздочкой обязательны.':'Fields marked with an asterisk are required.',
    'Я согласен(на) на обработку данных, указанных в сообщении, для ответа на запрос.':'I consent to the use of the information in this message to respond to my enquiry.',
    
    'Пометка: Измени это имя на свое в VS Code':'Note: replace this name in VS Code','Пометка: Измени Telegram на свое имя пользователя':'Note: replace with your Telegram username','Пометка: Измени почту на свою':'Note: replace with your email address',
    'Независимый разработчик · Remote friendly':'Independent developer · Remote friendly',
    'Независимый разработчик':'Independent developer','Убираю повторяющиеся задачи с помощью небольших инструментов и интеграций.':'I reduce repetitive tasks with small tools and integrations.',
    'Услуги и прайс — Zuravlov':'Services & pricing — Zuravlov','Контакты — Zuravlov':'Contact — Zuravlov',
    'Отправить сообщение ↗':'Send message ↗','На главную':'Back home',
    '24–48':'24–48','Почта ↗':'Email ↗','Zuravlov. Сделано с вниманием к деталям.':'Zuravlov. Built with attention to detail.',
    'Разработка сайтов под ключ':'Web Development','Адаптивная вёрстка и чистый код':'Responsive & Clean Code','Интерактивный интерфейс и логика':'Interactive UI & Logic',
    'От $30':'From $30','От $35':'From $35','От $25':'From $25','Сайты от начала до запуска':'Websites from start to launch',
    'Надёжность на любом экране':'Reliable on every screen','Интерфейсы с интерактивностью':'Interfaces that respond','Мой стек':'My toolkit','Услуги / прозрачные цены':'Services / Transparent pricing','Разработка сайтов':'Web Development','Адаптивная вёрстка и чистый код':'Responsive & Clean Code','Интерактивный интерфейс и логика':'Interactive UI & Logic','Что я могу создать':'What I can build','Практичные веб-решения':'Practical web solutions','Сайты для бизнеса':'Landing pages and business websites','Структура контента и переиспользуемые блоки':'Content structure and reusable sections','Базовое SEO и помощь с публикацией':'Basic SEO and deployment support','Адаптивные макеты для телефонов, планшетов и компьютеров':'Responsive layouts for phones, tablets and desktops','Семантический HTML по стандартам':'Semantic, standards-based HTML','Очистка CSS и проверка в браузерах':'CSS cleanup and browser testing','Формы и клиентская валидация':'Forms and client-side validation','Интерактивные виджеты и калькуляторы':'Interactive widgets and calculators','Микровзаимодействия и состояния интерфейса':'Micro-interactions and UI states','Подходящий стек для быстрых и лёгких сайтов':'A focused, practical stack','HTML5, CSS3, JavaScript, Git и адаптивный дизайн':'HTML5, CSS3, JavaScript, Git and Responsive Design'
  });
  // Build a stable bidirectional dictionary. Each text node keeps its original
  // value, so switching languages never translates an already-translated string.
  Object.assign(translations, {
    'Лендинги':'Landing pages',
    'Современные одностраничные сайты с понятной структурой, продуманной визуальной иерархией, доступной разметкой и файлами, готовыми к публикации.':'Modern single-page websites with a clear structure, polished visual hierarchy, accessible markup and launch-ready files.',
    'Структура лендинга с фокусом на цель':'Focused landing page structure',
    'Понятная иерархия контента и призывы к действию':'Clear content hierarchy and calls to action',
    'От $30 / лендинг':'From $30 / landing page',
    'Многостраничные сайты':'Multi-page Websites',
    'Сайт, который растёт вместе с вами':'A website that grows with you',
    'Хорошо структурированные многостраничные сайты с единообразной навигацией, адаптивными макетами и поддерживаемым HTML/CSS.':'Well-structured multi-page websites with consistent navigation, responsive layouts and maintainable HTML/CSS.',
    'Несколько связанных страниц':'Multiple connected pages',
    'Единая навигация и визуальный стиль':'Consistent navigation and visual style',
    'Адаптивная вёрстка и проверка в разных браузерах':'Responsive layout and cross-browser checks',
    'От $35 / страница':'From $35 / page',
    'От $25 / задача':'From $25 / task',
    'от $30 / лендинг':'From $30 / landing page',
    'Лендинг — от $30':'Landing page — from $30'
  });

  const reverseTranslations = {};
  Object.entries(translations).forEach(([ru, en]) => {
    if (typeof en === 'string' && !Object.prototype.hasOwnProperty.call(reverseTranslations, en)) {
      reverseTranslations[en] = ru;
    }
  });

  const preserveWhitespace = (original, replacement) => {
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';
    return leading + replacement + trailing;
  };

  const translateTextNode = (node, lang) => {
    if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue.trim()) return;
    const parent = node.parentElement;
    if (!parent || parent.closest('script, style, noscript, textarea, [data-no-translate]')) return;

    if (node.__i18nOriginal === undefined) node.__i18nOriginal = node.nodeValue;
    const original = node.__i18nOriginal;
    const key = original.trim();
    let translated = key;

    if (lang === 'en') {
      if (Object.prototype.hasOwnProperty.call(translations, key)) translated = translations[key];
      else if (Object.prototype.hasOwnProperty.call(reverseTranslations, key)) translated = key;
    } else {
      // English source strings must reverse-map before considering dictionary keys
      // that intentionally map to themselves (legacy entries in this project).
      if (Object.prototype.hasOwnProperty.call(reverseTranslations, key)) translated = reverseTranslations[key];
      else if (Object.prototype.hasOwnProperty.call(translations, key)) translated = key;
    }
    node.nodeValue = preserveWhitespace(original, translated);
  };

  const translateAttribute = (el, attr, lang) => {
    if (!el.hasAttribute(attr)) return;
    const storeName = 'data-i18n-original-' + attr;
    if (!el.hasAttribute(storeName)) el.setAttribute(storeName, el.getAttribute(attr));
    const original = el.getAttribute(storeName);
    const key = original.trim();
    let translated = original;
    if (lang === 'en') {
      if (Object.prototype.hasOwnProperty.call(translations, key)) translated = translations[key];
      else if (Object.prototype.hasOwnProperty.call(reverseTranslations, key)) translated = key;
    } else {
      // English source strings must reverse-map before considering dictionary keys
      // that intentionally map to themselves (legacy entries in this project).
      if (Object.prototype.hasOwnProperty.call(reverseTranslations, key)) translated = reverseTranslations[key];
      else if (Object.prototype.hasOwnProperty.call(translations, key)) translated = key;
    }
    el.setAttribute(attr, translated);
  };

  const applyLanguage = requestedLang => {
    const lang = requestedLang === 'ru' ? 'ru' : 'en';
    document.documentElement.lang = lang;

    // Translate all existing text nodes from their immutable originals.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => translateTextNode(node, lang));

    document.querySelectorAll('body *').forEach(el => {
      ['placeholder', 'aria-label', 'title'].forEach(attr => translateAttribute(el, attr, lang));
    });

    // Keep document metadata in sync with the selected language.
    const title = document.querySelector('title');
    if (title) {
      if (!title.dataset.i18nOriginal) title.dataset.i18nOriginal = title.textContent;
      const original = title.dataset.i18nOriginal.trim();
      if (lang === 'en') title.textContent = translations[original] || original
        .replace('Разработчик и автоматизация', 'Developer & automation')
        .replace('Услуги и прайс', 'Services & pricing')
        .replace('Контакты', 'Contact');
      else title.textContent = reverseTranslations[original] || original;
    }
    const description = document.querySelector('meta[name="description"]');
    if (description) translateAttribute(description, 'content', lang);

    document.querySelectorAll('[data-language]').forEach(btn => {
      const active = btn.dataset.language === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('portfolioLanguage', lang); } catch (_) {}

    // Dynamic UI (calculator, form status, etc.) can refresh its own labels.
    document.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { lang } }));
    // Reveal only after every static text node and translatable attribute has been updated.
    document.documentElement.classList.remove('lang-pending');
  };

  document.querySelectorAll('[data-language]').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.language));
  });
  let savedLanguage = 'en';
  try { savedLanguage = localStorage.getItem('portfolioLanguage') || 'en'; } catch (_) {}
  applyLanguage(savedLanguage);
  document.querySelector('[data-calculator] [name=service]')?.dispatchEvent(new Event('change', { bubbles: true }));

  // Calculator preset chips select the corresponding service without changing other options.
  document.querySelectorAll('[data-preset]').forEach(btn => btn.addEventListener('click', () => {
    const serviceSelect = document.querySelector('[data-calculator] [name="service"]');
    if (serviceSelect) {
      serviceSelect.value = btn.dataset.preset;
      serviceSelect.dispatchEvent(new Event('change', {bubbles:true}));
      document.querySelectorAll('[data-preset]').forEach(item => item.classList.toggle('active', item === btn));
    }
  }));
});
