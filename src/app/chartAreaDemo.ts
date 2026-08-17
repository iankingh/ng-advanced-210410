export function chartAreaDemo() {
  Chart.defaults.global.defaultFontFamily =
    'Nunito, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';
  const numberFormat = (input, decimals?, decimalPoint?, thousandsSeparator?) => {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    input = (input + '').replace(',', '').replace(' ', '');
    const numericValue = !isFinite(+input) ? 0 : +input;
    const precision = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    const separator = typeof thousandsSeparator === 'undefined' ? ',' : thousandsSeparator;
    const decimal = typeof decimalPoint === 'undefined' ? '.' : decimalPoint;
    let parts: any = '';
    const toFixed = (value, digits) => {
      const factor = Math.pow(10, digits);
      return '' + Math.round(value * factor) / factor;
    };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    parts = (precision ? toFixed(numericValue, precision) : '' + Math.round(numericValue)).split('.');
    if (parts[0].length > 3) {
      parts[0] = parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, separator);
    }
    if ((parts[1] || '').length < precision) {
      parts[1] = parts[1] || '';
      parts[1] += new Array(precision - parts[1].length + 1).join('0');
    }
    return parts.join(decimal);
  };
  // Area Chart Example
  const ctx = document.getElementById('myAreaChart');
  const areaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      datasets: [
        {
          label: 'Earnings',
          lineTension: 0.3,
          backgroundColor: 'rgba(78, 115, 223, 0.05)',
          borderColor: 'rgba(78, 115, 223, 1)',
          pointRadius: 3,
          pointBackgroundColor: 'rgba(78, 115, 223, 1)',
          pointBorderColor: 'rgba(78, 115, 223, 1)',
          pointHoverRadius: 3,
          pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
          pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: [
            0,
            10000,
            5000,
            15000,
            10000,
            20000,
            15000,
            25000,
            20000,
            30000,
            25000,
            40000
          ]
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [
          {
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              // Include a dollar sign in the ticks
              callback(value, index, values) {
                return '$' + numberFormat(value);
              }
            },
            gridLines: {
              color: 'rgb(234, 236, 244)',
              zeroLineColor: 'rgb(234, 236, 244)',
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }
        ]
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: 'rgb(255,255,255)',
        bodyFontColor: '#858796',
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label(tooltipItem, chart) {
            const datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': $' + numberFormat(tooltipItem.yLabel);
          }
        }
      }
    }
  });
  return areaChart;
}
