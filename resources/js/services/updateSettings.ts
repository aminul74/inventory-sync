type SettingsPayload = {
    alertBackgroundColor: string;
    alertTextColor: string;
    alertText: string;
};

export const updateSettings = async (settings: SettingsPayload) => {
    try {
        const response = await fetch(`/api/settings/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ settings }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Failed to update settings." + errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Update Settings error:", error);
        throw error;
    }
};
