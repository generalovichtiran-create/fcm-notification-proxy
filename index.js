const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ЭТОТ КЛЮЧ МЫ ЗАМЕНИМ ПОЗЖЕ!
const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;

app.post('/send', async (req, res) => {
    const { title, body, token } = req.body;
    if (!token) {
        return res.json({ success: false, error: 'Missing token' });
    }
    try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${FCM_SERVER_KEY}`
            },
            body: JSON.stringify({
                to: token,
                notification: {
                    title: title || 'Новое сообщение',
                    body: body || 'У вас новое сообщение',
                }
            })
        });
        const data = await response.json();
        res.json({ success: true, data });
    } catch (error) {
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
