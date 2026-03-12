import app from './src/app.js';

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Transaction Service démarré sur http://localhost:${PORT}`);
});