// simpleServer.js
import express from 'express';

const app = express();

app.get('/test', (req, res) => {
    res.send('Test endpoint hit');
});

const port = 8000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
