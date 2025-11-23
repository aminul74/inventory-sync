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

export const createSheet = async (data: {
    url: string;
    title: string;
    option: string;
}) => {
    try {
        const response = await fetch(`${API_BASE}/create-sheet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create sheet");
        return await response.json();
    } catch (error) {
        console.error("Create sheet error:", error);
        throw error;
    }
};

export const fetchProfile = async () => {
    try {
        const response = await fetch(`${API_BASE}/profile`);
        if (!response.ok) throw new Error("Failed to fetch profile");
        return await response.json();
    } catch (error) {
        console.error("Fetch profile error:", error);
        throw error;
    }
};

export const exportProducts = async (fields?: string[]) => {
    try {
        const response = await fetch(`${API_BASE}/export-products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fields }),
        });
        if (!response.ok) throw new Error("Failed to export products");
        return await response.json();
    } catch (error) {
        console.error("Export products error:", error);
        throw error;
    }
};

export const importProducts = async () => {
    try {
        const response = await fetch(`${API_BASE}/import-products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to import products");
        return await response.json();
    } catch (error) {
        console.error("Import products error:", error);
        throw error;
    }
};

export const syncProducts = async () => {
    try {
        const response = await fetch(`${API_BASE}/sync-products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to sync products");
        return await response.json();
    } catch (error) {
        console.error("Sync products error:", error);
        throw error;
    }
};
