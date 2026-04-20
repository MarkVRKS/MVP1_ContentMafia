// ============================================
// CONTENTMAFIA - PAYMENT & CODE SYSTEM
// Система оплаты и выдачи кодов активации
// ============================================

/**
 * Это демонстрационный файл, показывающий как можно реализовать
 * реальную систему оплаты и выдачи кодов для ContentMafia
 */

// === DATABASE SCHEMA (пример для MongoDB/PostgreSQL) ===

/*
USERS TABLE:
- id: UUID
- email: string
- password_hash: string
- created_at: timestamp
- subscriptions: array of subscription_ids

SUBSCRIPTIONS TABLE:
- id: UUID
- user_id: UUID
- service_id: string (promptagg, slicermafia, etc.)
- activation_code: string
- status: enum (pending, active, expired, cancelled)
- payment_method: enum (card, sbp)
- amount: number
- created_at: timestamp
- expires_at: timestamp
- payment_id: string (from payment provider)

SERVICES TABLE:
- id: string
- name: string
- price: number
- billing_period: enum (monthly, yearly)
- features: json
- status: enum (active, coming_soon, deprecated)
*/

// === PAYMENT INTEGRATION ===

/**
 * Интеграция с платежными системами
 * Рекомендуемые провайдеры для России:
 * - ЮKassa (Яндекс.Касса)
 * - CloudPayments
 * - Тинькофф Эквайринг
 * - Сбербанк Эквайринг
 */

class PaymentService {
    constructor(apiKey, secretKey) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.baseURL = 'https://api.payment-provider.ru/v1';
    }

    /**
     * Создание платежа
     */
    async createPayment(data) {
        const payment = {
            amount: data.amount,
            currency: 'RUB',
            description: `Подписка на ${data.serviceName}`,
            customer_email: data.email,
            payment_method: data.method, // 'card' or 'sbp'
            return_url: 'https://contentmafia.ru/payment/success',
            metadata: {
                service_id: data.serviceId,
                user_id: data.userId
            }
        };

        // Отправка запроса к платежному провайдеру
        const response = await fetch(`${this.baseURL}/payments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payment)
        });

        return await response.json();
    }

    /**
     * Проверка статуса платежа
     */
    async checkPaymentStatus(paymentId) {
        const response = await fetch(`${this.baseURL}/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });

        return await response.json();
    }

    /**
     * Webhook для получения уведомлений о платежах
     */
    async handleWebhook(webhookData, signature) {
        // Проверка подписи webhook
        const isValid = this.verifySignature(webhookData, signature);

        if (!isValid) {
            throw new Error('Invalid webhook signature');
        }

        // Обработка события
        if (webhookData.event === 'payment.succeeded') {
            await this.activateSubscription(webhookData.payment);
        }

        return { status: 'ok' };
    }

    verifySignature(data, signature) {
        // Проверка HMAC подписи
        const crypto = require('crypto');
        const hash = crypto
            .createHmac('sha256', this.secretKey)
            .update(JSON.stringify(data))
            .digest('hex');

        return hash === signature;
    }

    async activateSubscription(paymentData) {
        const { service_id, user_id } = paymentData.metadata;

        // Генерация кода активации
        const activationCode = this.generateActivationCode();

        // Сохранение подписки в БД
        await this.saveSubscription({
            userId: user_id,
            serviceId: service_id,
            activationCode: activationCode,
            status: 'active',
            paymentId: paymentData.id,
            amount: paymentData.amount,
            paymentMethod: paymentData.payment_method
        });

        // Отправка email с кодом
        await this.sendActivationEmail(paymentData.customer_email, activationCode, service_id);

        return activationCode;
    }

    generateActivationCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';

        for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) code += '-';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return code;
    }

    async saveSubscription(data) {
        // Пример для PostgreSQL
        const query = `
            INSERT INTO subscriptions
            (user_id, service_id, activation_code, status, payment_id, amount, payment_method, created_at, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW() + INTERVAL '1 month')
            RETURNING *
        `;

        // Выполнение запроса к БД
        // const result = await db.query(query, [data.userId, data.serviceId, ...]);

        console.log('Subscription saved:', data);
    }

    async sendActivationEmail(email, code, serviceId) {
        // Интеграция с email-сервисом (SendGrid, Mailgun, etc.)
        const emailData = {
            to: email,
            subject: '🎭 Твой код активации ContentMafia',
            html: this.getEmailTemplate(code, serviceId)
        };

        // Отправка email
        console.log('Email sent to:', email);
    }

    getEmailTemplate(code, serviceId) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; }
                    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo { font-size: 48px; }
                    .code-box {
                        background-color: #2a2020;
                        border: 2px dashed #dc143c;
                        padding: 30px;
                        text-align: center;
                        border-radius: 8px;
                        margin: 30px 0;
                    }
                    .code {
                        font-size: 24px;
                        font-weight: bold;
                        color: #dc143c;
                        letter-spacing: 2px;
                        font-family: monospace;
                    }
                    .button {
                        display: inline-block;
                        background-color: #dc143c;
                        color: white;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 4px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">🎭</div>
                        <h1>Добро пожаловать в семью!</h1>
                    </div>

                    <p>Поздравляем! Твоя оплата прошла успешно.</p>

                    <div class="code-box">
                        <p style="margin-bottom: 10px; color: #cccccc;">Твой код активации:</p>
                        <div class="code">${code}</div>
                    </div>

                    <h3>Как активировать:</h3>
                    <ol>
                        <li>Перейди в сервис ${serviceId}</li>
                        <li>Нажми "Активировать подписку"</li>
                        <li>Введи код активации</li>
                        <li>Начни работать!</li>
                    </ol>

                    <div style="text-align: center;">
                        <a href="https://contentmafia.ru/activate" class="button">Активировать сейчас</a>
                    </div>

                    <hr style="margin: 40px 0; border-color: #3a3a3a;">

                    <p style="color: #888888; font-size: 14px;">
                        Если у тебя возникли вопросы, свяжись с нами:<br>
                        Email: boss@contentmafia.ru<br>
                        Telegram: @ContentMafiaBot
                    </p>
                </div>
            </body>
            </html>
        `;
    }
}

// === CODE VALIDATION SERVICE ===

class CodeValidationService {
    /**
     * Проверка и активация кода
     */
    async validateAndActivate(code, userId) {
        // Поиск кода в БД
        const subscription = await this.findSubscriptionByCode(code);

        if (!subscription) {
            return { success: false, error: 'Код не найден' };
        }

        if (subscription.status === 'active' && subscription.user_id !== userId) {
            return { success: false, error: 'Код уже активирован другим пользователем' };
        }

        if (subscription.expires_at < new Date()) {
            return { success: false, error: 'Код истек' };
        }

        // Активация подписки
        await this.activateCode(subscription.id, userId);

        return {
            success: true,
            subscription: {
                serviceId: subscription.service_id,
                expiresAt: subscription.expires_at
            }
        };
    }

    async findSubscriptionByCode(code) {
        // Запрос к БД
        const query = `
            SELECT * FROM subscriptions
            WHERE activation_code = $1
        `;

        // const result = await db.query(query, [code]);
        // return result.rows[0];

        console.log('Finding subscription by code:', code);
        return null;
    }

    async activateCode(subscriptionId, userId) {
        const query = `
            UPDATE subscriptions
            SET status = 'active', user_id = $1, activated_at = NOW()
            WHERE id = $2
        `;

        // await db.query(query, [userId, subscriptionId]);

        console.log('Code activated for user:', userId);
    }
}

// === API ENDPOINTS (Express.js example) ===

/*
const express = require('express');
const app = express();

const paymentService = new PaymentService(
    process.env.PAYMENT_API_KEY,
    process.env.PAYMENT_SECRET_KEY
);

const codeService = new CodeValidationService();

// Создание платежа
app.post('/api/payments/create', async (req, res) => {
    try {
        const { serviceId, email, method } = req.body;

        const payment = await paymentService.createPayment({
            serviceId,
            email,
            method,
            amount: getServicePrice(serviceId),
            serviceName: getServiceName(serviceId),
            userId: req.user.id
        });

        res.json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Webhook для платежей
app.post('/api/payments/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-webhook-signature'];
        await paymentService.handleWebhook(req.body, signature);
        res.json({ status: 'ok' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Проверка статуса платежа
app.get('/api/payments/:id/status', async (req, res) => {
    try {
        const status = await paymentService.checkPaymentStatus(req.params.id);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Активация кода
app.post('/api/codes/activate', async (req, res) => {
    try {
        const { code } = req.body;
        const result = await codeService.validateAndActivate(code, req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Получение активных подписок пользователя
app.get('/api/subscriptions', async (req, res) => {
    try {
        const subscriptions = await getUserSubscriptions(req.user.id);
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('ContentMafia API running on port 3000');
});
*/

// === FRONTEND INTEGRATION ===

/**
 * Пример интеграции с фронтендом
 */

class ContentMafiaAPI {
    constructor(baseURL) {
        this.baseURL = baseURL || 'https://api.contentmafia.ru';
    }

    async createPayment(serviceId, email, method) {
        const response = await fetch(`${this.baseURL}/api/payments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({ serviceId, email, method })
        });

        return await response.json();
    }

    async checkPaymentStatus(paymentId) {
        const response = await fetch(`${this.baseURL}/api/payments/${paymentId}/status`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        });

        return await response.json();
    }

    async activateCode(code) {
        const response = await fetch(`${this.baseURL}/api/codes/activate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({ code })
        });

        return await response.json();
    }

    async getSubscriptions() {
        const response = await fetch(`${this.baseURL}/api/subscriptions`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        });

        return await response.json();
    }

    getToken() {
        return localStorage.getItem('contentmafia_token');
    }
}

// === EXPORT ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PaymentService,
        CodeValidationService,
        ContentMafiaAPI
    };
}
