const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Данные из вашего Firebase проекта
const projectId = 'simplechat-a90ac';
// Ваш серверный ключ (читается из переменной окружения)
const accessToken = process.env.FCM_SERVER_KEY;

// Функция для отправки уведомления через HTTP v1 API
async function sendFcmV1(title, body, token) {
    const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    const message = {
        message: {
            token: token,
            notification: {
                title: title,
                body: body
            },
            android: {
                priority: "high",
                notification: {
                    click_action: "FLUTTER_NOTIFICATION_CLICK"
                }
            }
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(message)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || 'Unknown FCM error');
    }
    return data;
}

app.post('/send', async (req, res) => {
    const { title, body, token } = req.body;

    if (!token) {
        return res.json({ success: false, error: 'Missing token' });
    }

    try {
        const result = await sendFcmV1(title, body, token);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error("FCM Error:", error);
        res.json({ success: false, error: error.message });
    }
});

app.get('/ping', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`FCM proxy running on port ${PORT}`);
});
