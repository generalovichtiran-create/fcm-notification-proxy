const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ========== НАСТРОЙКИ PUSHALL ==========
// Замени на свои данные из личного кабинета pushall.ru
const PUSHALL_ID = "6038";           // ← твой ID
const PUSHALL_KEY = "a591d0443241c3bec0caba797b8df723";  // ← твой KEY

// Эндпоинт для отправки уведомления
app.post('/send', async (req, res) => {
    const { title, body } = req.body;
    
    console.log(`📨 Получен запрос: title=${title}, body=${body}`);
    
    try {
        const pushAllData = new URLSearchParams();
        pushAllData.append('type', 'self');
        pushAllData.append('id', PUSHALL_ID);
        pushAllData.append('key', PUSHALL_KEY);
        pushAllData.append('title', title || 'Новое сообщение');
        pushAllData.append('text', body || 'У вас новое сообщение');
        pushAllData.append('url', 'https://officeprojects.ru'); // твой сайт
        
        const response = await fetch('https://pushall.ru/api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: pushAllData
        });
        
        const data = await response.json();
        console.log('PushAll ответ:', data);
        
        if (data.success) {
            res.json({ success: true, message: 'Уведомление отправлено' });
        } else {
            res.json({ success: false, error: data.error });
        }
    } catch (error) {
        console.error('Ошибка:', error);
        res.json({ success: false, error: error.message });
    }
});

// Проверка работы сервера
app.get('/ping', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PushAll proxy running on port ${PORT}`);
});
