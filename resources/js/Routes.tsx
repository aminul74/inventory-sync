import React from "react";
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import Setup from "./pages/index";
import Settings from "./pages/settings";
// import NotFound from "./pages/NotFound";

export default function Routes() {
    return (
        <ReactRouterRoutes>
            <Route path="/" element={<Setup />} />
            <Route path="/settings" element={<Settings />} />
            {/* <Route path="*" element={<NotFound />} /> */}
        </ReactRouterRoutes>
    );
}
