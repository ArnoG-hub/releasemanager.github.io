const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pour sauvegarder les modifications
app.post('/save-change', (req, res) => {
    const { releaseId, type, value } = req.body;

    // Lire le fichier index.html
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Logique pour mettre à jour le contenu du fichier HTML
        // (Ceci est un exemple simple et peut nécessiter des ajustements selon vos besoins)
        let updatedData = data.replace(
            new RegExp(`(<h2>${releaseId}</h2>)([\\s\\S]*?)(<textarea[\\s\\S]*?>)([\\s\\S]*?)(</textarea>)`),
            `$1$2$3${value}$5`
        );

        // Écrire les modifications dans le fichier index.html
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.send('Change saved successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
