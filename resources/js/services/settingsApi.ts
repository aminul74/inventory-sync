export const fetchSettings = async () => {
    try {
        const url = `/api/settings`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Network response issues");
        }

        return await response.json();
    } catch (error) {
        console.error("API Fetch Settings Error:", error);
        throw error;
    }
};
