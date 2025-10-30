import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "../types/task";
import { useTaskStore } from "./taskStore";

vi.mock("../services/task-service", () => ({
	getTasks: vi.fn(),
	createTask: vi.fn(),
	editTask: vi.fn(),
}));

import * as taskApi from "../services/task-service";

describe("TaskStore", () => {
	beforeEach(() => {
		useTaskStore.setState({
			tasks: [],
			isLoading: false,
			error: null,
		});

		vi.clearAllMocks();
	});

	describe("Initial State", () => {
		it("should have empty initial state", () => {
			const { result } = renderHook(() => useTaskStore());

			expect(result.current.tasks).toEqual([]);
			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	describe("Synchronous Actions", () => {
		it("should set tasks", () => {
			const { result } = renderHook(() => useTaskStore());

			const mockTasks: Task[] = [
				{ id: "1", title: "Test task", isCompleted: false },
			];

			act(() => {
				result.current.setTasks(mockTasks);
			});

			expect(result.current.tasks).toEqual(mockTasks);
		});

		it("should toggle task completion optimistically", () => {
			const { result } = renderHook(() => useTaskStore());

			const mockTasks: Task[] = [
				{ id: "1", title: "Test task", isCompleted: false },
			];

			act(() => {
				result.current.setTasks(mockTasks);
				result.current.toggleTask("1");
			});

			expect(result.current.tasks[0].isCompleted).toBe(true);
		});

		it("should filter tasks by completion status", () => {
			const { result } = renderHook(() => useTaskStore());

			const mockTasks: Task[] = [
				{ id: "1", title: "Finished Task", isCompleted: true },
				{ id: "2", title: "Active Task", isCompleted: false },
			];

			act(() => {
				result.current.setTasks(mockTasks);
				result.current.setFilter("active");
			});

			const filteredTasks = result.current.getFilteredTasks();

			expect(filteredTasks).toHaveLength(1);
			expect(filteredTasks[0].title).toBe("Active Task");
		});
	});

	describe("Async actions", () => {
		it("should fetch tasks from the API", async () => {
			const mockTasks: Task[] = [
				{ id: "1", title: "Test task", isCompleted: false },
			];
			vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);

			const { result } = renderHook(() => useTaskStore());

			await act(async () => {
				await result.current.fetchTasks();
			});

			expect(result.current.tasks).toEqual(mockTasks);
			expect(result.current.isLoading).toBe(false);
		});

		it("should handle network errors", async () => {
			vi.mocked(taskApi.getTasks).mockRejectedValue(new Error("Network error"));

			const { result } = renderHook(() => useTaskStore());

			await act(async () => {
				await result.current.fetchTasks();
			});

			expect(result.current.tasks).toStrictEqual([]);
			expect(result.current.isLoading).toBe(false);
		});

		it("should add new task optimistically, then sync", async () => {
			const newTask: Task = { id: "1", title: "New task", isCompleted: false };
			vi.mocked(taskApi.createTask).mockResolvedValue(newTask);

			const { result } = renderHook(() => useTaskStore());

			await act(async () => {
				await result.current.addTask("New task");
			});

			expect(result.current.tasks).toContain(newTask);
			expect(result.current.isLoading).toBe(false);
		});
	});

	describe("Computed Values", () => {
		it("should calculate statistics", () => {
			const { result } = renderHook(() => useTaskStore());

			const tasks: Task[] = [
				{ id: "1", title: "Task 1", isCompleted: false },
				{ id: "2", title: "Task 2", isCompleted: true },
				{ id: "3", title: "Task 3", isCompleted: false },
			];

			act(() => {
				result.current.setTasks(tasks);
			});

			const stats = result.current.getStats();

			expect(stats).toEqual({
				total: 3,
				completed: 1,
				active: 2,
				percentComplete: 33,
			});
		});
	});
});
