import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { resetTasks } from "../mocks/handlers";
import { server } from "../mocks/server";
import { createTask, deleteTask, editTask, getTasks } from "./task-service";

describe("Task API", () => {
	beforeEach(() => {
		resetTasks();
	});

	describe("getTasks", () => {
		it("should return a list of tasks", async () => {
			const tasks = await getTasks();

			expect(tasks).toHaveLength(2);
			expect(tasks[0].title).toBe("This is test task 1");
		});

		it("should throw errors correctly", async () => {
			server.use(
				http.get("/api/tasks", () => {
					return new HttpResponse(null, { status: 500 });
				}),
			);

			await expect(getTasks()).rejects.toThrow("Failed to fetch tasks");
		});
	});

	describe("createTask", () => {
		it("should create a new task", async () => {
			const payload = {
				title: "this is a new task",
			};

			const createTaskResponse = await createTask(payload);

			expect(createTaskResponse.title).toBe("this is a new task");
			expect(createTaskResponse.isCompleted).toBe(false);
			expect(createTaskResponse.id).toBeDefined();
		});

		it("should validate mandatory title field", async () => {
			const emptyPayload = {
				title: "",
			};

			await expect(createTask(emptyPayload)).rejects.toThrow(
				"Title field is mandatory",
			);
		});
	});

	describe("editTask", () => {
		it("should mark a task as completed", async () => {
			const taskId = "1";
			const payload = {
				isCompleted: true,
			};

			const editTaskResponse = await editTask(taskId, payload);

			expect(editTaskResponse.isCompleted).toBe(true);
		});

		it("should be able to edit a task's title", async () => {
			const taskId = "1";
			const payload = {
				title: "updated task title",
			};

			const editTaskResponse = await editTask(taskId, payload);

			expect(editTaskResponse.title).toBe("updated task title");
		});

		it("should throw an error when an invalid id is passed", async () => {
			const invalidTaskId = "10";
			const payload = {
				title: "updated task title",
			};

			await expect(editTask(invalidTaskId, payload)).rejects.toThrow(
				"Task not found",
			);
		});
	});

	describe("deleteTask", () => {
		it("should delete a task", async () => {
			const taskId = "1";

			const deleteTaskResponse = deleteTask(taskId);

			expect(deleteTaskResponse).toBeDefined();
		});
	});
});
