import { useEffect, useState } from "react";
import { fetchSettings, updateSettings } from "../services/api";

type Settings = {
    alertBackgroundColor: string;
    alertTextColor: string;
    alertText: string;
};

export function useSettings() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSettings();
                setSettings(data || null);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch settings"
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const updateSettingsAsync = async (newSettings: Settings) => {
        try {
            setLoading(true);
            const result = await updateSettings(newSettings);
            setSettings(newSettings);
            return result;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update settings"
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { settings, loading, error, updateSettings: updateSettingsAsync };
}
