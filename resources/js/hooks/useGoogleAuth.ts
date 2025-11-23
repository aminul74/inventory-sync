import { useEffect, useState } from "react";
import { fetchGoogleUserInfo, disconnectGoogleAccount } from "../services/api";

export interface GoogleUserInfo {
    email: string;
    picture: string | null;
    name?: string;
    google_id?: string;
}

export function useGoogleAuth() {
    const [googleUser, setGoogleUser] = useState<GoogleUserInfo | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await fetchGoogleUserInfo();
                if (response?.success && response?.user) {
                    setGoogleUser(response.user);
                    setIsConnected(true);
                } else {
                    setGoogleUser(null);
                    setIsConnected(false);
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch Google user"
                );
                setGoogleUser(null);
                setIsConnected(false);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const disconnect = async () => {
        try {
            setLoading(true);
            await disconnectGoogleAccount();
            setGoogleUser(null);
            setIsConnected(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to disconnect"
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { googleUser, isConnected, loading, error, disconnect };
}
