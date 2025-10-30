import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const container = document.getElementById("root") as HTMLElement;

if (import.meta.env.DEV) {
	const { worker } = await import("./mocks/browser.ts");
	await worker.start();
}

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
