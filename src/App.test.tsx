import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
	it("should render Vite logo", () => {
		render(<App />);

		const logo = screen.getByAltText("Vite logo");

		expect(logo).toBeInTheDocument();
	});

	it("Should render the count button", () => {
		render(<App />);

		const countButton = screen.getByRole("button", { name: /count is/i });

		expect(countButton).toBeInTheDocument();
	});
});
