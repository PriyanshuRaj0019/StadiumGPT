document.addEventListener("DOMContentLoaded", () => {
    checkBackendConnection();
    setupMobileMenu();
});

function setupMobileMenu() {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
            navLinks.style.flexDirection = "column";
            navLinks.style.position = "absolute";
            navLinks.style.top = "60px";
            navLinks.style.right = "2rem";
            navLinks.style.background = "rgba(15, 23, 42, 0.95)";
            navLinks.style.padding = "1rem";
            navLinks.style.borderRadius = "8px";
            navLinks.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        });
    }
}

async function checkBackendConnection() {
    const statusTextEl = document.getElementById("backend-status-text");
    if (!statusTextEl) return;

    try {
        statusTextEl.innerText = "Checking backend connectivity...";
        // If testing on Vercel, ensure API_BASE_URL in api.js points to your Render URL.
        const data = await api.get("/api/health");
        
        if (data && data.status === "healthy") {
            statusTextEl.innerHTML = `<i class="fas fa-check-circle"></i> Connected to Server Environment [${data.environment.toUpperCase()}] successfully.`;
            statusTextEl.parentElement.style.borderColor = "rgba(16, 185, 129, 0.3)";
            statusTextEl.parentElement.style.background = "rgba(16, 185, 129, 0.15)";
        }
    } catch (error) {
        statusTextEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Cannot establish connection to backend.`;
        statusTextEl.parentElement.style.borderColor = "rgba(239, 68, 68, 0.3)";
        statusTextEl.parentElement.style.background = "rgba(239, 68, 68, 0.15)";
        statusTextEl.parentElement.style.color = "#ef4444";
    }
}