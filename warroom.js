// ============================================
// CONTENTMAFIA - MAFIA STYLE JAVASCRIPT
// Elegant interactions for La Famiglia
// ============================================

// === SERVICE DATA ===
const servicesData = {
    promptagg: {
        title: 'PromptAGG Pro',
        description: 'Профессиональный инструмент для управления контентом и генерации AI-промптов. Закрывает весь цикл производства постов от идеи до публикации.',
        price: '1200₽/мес',
        priceValue: 1200,
        features: [
            'Единый календарь и мультипроектность',
            'Умная генерация ТЗ для нейросетей',
            'Idea Vault — хранилище идей',
            'Командная работа в локальной сети',
            'Tone of Voice для каждого бренда',
            'Адаптация под все соцсети'
        ],
        status: 'active',
        connections: ['contenthub', 'ghostwriter']
    },
    slicermafia: {
        title: 'SlicerMafia',
        description: 'Специализированный сервис для глубокой обработки и адаптации контента. Автоматизирует рутину по подготовке материалов к публикации.',
        price: '500₽/мес',
        priceValue: 500,
        features: [
            'Массовая обработка контента',
            'Нарезка под требования платформ',
            'Оптимизация рабочих процессов',
            'Исключение человеческого фактора',
            'Интеграция в общий конвейер',
            'Ускорение пути до публикации'
        ],
        status: 'active',
        connections: ['contenthub', 'vaultkeeper']
    },
    contenthub: {
        title: 'ContentHub',
        description: 'Централизованная рабочая среда и экосистема для цифрового маркетинга. Объединяет все инструменты в единый бесперебойный конвейер.',
        price: '2000₽/мес',
        priceValue: 2000,
        features: [
            'Среда полного цикла производства',
            'Масштабируемая архитектура',
            'Интеграция всех утилит',
            'Фокус на B2B и автоматизацию',
            'Безопасность данных',
            'Промышленные объемы контента'
        ],
        status: 'premium',
        connections: ['promptagg', 'slicermafia', 'ghostwriter', 'vaultkeeper']
    },
    ghostwriter: {
        title: 'GhostWriter',
        description: 'AI-копирайтер нового поколения. Создавай посты, статьи и контент для любых платформ.',
        price: '1500₽/мес',
        priceValue: 1500,
        features: [
            'Генерация постов',
            'Написание статей',
            'Адаптация под бренд',
            'SEO-оптимизация',
            'Проверка уникальности',
            'Мультиязычность'
        ],
        status: 'new',
        connections: ['promptagg', 'contenthub']
    },
    vaultkeeper: {
        title: 'VaultKeeper',
        description: 'Безопасное хранилище для медиа и документов. Шифрование, версионность и быстрый CDN.',
        price: 'Скоро',
        priceValue: null,
        features: [
            'Хранилище 500 ГБ',
            'E2E шифрование',
            'Версионирование',
            'Быстрый CDN',
            'Автобэкап',
            'Интеграция с сервисами'
        ],
        status: 'coming-soon',
        connections: ['slicermafia', 'contenthub']
    },
    analyticsmafia: {
        title: 'AnalyticsMafia',
        description: 'Глубокая аналитика контента и аудитории. Отслеживай эффективность, анализируй тренды, принимай решения на основе данных.',
        price: '1000₽/мес',
        priceValue: 1000,
        features: [
            'Аналитика контента',
            'Отслеживание трендов',
            'Анализ аудитории',
            'Прогнозирование',
            'Кастомные отчеты',
            'Интеграция с платформами'
        ],
        status: 'new',
        connections: ['contenthub', 'ghostwriter']
    }
};

// === STATE ===
let currentTheme = 'light';
let activeService = null;
let canvas = null;
let ctx = null;

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCanvas();
    initServiceCards();
    initModals();
    initForms();
    initSmoothScroll();
    initDevEasterEgg();
    initScrollHeader();

    window.addEventListener('resize', debounce(() => {
        initCanvas();
        drawConnections();
    }, 250));
});

// === SCROLL HEADER ===
function initScrollHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// === THEME MANAGEMENT ===
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('contentmafia-theme') || 'light';

    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('contentmafia-theme', newTheme);
    });
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);

    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '◐' : '◑';
    }

    if (ctx) {
        drawConnections();
    }
}

// === CANVAS FOR CONNECTIONS ===
function initCanvas() {
    canvas = document.getElementById('connectionsCanvas');
    if (!canvas) return;

    const grid = document.querySelector('.services-grid');
    canvas.width = grid.offsetWidth;
    canvas.height = grid.offsetHeight;

    ctx = canvas.getContext('2d');
    drawConnections();
}

function drawConnections() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cards = document.querySelectorAll('.service-card');
    const positions = [];

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const gridRect = canvas.getBoundingClientRect();

        positions.push({
            id: card.getAttribute('data-service'),
            x: rect.left - gridRect.left + rect.width / 2,
            y: rect.top - gridRect.top + rect.height / 2
        });
    });

    positions.forEach(pos1 => {
        const service = servicesData[pos1.id];
        if (!service || !service.connections) return;

        service.connections.forEach(targetId => {
            const pos2 = positions.find(p => p.id === targetId);
            if (!pos2) return;

            drawLine(pos1.x, pos1.y, pos2.x, pos2.y, false);
        });
    });
}

function drawLine(x1, y1, x2, y2, active = false) {
    // RED color for connections
    const color = currentTheme === 'dark'
        ? (active ? 'rgba(139, 0, 0, 0.8)' : 'rgba(139, 0, 0, 0.2)')
        : (active ? 'rgba(139, 0, 0, 0.6)' : 'rgba(139, 0, 0, 0.15)');

    ctx.strokeStyle = color;
    ctx.lineWidth = active ? 3 : 1.5;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const cx = (x1 + x2) / 2 - dy * 0.15;
    const cy = (y1 + y2) / 2 + dx * 0.15;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();
}

function highlightConnections(serviceId) {
    if (!ctx || !canvas) return;

    drawConnections();

    const service = servicesData[serviceId];
    if (!service || !service.connections) return;

    const cards = document.querySelectorAll('.service-card');
    const positions = [];

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const gridRect = canvas.getBoundingClientRect();

        positions.push({
            id: card.getAttribute('data-service'),
            x: rect.left - gridRect.left + rect.width / 2,
            y: rect.top - gridRect.top + rect.height / 2
        });
    });

    const pos1 = positions.find(p => p.id === serviceId);
    if (!pos1) return;

    service.connections.forEach(targetId => {
        const pos2 = positions.find(p => p.id === targetId);
        if (!pos2) return;

        drawLine(pos1.x, pos1.y, pos2.x, pos2.y, true);
    });
}

// === SERVICE CARDS ===
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        const serviceId = card.getAttribute('data-service');

        card.addEventListener('mouseenter', () => {
            highlightConnections(serviceId);
        });

        card.addEventListener('mouseleave', () => {
            if (activeService !== serviceId) {
                drawConnections();
            }
        });

        card.addEventListener('click', () => {
            openServiceModal(serviceId);
        });
    });
}

// === MODALS ===
function initModals() {
    const serviceModal = document.getElementById('serviceModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = serviceModal.querySelector('.modal__overlay');

    modalClose.addEventListener('click', () => closeModal('serviceModal'));
    modalOverlay.addEventListener('click', () => closeModal('serviceModal'));

    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const loginModalClose = document.getElementById('loginModalClose');
    const loginOverlay = loginModal.querySelector('.modal__overlay');

    loginBtn.addEventListener('click', () => openModal('loginModal'));
    loginModalClose.addEventListener('click', () => closeModal('loginModal'));
    loginOverlay.addEventListener('click', () => closeModal('loginModal'));

    const showRegister = document.getElementById('showRegister');
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Регистрация откроется в ближайшее время!');
        });
    }

    const enterpriseBtn = document.getElementById('enterpriseBtn');
    if (enterpriseBtn) {
        enterpriseBtn.addEventListener('click', () => {
            document.getElementById('enterprise').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';

    if (modalId === 'serviceModal') {
        activeService = null;
        drawConnections();
    }
}

function openServiceModal(serviceId) {
    const service = servicesData[serviceId];
    if (!service) return;

    const modalBody = document.getElementById('modalBody');

    const featuresHTML = service.features.map(f =>
        `<li><span class="feature-icon">◆</span> ${f}</li>`
    ).join('');

    const paymentHTML = service.priceValue ? `
        <div class="modal-payment">
            <div class="section-divider"></div>
            <h4>Выбери способ оплаты</h4>
            <div class="payment-methods">
                <div class="payment-method" data-method="card">
                    <div class="payment-method__icon">💳</div>
                    <div class="payment-method__name">Банковская карта</div>
                </div>
                <div class="payment-method" data-method="sbp">
                    <div class="payment-method__icon">📱</div>
                    <div class="payment-method__name">СБП</div>
                </div>
            </div>
            <div id="qrCodeContainer" style="display: none; text-align: center; margin: 2rem 0;">
                <p style="color: var(--text-secondary); margin-bottom: 1rem; font-style: italic;">Отсканируй QR-код для оплаты через СБП</p>
                <div id="qrCode" style="display: inline-block; padding: 1rem; background: white; border: 2px solid var(--accent-red);"></div>
            </div>
            <form class="payment-form" id="paymentForm">
                <div class="form-group">
                    <input type="email" id="paymentEmail" placeholder="Email для получения кода" required>
                </div>
                <button type="submit" class="btn btn--primary btn--full">
                    Оплатить ${service.price}
                </button>
            </form>
        </div>
    ` : `
        <div class="modal-coming-soon">
            <div class="section-divider"></div>
            <p>Этот сервис скоро будет доступен. Следи за обновлениями!</p>
        </div>
    `;

    modalBody.innerHTML = `
        <div class="modal-service">
            <h3>${service.title}</h3>
            <div class="section-divider"></div>
            <p class="modal-service__description">${service.description}</p>
            <div class="modal-service__price">${service.price}</div>
            <h4>Возможности:</h4>
            <ul class="modal-service__features">
                ${featuresHTML}
            </ul>
            ${paymentHTML}
        </div>
    `;

    openModal('serviceModal');
    activeService = serviceId;
    highlightConnections(serviceId);

    if (service.priceValue) {
        initPaymentMethods();
        initPaymentForm(serviceId);
    }
}

// === PAYMENT ===
let selectedPaymentMethod = 'card';

function initPaymentMethods() {
    const methods = document.querySelectorAll('.payment-method');

    methods.forEach(method => {
        method.addEventListener('click', () => {
            methods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            selectedPaymentMethod = method.getAttribute('data-method');

            // Show QR code for SBP
            const qrContainer = document.getElementById('qrCodeContainer');
            if (qrContainer) {
                if (selectedPaymentMethod === 'sbp') {
                    qrContainer.style.display = 'block';
                    generateQRCode();
                } else {
                    qrContainer.style.display = 'none';
                }
            }
        });
    });

    if (methods.length > 0) {
        methods[0].classList.add('active');
    }
}

function initPaymentForm(serviceId) {
    const form = document.getElementById('paymentForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('paymentEmail').value;
        processPayment(serviceId, email, selectedPaymentMethod);
    });
}

function processPayment(serviceId, email, method) {
    const service = servicesData[serviceId];
    const form = document.getElementById('paymentForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.innerHTML = 'Обработка...';
    submitBtn.disabled = true;

    setTimeout(() => {
        const code = generateActivationCode();

        // Save subscription to localStorage
        const subscription = {
            serviceId: serviceId,
            serviceName: service.title,
            price: service.price,
            purchaseDate: Date.now(),
            activationCode: code,
            email: email,
            paymentMethod: method
        };

        let subscriptions = JSON.parse(localStorage.getItem('contentmafia_subscriptions') || '[]');
        subscriptions.push(subscription);
        localStorage.setItem('contentmafia_subscriptions', JSON.stringify(subscriptions));

        showPurchaseSuccess(service, code, email);
    }, 2000);
}

function generateActivationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) code += '-';
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function showPurchaseSuccess(service, code, email) {
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="purchase-success">
            <h3>Оплата успешна!</h3>
            <div class="section-divider"></div>
            <p>Добро пожаловать в семью, ${email.split('@')[0]}</p>

            <div class="activation-code">
                <p class="code-label">Твой код активации:</p>
                <div class="code-value">${code}</div>
                <button class="btn btn--outline btn--sm" onclick="copyToClipboard('${code}')">
                    Скопировать код
                </button>
            </div>

            <div class="success-info">
                <p>Код также отправлен на <strong>${email}</strong></p>
                <h4>Как активировать:</h4>
                <ol>
                    <li>Перейди в ${service.title}</li>
                    <li>Нажми "Активировать подписку"</li>
                    <li>Введи код активации</li>
                    <li>Начни работать!</li>
                </ol>
            </div>

            <button class="btn btn--primary btn--full" onclick="location.reload()">
                Отлично!
            </button>
        </div>
    `;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Код скопирован в буфер обмена!');
    });
}

// === QR CODE GENERATION ===
function generateQRCode() {
    const qrCode = document.getElementById('qrCode');
    if (!qrCode) return;

    // Generate simple QR-like pattern
    const size = 200;
    const cellSize = 10;
    const cells = size / cellSize;

    let html = '<svg width="' + size + '" height="' + size + '" style="display: block;">';

    // Generate random pattern (simulating QR code)
    for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
            // Create QR-like pattern
            const isCorner = (x < 7 && y < 7) || (x >= cells - 7 && y < 7) || (x < 7 && y >= cells - 7);
            const isFilled = isCorner || Math.random() > 0.5;

            if (isFilled) {
                html += '<rect x="' + (x * cellSize) + '" y="' + (y * cellSize) +
                       '" width="' + cellSize + '" height="' + cellSize + '" fill="#000"/>';
            }
        }
    }

    // Add corner markers
    const cornerSize = 70;
    const markerPositions = [
        [0, 0],
        [size - cornerSize, 0],
        [0, size - cornerSize]
    ];

    markerPositions.forEach(([x, y]) => {
        html += '<rect x="' + x + '" y="' + y + '" width="' + cornerSize + '" height="' + cornerSize +
               '" fill="none" stroke="#000" stroke-width="10"/>';
        html += '<rect x="' + (x + 20) + '" y="' + (y + 20) + '" width="30" height="30" fill="#000"/>';
    });

    html += '</svg>';
    html += '<p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">QR-код для оплаты через СБП</p>';

    qrCode.innerHTML = html;
}

// === FORMS ===
function initForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Вход выполнен успешно!');
            closeModal('loginModal');
        });
    }

    const enterpriseForm = document.getElementById('enterpriseForm');
    if (enterpriseForm) {
        enterpriseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Спасибо! Мы свяжемся с вами в течение 24 часов.');
            enterpriseForm.reset();
        });
    }
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// === UTILITIES ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === CONSOLE EASTER EGG ===
console.log('%c🎭 ContentMafia', 'font-size: 32px; font-weight: bold; color: #8B0000;');
console.log('%cLa Famiglia Digitale', 'font-size: 16px; color: #999; font-style: italic;');
console.log('%cИщешь секреты? Попробуй: window.joinMafia()', 'font-size: 12px; color: #666;');

window.joinMafia = function() {
    console.log('%c🎯 Секретный код семьи: FAMIGLIA2026', 'font-size: 18px; color: #8B0000; font-weight: bold;');
    console.log('Используй этот код для получения скидки 30% на любой сервис!');
    console.log('Действителен для членов семьи.');
};

// === DEVELOPER EASTER EGG ===
function initDevEasterEgg() {
    const devLink = document.getElementById('devEasterEgg');
    if (devLink) {
        devLink.addEventListener('click', (e) => {
            e.preventDefault();
            showDevModal();
        });
    }
}

function showDevModal() {
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="dev-easter-egg">
            <h3>🎨 Разработчик</h3>
            <div class="section-divider"></div>

            <div class="dev-info">
                <div class="dev-avatar">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="50" cy="50" r="45"/>
                        <circle cx="50" cy="40" r="15"/>
                        <path d="M20 85 Q50 70 80 85"/>
                        <path d="M35 40 L35 35 M65 40 L65 35"/>
                    </svg>
                </div>

                <h4>MarkVRKS</h4>
                <p class="dev-title">Full-Stack Developer & Designer</p>

                <div class="dev-quote">
                    <p>"Создано с уважением к мафиозному стилю 17-18 века"</p>
                </div>

                <div class="dev-stats">
                    <div class="stat-item">
                        <div class="stat-value">2693</div>
                        <div class="stat-label">Строк кода</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">3</div>
                        <div class="stat-label">Версии дизайна</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">100%</div>
                        <div class="stat-label">Элегантность</div>
                    </div>
                </div>

                <div class="dev-tech">
                    <h5>Технологии:</h5>
                    <div class="tech-tags">
                        <span class="tech-tag">HTML5</span>
                        <span class="tech-tag">CSS3</span>
                        <span class="tech-tag">JavaScript</span>
                        <span class="tech-tag">Canvas API</span>
                        <span class="tech-tag">Google Fonts</span>
                    </div>
                </div>

                <div class="dev-features">
                    <h5>Особенности:</h5>
                    <ul>
                        <li>◆ Элегантные шрифты (Cinzel, Playfair Display)</li>
                        <li>◆ Правильные цвета (красный, черный, белый)</li>
                        <li>◆ Мафиозный стиль 17-18 века</li>
                        <li>◆ Canvas связи между сервисами</li>
                        <li>◆ Две темы (темная и светлая)</li>
                        <li>◆ Полная адаптивность</li>
                    </ul>
                </div>

                <button class="btn btn--primary btn--full" onclick="closeModal('serviceModal')">
                    Респект разработчику! 🎭
                </button>
            </div>
        </div>
    `;

    openModal('serviceModal');
}

// === FORMS ===

// Add CSS for modal elements
const style = document.createElement('style');
style.textContent = `
    .modal-service__description {
        color: var(--text-secondary);
        margin: 2rem 0;
        line-height: 1.8;
        font-size: 1.1rem;
        text-align: center;
    }

    .modal-service__price {
        font-family: var(--font-display);
        font-size: 3rem;
        font-weight: 700;
        color: var(--accent-red);
        text-align: center;
        margin: 2rem 0;
    }

    .modal-service__features {
        list-style: none;
        margin: 2rem 0;
    }

    .modal-service__features li {
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .modal-payment {
        margin-top: 2rem;
    }

    .modal-payment h4 {
        font-family: var(--font-display);
        font-size: 1.5rem;
        margin: 2rem 0 1.5rem;
        text-align: center;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .payment-methods {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .payment-method {
        padding: 1.5rem;
        background: var(--bg-primary);
        border: 2px solid var(--border-color);
        text-align: center;
        cursor: pointer;
        transition: all var(--transition);
    }

    .payment-method:hover,
    .payment-method.active {
        border-color: var(--accent-red);
        background: rgba(139, 0, 0, 0.1);
    }

    .payment-method__icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .payment-method__name {
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-primary);
    }

    .modal-coming-soon {
        text-align: center;
        padding: 2rem 0;
    }

    .modal-coming-soon p {
        color: var(--text-secondary);
        margin: 2rem 0;
        font-size: 1.1rem;
        font-style: italic;
    }

    .purchase-success {
        text-align: center;
    }

    .purchase-success h3 {
        margin-bottom: 1rem;
    }

    .purchase-success > p {
        color: var(--text-secondary);
        margin: 2rem 0;
        font-style: italic;
    }

    .activation-code {
        background: var(--bg-primary);
        border: 2px solid var(--accent-red);
        padding: 2rem;
        margin: 2rem 0;
    }

    .code-label {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        font-style: italic;
    }

    .code-value {
        font-family: 'Courier New', monospace;
        font-size: 1.75rem;
        font-weight: bold;
        color: var(--accent-red);
        letter-spacing: 0.1em;
        margin: 1rem 0;
    }

    .success-info {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        padding: 1.5rem;
        margin: 2rem 0;
        text-align: left;
    }

    .success-info p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }

    .success-info h4 {
        font-family: var(--font-display);
        font-size: 1.2rem;
        margin-bottom: 1rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .success-info ol {
        color: var(--text-secondary);
        padding-left: 1.5rem;
    }

    .success-info ol li {
        margin-bottom: 0.5rem;
        line-height: 1.6;
    }

    .dev-easter-egg {
        text-align: center;
    }

    .dev-info {
        padding: 2rem 0;
    }

    .dev-avatar {
        width: 120px;
        height: 120px;
        margin: 0 auto 1.5rem;
        color: var(--accent-red);
    }

    .dev-avatar svg {
        width: 100%;
        height: 100%;
    }

    .dev-info h4 {
        font-family: var(--font-display);
        font-size: 2rem;
        margin-bottom: 0.5rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .dev-title {
        color: var(--text-secondary);
        font-style: italic;
        margin-bottom: 2rem;
    }

    .dev-quote {
        background: var(--bg-primary);
        border-left: 3px solid var(--accent-red);
        border-right: 3px solid var(--accent-red);
        padding: 1.5rem;
        margin: 2rem 0;
    }

    .dev-quote p {
        color: var(--text-secondary);
        font-style: italic;
        font-size: 1.1rem;
    }

    .dev-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin: 2rem 0;
    }

    .stat-item {
        text-align: center;
    }

    .stat-value {
        font-family: var(--font-display);
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--accent-red);
        margin-bottom: 0.5rem;
    }

    .stat-label {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .dev-tech, .dev-features {
        text-align: left;
        margin: 2rem 0;
        background: var(--bg-primary);
        padding: 1.5rem;
        border: 1px solid var(--border-color);
    }

    .dev-tech h5, .dev-features h5 {
        font-family: var(--font-display);
        font-size: 1.2rem;
        margin-bottom: 1rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tech-tag {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        font-size: 0.9rem;
    }

    .dev-features ul {
        list-style: none;
    }

    .dev-features li {
        padding: 0.5rem 0;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);

// ============================================
// SCROLL ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer для анимаций при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = entry.target.style.animation || 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми элементами с классом animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Добавляем класс animate-on-scroll к карточкам команды
    document.querySelectorAll('.team-card').forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        if (index > 0) {
            card.classList.add(`delay-${index}`);
        }
    });

    // Плавное появление секций
    document.querySelectorAll('.section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.05 });
            
            sectionObserver.observe(section);
        }, 100);
    });
});
