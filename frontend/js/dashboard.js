
// ======================================================
// StadiumGPT Dashboard
// dashboard.js
// ======================================================

// Change this before deployment if required
const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:8000/api"
        : "https://stadiumgpt.onrender.com/api";


// ===============================
// Live Clock
// ===============================

function updateClock() {

    const now = new Date();

    document.getElementById("current-time").innerHTML =
        now.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

}

setInterval(updateClock, 1000);
updateClock();


// ===============================
// Count Animation
// ===============================

function animateValue(id, endValue, duration = 1200) {

    const element = document.getElementById(id);

    if (!element) return;

    let start = 0;

    const increment = endValue / (duration / 16);

    function update() {

        start += increment;

        if (start >= endValue) {

            element.innerHTML = endValue;

            return;

        }

        element.innerHTML = Math.floor(start);

        requestAnimationFrame(update);

    }

    update();

}


// ===============================
// Progress Bars
// ===============================

function updateProgress(className, value) {

    const bar = document.querySelector("." + className);

    const label = document.getElementById(className);

    if (bar)
        bar.style.width = value + "%";

    if (label)
        label.innerHTML = value + "%";

}


// ===============================
// Dashboard Loader
// ===============================

async function loadDashboard() {

    try {

        const response = await fetch(API_BASE + "/dashboard");

        if (!response.ok)
            throw new Error("Dashboard API failed.");

        const data = await response.json();


        // ---------------- KPIs ----------------

        animateValue("visitors", data.visitors || 48352);

        document.getElementById("occupancy").innerHTML =
            (data.occupancy || 82) + "%";

        animateValue("incidents", data.incidents || 3);

        document.getElementById("gates").innerHTML =
            data.gates || "16 / 20";


        // ---------------- Crowd ----------------

        updateProgress("north", data.crowd?.north || 80);
        updateProgress("south", data.crowd?.south || 60);
        updateProgress("east", data.crowd?.east || 90);
        updateProgress("west", data.crowd?.west || 45);


        // ---------------- Summary ----------------

        document.getElementById("summary").innerHTML =
            data.summary ||
            `
            <strong>Operational Summary</strong><br><br>

            • Stadium operations are normal.<br>
            • Crowd density increasing in East Stand.<br>
            • Transportation operating smoothly.<br>
            • Accessibility services fully available.<br>
            • No major security threats detected.
            `;


    }

    catch (error) {

        console.error(error);

        // Demo Data

        animateValue("visitors", 48352);

        document.getElementById("occupancy").innerHTML = "82%";

        animateValue("incidents", 3);

        document.getElementById("gates").innerHTML = "16 / 20";

        updateProgress("north", 80);
        updateProgress("south", 60);
        updateProgress("east", 90);
        updateProgress("west", 45);

        document.getElementById("summary").innerHTML =
            `
            <strong>Demo Mode</strong><br><br>

            Backend unavailable.

            Showing simulated FIFA World Cup 2026 operational data.
            `;

    }

}


// ===============================
// Refresh Dashboard
// ===============================

loadDashboard();

setInterval(loadDashboard, 30000);


// ===============================
// Card Hover Glow
// ===============================

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background =
            `radial-gradient(circle at ${x}px ${y}px,
            rgba(0,194,255,.15),
            rgba(15,23,42,.82) 60%)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.background = "";

    });

});

