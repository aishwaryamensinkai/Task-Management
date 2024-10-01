// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Fix for ResizeObserver loop limit exceeded error
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;

const originalError = console.error;
console.error = (msg, ...args) => {
  if (resizeObserverLoopErrRe.test(msg)) {
    originalError(msg, ...args);
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
