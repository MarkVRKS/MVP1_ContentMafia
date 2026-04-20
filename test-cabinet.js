// Тестовый скрипт для добавления подписок в localStorage
// Запусти в консоли браузера для тестирования кабинета

const testSubscriptions = [
    {
        serviceId: 'slicermafia',
        serviceName: 'SlicerMafia',
        price: '500₽/мес',
        purchaseDate: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 дней назад
        activationCode: 'TEST-ABCD-1234-EFGH',
        email: 'test@contentmafia.ru',
        paymentMethod: 'card'
    },
    {
        serviceId: 'ghostwriter',
        serviceName: 'GhostWriter',
        price: '1500₽/мес',
        purchaseDate: Date.now() - (15 * 24 * 60 * 60 * 1000), // 15 дней назад
        activationCode: 'TEST-WXYZ-5678-IJKL',
        email: 'test@contentmafia.ru',
        paymentMethod: 'sbp'
    },
    {
        serviceId: 'contenthub',
        serviceName: 'ContentHub',
        price: '2000₽/мес',
        purchaseDate: Date.now() - (35 * 24 * 60 * 60 * 1000), // 35 дней назад (истекла)
        activationCode: 'TEST-MNOP-9012-QRST',
        email: 'test@contentmafia.ru',
        paymentMethod: 'card'
    }
];

localStorage.setItem('contentmafia_subscriptions', JSON.stringify(testSubscriptions));
console.log('✅ Тестовые подписки добавлены!');
console.log('Теперь открой кабинет и увидишь:');
console.log('- SlicerMafia (осталось 25 дней)');
console.log('- GhostWriter (осталось 15 дней)');
console.log('- ContentHub (истекла)');
