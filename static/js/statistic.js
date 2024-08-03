
function init_statistik_chart()
{


  try{
    main_data["charts"]["stats"]["1"].destroy();
    main_data["charts"]["stats"]["2"].destroy();
  }catch{

  }
            
        // Funktion zur Berechnung der Wahrscheinlichkeitsdichtefunktion einer Normalverteilung
        function normalDensity(x, mean, stdDev) {
            return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        }

        // Daten für den Funktionsgraphen der Normalverteilung generieren
        function generateNormalCurveData(mean, stdDev) {
            const data = [];
            const labels = [];
            for (let x = mean - 3 * stdDev; x <= mean + 3 * stdDev; x += 0.05) {
                labels.push(x.toFixed(2));
                data.push(normalDensity(x, mean, stdDev));
            }
            return { labels, data };
        }

        const mean = 0; // Mittelwert
        const stdDev = 1; // Standardabweichung
        const curveData = generateNormalCurveData(mean, stdDev);

        // Chart zeichnen
        const ctx = document.getElementById('statChart2').getContext('2d');
        main_data["charts"]["stats"]["2"] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: curveData.labels,
                datasets: [{
                    label: 'Normalverteilung',
                    data: curveData.data,
                    borderColor:'rgba(255, 99, 132, 0.8)',
                    // backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    // borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 6,
                    pointRadius: 0 
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    annotation: {
                        annotations: {
                            line1: {
                            type: 'line',
                            xMin: '-0.70',
                            xMax: '-0.70',
                            borderColor: 'green',  // Farbe der Linie
                            borderWidth: 10,  // Dicke der Linie
                            label: {
                            enabled: true,
                            content: 'end value'
                            }
                        }
                        }
                    },
                    legend: {
                        display: false
                     },
                    title: {
                      display: true,
                      text: "Vergleich Kosten"
                    }
                }
            }
        });

const DATA_COUNT = 5;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

// get values


var costs = main_data["table_storage"].material[0]["Kosten[€]"]
var CO2 = main_data["table_storage"].material[0]["CO2[t]"]

var costValues = [costs, costs*1.25]
var co2Values = [CO2, CO2*0.87]
var labels = ["Projekt", "Andere"]


// Ändern des Textes
const costTitle = 'Vergleich Kosten'
const co2Title = 'Vergleich CO2'
// const co2Title = co2Span.innerHTML.replace("$CO2$", C02)

const costData = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: costValues,
      }
    ]
  };
const co2Data = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: co2Values,
      }
    ]
  };
const configCost = {
        type: 'bar',
        data: costData,
        options: {
          responsive: true,
          plugins: {
            legend: {
                display: false
             },
            title: {
              display: true,
              text: costTitle
            }
          }
        },
      };
const configCO2 = {
        type: 'bar',
        data: co2Data,
        options: {
          responsive: true,
          plugins: {
            legend: {
                display: false
             },
            title: {
              display: true,
              text: co2Title
            }
          }
        },
      };

var ctx1 = document.getElementById('statChart1').getContext('2d');
// var ctx2 = document.getElementById('statChart2').getContext('2d');
main_data["charts"]["stats"]["1"]= new Chart(ctx1, configCost);
// const chart2= new Chart(ctx2, configCO2);
}
function init_chart()
{

    try{
        main_data["charts"]["cost"].destroy();
        main_data["charts"]["co2"].destroy();
    }catch{

    }

const DATA_COUNT = 5;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

// get values
var labels = []
var costValues = []
var co2Values = []
var mats = main_data["table_storage"].material[0]._children
for (let i = 0; i < mats.length; i++) {
    costValues.push(main_data["table_storage"].material[0]._children[i]["Kosten[€]"])
    co2Values.push(main_data["table_storage"].material[0]._children[i]["CO2[t]"])
    labels.push(main_data["table_storage"].material[0]._children[i]["Material"])
}


var costs = main_data["table_storage"].material[0]["Kosten[€]"]
var C02 = main_data["table_storage"].material[0]["CO2[t]"]

// Ändern des Textes
const costTitle = costs + '€'
const co2Title = C02 + 't CO2'
// const co2Title = co2Span.innerHTML.replace("$CO2$", C02)

// <block:plugin:0>
const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'row';
    listContainer.style.margin = 0;
    listContainer.style.padding = 0;

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart, args, options) {
    const ul = getOrCreateLegendList(chart, options.containerID);

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach(item => {
      const li = document.createElement('li');
      li.style.alignItems = 'center';
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.flexDirection = 'row';
      li.style.marginLeft = '10px';

      li.onclick = () => {
        const {type} = chart.config;
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement('span');
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + 'px';
      boxSpan.style.display = 'inline-block';
      boxSpan.style.flexShrink = 0;
      boxSpan.style.height = '20px';
      boxSpan.style.marginRight = '10px';
      boxSpan.style.width = '20px';

      // Text
      const textContainer = document.createElement('p');
      textContainer.style.color = item.fontColor;
      textContainer.style.margin = 0;
      textContainer.style.padding = 0;
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  }
};
// </block:plugin>

const costData = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: costValues,
      }
    ]
  };
const co2Data = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: co2Values,
      }
    ]
  };

  const LEGEND_SIZE = 8;
  const configCost = {
    type: 'pie',
    data: costData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',  // Position the legend on the left
          labels: {
              font: {
                  size: LEGEND_SIZE // Adjust font size for legend labels (example size, adjust as needed)
              }
          },
          datalabels: {
            color: '#000000',
            textAlign: 'center',
            font: {
                weight: 'bold'
            },
            formatter: (value, context) => {
                return context.chart.data.labels[context.dataIndex] + '\n' + value;
            }
        }
       },
        title: {
          display: true,
          text: costTitle
        }
      }
    },
  };

const configCO2 = {
        type: 'pie',
        data: co2Data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',  // Position the legend on the left
              labels: {
                  font: {
                      size: LEGEND_SIZE // Adjust font size for legend labels (example size, adjust as needed)
                  }
              }
           },
            title: {
              display: true,
              text: co2Title
            }
          }
        },
      };
var ctx1 = document.getElementById('myChart1').getContext('2d');
var ctx2 = document.getElementById('myChart2').getContext('2d');


main_data["charts"]["cost"] = new Chart(ctx1, configCost);
main_data["charts"]["co2"] = new Chart(ctx2, configCO2);



}

