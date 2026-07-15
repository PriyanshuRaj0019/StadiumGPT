document.addEventListener("DOMContentLoaded", () => {
    // Apne setup ke hisab se backend URL adjust karein (e.g., localhost ya render URL)
    const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:8000"
        : "https://stadiumgpt.onrender.com"; // Replace with your production Render backend URL if deployed

    // 1. Initial Empty Data Arrays for Real-time Generation
    const gateLabels = ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E'];
    const initialGateData = [15, 45, 12, 60, 25]; // Simulation initial points in minutes
    
    const foodLabels = ['North Food Plaza', 'South Concession', 'East Lounge', 'West Fast Food'];
    const initialFoodData = [30, 85, 40, 55]; // Capacity percentages

    // 2. Initialize Gate Congestion Bar Chart
    const gateCtx = document.getElementById('gateChart').getContext('2d');
    const gateChart = new Chart(gateCtx, {
        type: 'bar',
        data: {
            labels: gateLabels,
            datasets: [{
                label: 'Wait Time (Minutes)',
                data: initialGateData,
                backgroundColor: 'rgba(52, 211, 153, 0.6)',
                borderColor: 'rgba(52, 211, 153, 1)',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // 3. Initialize Food Court Load Line Chart
    const foodCtx = document.getElementById('foodChart').getContext('2d');
    const foodChart = new Chart(foodCtx, {
        type: 'line',
        data: {
            labels: foodLabels,
            datasets: [{
                label: 'Occupancy Load %',
                data: initialFoodData,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointBackgroundColor: '#f59e0b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { max: 100, beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // 4. Async function to poll backend telemetry endpoint if implemented
    async function updateDashboardTelemetry() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/telemetry`);
            if (response.ok) {
                const data = await response.json();
                
                // Update live text metrics
                if (data.attendance) document.getElementById("stat-attendance").innerText = data.attendance.toLocaleString();
                if (data.avgWaitTime) document.getElementById("stat-wait-time").innerText = `${data.avgWaitTime} mins`;
                if (data.incidents !== undefined) document.getElementById("stat-incidents").innerText = data.incidents;
                if (data.riskLevel) document.getElementById("stat-risk").innerText = data.riskLevel;

                // Dynamic charts updates
                if (data.gateMetrics) {
                    gateChart.data.datasets[0].data = data.gateMetrics;
                    gateChart.update();
                }
                if (data.foodMetrics) {
                    foodChart.data.datasets[0].data = data.foodMetrics;
                    foodChart.update();
                }
            }
        } catch (error) {
            // Fallback: Simulate fluctuation dynamically if backend isn't polling or live yet
            simulateFluctuations();
        }
    }

    function simulateFluctuations() {
        // Gate fluctuations
        const randomizedGates = gateChart.data.datasets[0].data.map(val => Math.max(5, Math.min(90, val + Math.floor(Math.random() * 11) - 5)));
        gateChart.data.datasets[0].data = randomizedGates;
        gateChart.update();

        // Food court fluctuations
        const randomizedFood = foodChart.data.datasets[0].data.map(val => Math.max(10, Math.min(100, val + Math.floor(Math.random() * 15) - 7)));
        foodChart.data.datasets[0].data = randomizedFood;
        foodChart.update();
    }

    // Set polling dynamic intervals (Every 5 Seconds)
    setInterval(updateDashboardTelemetry, 5000);
});