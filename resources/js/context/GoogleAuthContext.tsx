import React, { createContext, useContext } from "react";
import { useGoogleAuth as useGoogleAuthHook } from "../hooks/useGoogleAuth";

export type GoogleUserInfo = {
    email: string;
    picture: string | null;
    name?: string;
    google_id?: string;
};

export type GoogleAuthContextType = {
    googleUser: GoogleUserInfo | null;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    disconnect: () => Promise<void>;
};

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(
    undefined
);

export const GoogleAuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const auth = useGoogleAuthHook();

    const value: GoogleAuthContextType = {
        googleUser: auth.googleUser,
        isConnected: auth.isConnected,
        isLoading: auth.loading,
        error: auth.error,
        disconnect: auth.disconnect,
    };

    return (
        <GoogleAuthContext.Provider value={value}>
            {children}
        </GoogleAuthContext.Provider>
    );
};

export const useGoogleAuthContext = (): GoogleAuthContextType => {
    const context = useContext(GoogleAuthContext);
    if (context === undefined) {
        throw new Error(
            "useGoogleAuthContext must be used within GoogleAuthProvider"
        );
    }
    return context;
};

// Backward compatible export
export const useGoogleAuth = useGoogleAuthContext;
