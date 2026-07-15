document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("access-form");
    const input = document.getElementById("access-input");
    const outputBox = document.getElementById("access-output");
    const outputContent = document.getElementById("access-content");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (!query) return;

        outputBox.style.display = "block";
        outputContent.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Checking stadium layout...`;

        try {
            // FIXED: Added /api to the route
            const data = await api.post("/api/accessibility/assist", { query: query });
            outputContent.innerHTML = data.reply;
        } catch (error) {
            outputContent.innerHTML = "⚠️ Sorry, I could not retrieve that information.";
        }
    });
});
