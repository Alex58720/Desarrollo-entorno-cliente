import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'html')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'), (err) => {
        if (err) {
            console.error('Error al enviar archivo:', err);
            res.status(404).send('Archivo no encontrado');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
