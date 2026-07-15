document.addEventListener("DOMContentLoaded", () => {
    fetchDashboardData();
});

async function fetchDashboardData() {
    try {
        // FIXED: Added /api to the route
        const data = await api.get("/api/dashboard");
        
        // 1. Update AI Insight Banner
        const aiTextEl = document.getElementById("ai-insight-text");
        aiTextEl.textContent = data.ai_insight;

        // 2. Update Top Metric Cards
        const telemetry = data.telemetry;
        document.getElementById("metric-attendance").textContent = telemetry.total_attendance.toLocaleString();
        document.getElementById("metric-capacity").textContent = Math.round((telemetry.total_attendance / telemetry.max_capacity) * 100) + "%";
        document.getElementById("metric-queue").textContent = telemetry.average_queue_time_mins + "m";

        // 3. Render Charts
        renderGateChart(telemetry.gates);
        renderFoodCourtChart(telemetry.food_courts);

    } catch (error) {
        console.error("Dashboard failed to load:", error);
        document.getElementById("ai-insight-text").textContent = "Failed to load real-time intelligence. Please check backend connection.";
    }
}

// Global Chart defaults for Dark Theme
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";

function renderGateChart(gates) {
    const ctx = document.getElementById('gateChart').getContext('2d');
    const labels = gates.map(g => g.name);
    const data = gates.map(g => g.occupancy_percent);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gate Occupancy (%)',
                data: data,
                backgroundColor: 'rgba(0, 242, 254, 0.6)',
                borderColor: '#00f2fe',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function renderFoodCourtChart(foodCourts) {
    const ctx = document.getElementById('foodChart').getContext('2d');
    const labels = foodCourts.map(fc => fc.name);
    const data = foodCourts.map(fc => fc.wait_time_mins);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)', // Green (Quiet)
                    'rgba(245, 158, 11, 0.7)', // Yellow (Moderate)
                    'rgba(239, 68, 68, 0.7)'   // Red (Busy)
                ],
                borderColor: '#1e293b',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}
