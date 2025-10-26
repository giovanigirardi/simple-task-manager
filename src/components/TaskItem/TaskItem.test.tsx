import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskItem } from "./TaskItem";

describe("TaskItem", () => {
	const defaultTask = {
		id: "1",
		title: "Test task",
		isCompleted: false,
	};

	it("should render task title", () => {
		render(<TaskItem task={defaultTask} />);

		expect(screen.getByText("Test task")).toBeInTheDocument();
	});

	it("should show completion status with checkbox", () => {
		render(<TaskItem task={defaultTask} />);

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).not.toBeChecked();
	});

	it("should show the correct checked status when the task is completed", () => {
		const completedTask = { ...defaultTask, isCompleted: true };

		render(<TaskItem task={completedTask} />);

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).toBeChecked();
	});

	it("should call onToggle when the checkbox is clicked", async () => {
		const user = userEvent.setup();
		const handleToggle = vi.fn();
		const taskActions = { onToggle: handleToggle };

		render(<TaskItem task={defaultTask} taskActions={taskActions} />);

		const checkbox = screen.getByRole("checkbox");
		await user.click(checkbox);

		expect(handleToggle).toBeCalledWith("1");
		expect(handleToggle).toBeCalledTimes(1);
	});

	it("should show the delete button and handle deletion", async () => {
		const user = userEvent.setup();
		const handleDelete = vi.fn();
		const taskActions = { onDelete: handleDelete };

		render(<TaskItem task={defaultTask} taskActions={taskActions} />);

		const deleteButton = screen.getByRole("button", { name: /Delete/i });

		expect(deleteButton).toBeInTheDocument();

		await user.click(deleteButton);

		expect(handleDelete).toBeCalledWith("1");
		expect(handleDelete).toBeCalledTimes(1);
	});

	it("Should show the edit button and handle edition", async () => {
		const user = userEvent.setup();
		const handleEdit = vi.fn();
		const taskActions = { onEdit: handleEdit };

		render(<TaskItem task={defaultTask} taskActions={taskActions} />);

		const editButton = screen.getByRole("button", { name: /Edit/i });

		expect(editButton).toBeInTheDocument();

		await user.click(editButton);

		expect(handleEdit).toBeCalledWith("1");
		expect(handleEdit).toBeCalledTimes(1);
	});
});
