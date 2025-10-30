import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TaskFilter } from "./TaskFilter";

describe("TaskFilter", () => {
	it("Should render all filter buttons", () => {
		render(<TaskFilter />);

		expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /active/i })).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /completed/i }),
		).toBeInTheDocument();
	});

	it("should highlight active filter", () => {
		render(<TaskFilter />);

		const allButton = screen.getByRole("button", { name: /all/i });
		expect(allButton).toHaveClass("bg-blue-500");
	});

	it("should change filter when clicked", async () => {
		const user = userEvent.setup();
		render(<TaskFilter />);

		const activeButton = screen.getByRole("button", { name: /active/i });
		await user.click(activeButton);

		expect(activeButton).toHaveClass("bg-blue-500");
	});
});
