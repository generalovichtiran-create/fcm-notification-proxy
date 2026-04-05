const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ========== ТВОИ ДАННЫЕ PUSHALL (SELF API) ==========
const PUSHALL_ID = "159780";
const PUSHALL_KEY = "ad366555718e6de23395ea03ec413ea9";

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

app.get('/ping', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`PushAll proxy running on port ${PORT}`);
});
