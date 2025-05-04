document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    // Generate sample data
    const labels = [];
    const prices = [];
    let currentPrice = 52000;
    
    for (let i = 0; i < 100; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (100 - i));
        labels.push(date.toLocaleDateString());
        
        // Simulate price movements
        currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.02);
        prices.push(currentPrice);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'BTC/USD',
                data: prices,
                borderColor: '#FFD700',
                borderWidth: 2,
                fill: {
                    target: 'origin',
                    above: 'rgba(255, 215, 0, 0.1)'
                },
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#FFD700',
                pointHoverBorderColor: '#FFFFFF',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    titleFont: {
                        size: 14,
                        weight: 'bold',
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 12,
                        family: 'Inter'
                    },
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#808080',
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
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
                        color: '#808080',
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        callback: (value) => {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            }
        }
    });
    
    // Time range buttons
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Chart type buttons
    const chartTypeButtons = document.querySelectorAll('.chart-type-btn');
    chartTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chartTypeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Order book buttons
    const orderBookButtons = document.querySelectorAll('.order-book-btn');
    orderBookButtons.forEach(button => {
        button.addEventListener('click', () => {
            orderBookButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});
