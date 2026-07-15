document.addEventListener("DOMContentLoaded", () => {
    const actionBtns = document.querySelectorAll(".action-btn");
    const outputBox = document.getElementById("sop-output");
    const outputContent = document.getElementById("sop-content");
    const outputTitle = document.getElementById("sop-title");

    async function fetchSOP(incidentType) {
        outputBox.style.display = "block";
        outputTitle.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating protocol for: ${incidentType}`;
        outputContent.innerHTML = "Consulting AI Safety Commander...";

        try {
            // FIXED: Added /api to the route
            const data = await api.post("/api/volunteer/sop", {
                incident_type: incidentType,
                location: "Concourse A (Default)",
                details: "Urgent response required."
            });

            outputTitle.innerHTML = `<i class="fas fa-clipboard-check"></i> SOP: ${data.incident}`;
            
            // Format Gemini's markdown bullets to HTML list
            const formattedText = data.ai_sop.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                             .replace(/\* (.*?)\n/g, '<li>$1</li>');
            outputContent.innerHTML = `<ul>${formattedText}</ul>`;
        } catch (error) {
            outputTitle.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error`;
            outputContent.innerHTML = "Failed to connect to the central network.";
        }
    }

    actionBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const incident = btn.getAttribute("data-incident");
            fetchSOP(incident);
        });
    });
});
