import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Buffer } from "buffer";

(window as any).Buffer = Buffer;

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
