document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const chatBox = document.getElementById("chat-box");
    const langSelect = document.getElementById("lang-select");

    function appendMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender);
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showTyping() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("typing");
        typingDiv.id = "typing-indicator";
        typingDiv.innerHTML = "<span></span><span></span><span></span>";
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTyping() {
        const typingDiv = document.getElementById("typing-indicator");
        if (typingDiv) typingDiv.remove();
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        const language = langSelect.value;

        if (!message) return;

        appendMessage("user", message);
        chatInput.value = "";
        showTyping();

        try {
            const data = await api.post("/api/chat", {
                message: message,
                language: language
            });

            removeTyping();
            appendMessage("bot", data.reply);

        } catch (error) {

            removeTyping();

            console.error("========== CHAT ERROR ==========");
            console.error(error);

            // Force show backend error
            alert(error.message);

            appendMessage("bot", `❌ ${error.message}`);
        }
    }

    sendBtn.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});