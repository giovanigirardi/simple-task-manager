import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { resetTasks } from "../../mocks/handlers";
import { TaskManager } from "./TaskManager";

describe("TaskManager", () => {
	beforeEach(() => {
		resetTasks();
	});

	it("should display a loading state while request is being made", () => {
		render(<TaskManager />);

		const loadingLabel = screen.getByText(/loading.../i);

		expect(loadingLabel).toBeInTheDocument();
	});

	it("should display the task list", async () => {
		render(<TaskManager />);

		const firstTaskTitle = await screen.findByText("This is test task 1");
		const secondTaskTitle = screen.getByText("This is another test task :D");

		expect(firstTaskTitle).toBeInTheDocument();
		expect(secondTaskTitle).toBeInTheDocument();
	});

	it("should be able to create a new task", async () => {
		const user = userEvent.setup();

		render(<TaskManager />);

		await screen.findByText("This is test task 1");

		const input = screen.getByPlaceholderText(/add task/i);
		const addTaskButton = screen.getByRole("button", { name: /add/i });

		await user.type(input, "My new task");
		await user.click(addTaskButton);

		const newTask = await screen.findByText(/My new task/i);

		expect(newTask).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/add task/i)).toHaveValue("");
	});
});
