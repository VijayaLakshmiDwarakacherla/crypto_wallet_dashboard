document.addEventListener('DOMContentLoaded', () => {
    // Initialize mini charts
    const cryptoCharts = document.querySelectorAll('.crypto-chart');
    cryptoCharts.forEach(chart => {
        const ctx = chart.getContext('2d');
        const color = chart.dataset.color;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: Array(20).fill(0).map(() => Math.random() * 100),
                    borderColor: color,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                }
            }
        });
    });

    // Initialize main chart
    const mainChartCtx = document.getElementById('mainChart').getContext('2d');
    const mainChart = new Chart(mainChartCtx, {
        type: 'line',
        data: {
            labels: Array(24).fill('').map((_, i) => `20:${i.toString().padStart(2, '0')}`),
            datasets: [{
                label: 'Bitcoin Price',
                data: Array(24).fill(0).map(() => Math.random() * 20000 + 30000),
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888888',
                        maxRotation: 0
                    }
                },
                y: {
                    position: 'right',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888888',
                        callback: value => `$${value.toLocaleString()}`
                    }
                }
            }
        }
    });
});
