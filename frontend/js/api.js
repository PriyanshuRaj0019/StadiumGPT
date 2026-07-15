/**
 * Global Frontend API Request Controller
 */
const API_BASE_URL = "https://stadiumgpt.onrender.com";

const api = {

    async handleResponse(response) {

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {

            console.error("Backend Error Status:", response.status);
            console.error("Backend Response:", data);

            alert(data.detail || JSON.stringify(data));

            throw new Error(data.detail || `HTTP ${response.status}`);
        }

        return data;
    },

    async get(endpoint) {

        const response = await fetch(`${API_BASE_URL}${endpoint}`);

        return await this.handleResponse(response);
    },

    async post(endpoint, data) {

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        return await this.handleResponse(response);
    }
};