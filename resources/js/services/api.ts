// Consolidated API service for all backend requests
const API_BASE = "/api";

// Settings API
export const fetchSettings = async () => {
    try {
        const response = await fetch(`${API_BASE}/settings`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch settings");
        return await response.json();
    } catch (error) {
        console.error("Fetch settings error:", error);
        throw error;
    }
};

export const updateSettings = async (settings: {
    alertBackgroundColor: string;
    alertTextColor: string;
    alertText: string;
}) => {
    try {
        const response = await fetch(`${API_BASE}/settings/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ settings }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Failed to update settings: " + errorText);
        }
        return await response.json();
    } catch (error) {
        console.error("Update settings error:", error);
        throw error;
    }
};

// Google Auth API
export const fetchGoogleUserInfo = async () => {
    try {
        const response = await fetch("/api/google/user-info");
        if (!response.ok) throw new Error("Failed to fetch Google user info");
        return await response.json();
    } catch (error) {
        console.error("Fetch Google user error:", error);
        throw error;
    }
};

export const disconnectGoogleAccount = async () => {
    try {
        const response = await fetch("/auth/google/disconnect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN":
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
            },
        });

        if (!response.ok)
            throw new Error("Failed to disconnect Google account");
        return await response.json();
    } catch (error) {
        console.error("Disconnect Google error:", error);
        throw error;
    }
};
