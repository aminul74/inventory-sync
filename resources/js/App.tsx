import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import AppLayout from "./layouts/AppLayout";
import { GoogleAuthProvider } from "./context/GoogleAuthContext";
import Routes from "./Routes";

import "./utils/i18n";

function App() {
    return (
        <AppProvider i18n={enTranslations}>
            <GoogleAuthProvider>
                <BrowserRouter>
                    <AppLayout>
                        <Routes />
                    </AppLayout>
                </BrowserRouter>
            </GoogleAuthProvider>
        </AppProvider>
    );
}

export default App;
