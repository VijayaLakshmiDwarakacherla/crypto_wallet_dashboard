// Initialize mini charts
document.addEventListener('DOMContentLoaded', () => {
    const miniCharts = document.querySelectorAll('.mini-chart');
    miniCharts.forEach(chart => {
        const ctx = chart.getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: Array(20).fill(0).map(() => Math.random() * 100),
                    borderColor: '#FFD700',
                    borderWidth: 2,
                    fill: {
                        target: 'origin',
                        above: 'rgba(255, 215, 0, 0.1)'
                    },
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
});
