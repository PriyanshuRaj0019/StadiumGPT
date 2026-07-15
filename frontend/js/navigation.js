document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Leaflet Map (Centered on MetLife Stadium area)
    const map = L.map('stadium-map').setView([40.8136, -74.0744], 16);

    // Premium Dark Theme Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19
    }).addTo(map);

    let currentRouteLine = null;
    let markers = [];

    const startSelect = document.getElementById("start-location");
    const destSelect = document.getElementById("dest-location");
    const navForm = document.getElementById("nav-form");
    const resultCard = document.getElementById("route-result");
    const timeDisplay = document.getElementById("route-time");
    const aiTextDisplay = document.getElementById("route-ai-text");

    // 2. Fetch Locations from Backend to populate Dropdowns
    async function loadLocations() {
        try {
            // FIXED: Added /api to the route
            const data = await api.get("/api/locations");
            data.locations.forEach(loc => {
                const opt1 = new Option(loc, loc);
                const opt2 = new Option(loc, loc);
                startSelect.add(opt1);
                destSelect.add(opt2);
            });
        } catch (error) {
            console.error("Failed to load locations", error);
        }
    }

    // 3. Handle Form Submission & Routing
    navForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const start = startSelect.value;
        const dest = destSelect.value;

        if (start === dest) {
            alert("Start and destination must be different.");
            return;
        }

        const btn = document.querySelector(".btn-navigate");
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Calculating...`;

        try {
            // FIXED: Added /api to the route
            const data = await api.post("/api/navigate", { start: start, destination: dest });
            
            // Draw Route on Map
            drawRouteOnMap(data.path, data.start, data.destination);

            // Update UI Sidebar
            timeDisplay.textContent = `~${data.estimated_time_minutes} mins`;
            aiTextDisplay.textContent = data.ai_suggestion;
            resultCard.style.display = "block";
            
        } catch (error) {
            alert("Error calculating route. Please try again.");
        } finally {
            btn.innerHTML = `<i class="fas fa-route"></i> Find Best Route`;
        }
    });

    // 4. Utility to draw path on Leaflet
    function drawRouteOnMap(latlngs, startName, destName) {
        // Clear previous routes/markers
        if (currentRouteLine) map.removeLayer(currentRouteLine);
        markers.forEach(m => map.removeLayer(m));
        markers = [];

        // Draw new polyline with glowing electric cyan color
        currentRouteLine = L.polyline(latlngs, { 
            color: '#00f2fe', 
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 10' // Dashed line for walking path
        }).addTo(map);

        // Add start and end markers
        const startMarker = L.marker(latlngs[0]).addTo(map).bindPopup(`<b>Start:</b> ${startName}`);
        const endMarker = L.marker(latlngs[latlngs.length - 1]).addTo(map).bindPopup(`<b>Destination:</b> ${destName}`);
        
        markers.push(startMarker, endMarker);

        // Fit map bounds to show entire route
        map.fitBounds(currentRouteLine.getBounds(), { padding: [50, 50] });
    }

    loadLocations();
});
