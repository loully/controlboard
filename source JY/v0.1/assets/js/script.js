let data = []; // Tableau pour stocker les données

document.getElementById('piece').addEventListener('change', function() {
    createMeasureFields();
});

function createMeasureFields() {
    const piece = document.getElementById('piece').value;
    const measuresContainer = document.getElementById('measures-container');
    measuresContainer.innerHTML = ''; // Nettoie les anciens champs

    for (let i = 1; i <= 10; i++) {
        const measureField = document.createElement('input');
        measureField.type = 'text';
        measureField.name = piece + '_measure_' + i;
        measureField.placeholder = 'Mesure ' + i;
        measuresContainer.appendChild(measureField);
    }
}

document.getElementById('measure-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const piece = document.getElementById('piece').value;
    const measures = {};

    for (let i = 1; i <= 10; i++) {
        const measureField = document.getElementsByName(piece + '_measure_' + i)[0];
        measures['Mesure ' + i] = measureField.value;
    }

    // Obtenez la date et l'heure actuelles
    const currentTime = new Date();

    // Créez un objet de données JSON
    const dataObject = {
        reference: piece,
        measures: measures,
        date: currentTime.toLocaleDateString(), // Date
        time: currentTime.toLocaleTimeString() // Heure
    };

    // Ajoutez l'objet au tableau de données
    data.push(dataObject);

    // Affichez un message de confirmation
    alert('Mesures de la référence "' + piece + '" enregistrées avec la date et l\'heure.');

    // Réinitialisez les champs de mesure
    createMeasureFields();
});

document.getElementById('export-button').addEventListener('click', function() {
    // Convertissez le tableau de données en format JSON
    const jsonData = JSON.stringify(data);

    // Créez un objet Blob avec le JSON
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Créez un objet URL pour le Blob
    const url = URL.createObjectURL(blob);

    // Créez un élément <a> pour le téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mesures.json';

    // Cliquez sur l'élément <a> pour lancer le téléchargement
    a.click();

    // Libérez la ressource URL
    URL.revokeObjectURL(url);
});

document.getElementById('generate-csv-button').addEventListener('click', function() {
    // Vérifiez s'il y a des données à convertir en CSV
    if (data.length === 0) {
        alert('Aucune donnée à convertir en CSV.');
        return;
    }

    // Créez un tableau CSV en utilisant les données
    let csvData = 'Référence,';
    for (let i = 1; i <= 10; i++) {
        csvData += 'Mesure ' + i + ',';
    }
    csvData += 'Date,Heure\n';

    for (const entry of data) {
        csvData += entry.reference + ',';
        for (let i = 1; i <= 10; i++) {
            csvData += entry.measures['Mesure ' + i] + ',';
        }
        csvData += entry.date + ',' + entry.time + '\n';
    }

    // Créez un objet Blob avec le CSV
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Créez un objet URL pour le Blob
    const url = URL.createObjectURL(blob);

    // Créez un élément <a> pour le téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mesures.csv';

    // Cliquez sur l'élément <a> pour lancer le téléchargement
    a.click();

    // Libérez la ressource URL
    URL.revokeObjectURL(url);
});

