import React from "react";
import { createRoot } from "react-dom/client";
import "./bootstrap-app.js";
import App from "./App";
import "@shopify/polaris/build/esm/styles.css";

const container = document.getElementById("app");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
