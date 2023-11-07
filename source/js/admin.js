        let references = []; // Tableau pour stocker les références
        let selectedReference = null;
        let data = {}; // Tableau pour stocker les données
        let minLimit = 0;
        let maxLimit = 10;
        let chart = null;

        document.getElementById('csv-file-input').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                Papa.parse(file, {
                    header: true,
                    dynamicTyping: true,
                    complete: function(results) {
                        data = results.data; // Les données du fichier CSV
                        references = [...new Set(data.map(row => row["Référence"]))]; // Liste des références uniques

                        // Remplissez le menu déroulant avec les références
                        const referenceSelect = document.getElementById('reference-select');
                        references.forEach(reference => {
                            const option = document.createElement('option');
                            option.value = reference;
                            option.textContent = reference;
                            referenceSelect.appendChild(option);
                        });
                    }
                });
            }
        });

        // Fonction pour mettre à jour les limites
        document.getElementById('limits-form').addEventListener('submit', function(event) {
            event.preventDefault();
            minLimit = parseFloat(document.getElementById('min-limit').value);
            maxLimit = parseFloat(document.getElementById('max-limit').value);
        });

        // Afficher le graphique pour la référence sélectionnée
        document.getElementById('show-chart-button').addEventListener('click', function() {
            selectedReference = document.getElementById('reference-select').value;
            if (selectedReference) {
                updateChart();
            } else {
                alert('Sélectionnez une référence pour afficher le graphique.');
            }
        });

        // Mettre à jour le graphique
        document.getElementById('update-chart-button').addEventListener('click', function() {
            if (selectedReference) {
                updateChart();
            } else {
                alert('Sélectionnez une référence pour afficher le graphique.');
            }
        });

        function updateChart() {
            const selectedData = data.filter(row => row["Référence"] === selectedReference);
            const labels = selectedData.map(row => row["Date"]);
            const datasets = [];

            // Boucle pour créer un ensemble de données pour chaque mesure
            for (let i = 1; i <= 10; i++) {
                const measures = selectedData.map(row => row[`Mesure ${i}`]);
                const dataset = {
                    label: `Mesure ${i}`,
                    data: measures,
                    borderColor: getRandomColor(),
                    fill: false
                };
                datasets.push(dataset);
            }

            datasets.push(
                {
                    label: 'Limite Min',
                    data: Array(labels.length).fill(minLimit),
                    borderColor: 'rgb(255, 0, 0)',
                    fill: false,
                    borderDash: [5, 5]
                },
                {
                    label: 'Limite Max',
                    data: Array(labels.length).fill(maxLimit),
                    borderColor: 'rgb(255, 0, 0)',
                    fill: false,
                    borderDash: [5, 5]
                }
            );

            if (chart) {
                chart.destroy(); // Détruit le graphique précédent s'il existe
            }

            const ctx = document.getElementById('chart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }