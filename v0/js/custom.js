// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();


// isotope js
$(window).on('load', function () {
    $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        })
    });

    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    })
});


//Create fields and export data
let data = []; 
let article_selected;
const MAX_FIELDS = 5;

if (document.querySelector('input[name="radio-article"]')) {
  document.querySelectorAll('input[name="radio-article"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
      article_selected= event.target.value;
      showArticleSelected(); 
      createMeasureFields(article_selected);
      console.log("value"+this.value);

      document.getElementById('measures-box').scrollIntoView()
      document.getElementById("preview-piece-measures-img").innerHTML = "<img src='images/"+this.value+".jpeg' alt='preview piece'/>"
    });
  });
}

// Get article selected
function showArticleSelected() {
    document.querySelector("#article-selected").innerHTML = article_selected;
}



function createMeasureFields(piece) {
    const measuresContainer = document.getElementById('measures-container');
    measuresContainer.innerHTML = ''; // Nettoie les anciens champs
    console.log("enter create Measure Fields");

    for (let i = 1; i <= MAX_FIELDS; i++) {
        const measureField = document.createElement('input');
        measureField.type = 'text';
        measureField.name = piece + '_measure_' + i;
        measureField.placeholder = 'Mesure ' + i;
        measuresContainer.appendChild(measureField);
        console.log("create measure"+i);
    }
}

document.getElementById('measure-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let piece = article_selected??null;
    const measures = {};

    for (let i = 1; i <= MAX_FIELDS; i++) {
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

