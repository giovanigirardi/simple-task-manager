import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as taskApi from "../services/task-service";
import type { Task } from "../types/task";

type TaskFilter = "all" | "active" | "completed";

interface TaskState {
	// State
	tasks: Task[];
	filter: TaskFilter;
	isLoading: boolean;
	error: string | null;

	// Computed Values
	getFilteredTasks: () => Task[];
	getStats: () => {
		total: number;
		completed: number;
		active: number;
		percentComplete: number;
	};

	// Actions
	setTasks: (tasks: Task[]) => void;
	setFilter: (taskFilter: TaskFilter) => void;
	toggleTask: (taskId: string) => Promise<void>;
	addTask: (taskTitle: string) => Promise<void>;
	deleteTask: (taskId: string) => Promise<void>;
	fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
	devtools(
		(set, get) => ({
			// Initial state
			tasks: [],
			filter: "all",
			isLoading: false,
			error: null,

			// Computed values
			getFilteredTasks: () => {
				const { tasks, filter } = get();

				switch (filter) {
					case "active":
						return tasks.filter((t) => !t.isCompleted);
					case "completed":
						return tasks.filter((t) => t.isCompleted);
					default:
						return tasks;
				}
			},

			getStats: () => {
				const { tasks } = get();

				console.log("tasks", tasks);

				const totalTasksAmount = tasks.length;
				const completedTasksAmount = tasks.filter((t) => t.isCompleted).length;
				const activeTasksAmount = totalTasksAmount - completedTasksAmount;
				const percentageOfCompletedTasks = totalTasksAmount
					? Math.round((completedTasksAmount / totalTasksAmount) * 100)
					: 0;

				return {
					total: totalTasksAmount,
					completed: completedTasksAmount,
					active: activeTasksAmount,
					percentComplete: percentageOfCompletedTasks,
				};
			},

			// Synchronous actions
			setTasks: (tasks) => set({ tasks }),
			setFilter: (filter) => set({ filter }),

			// Async actions with optimistic updates
			toggleTask: async (taskId: string) => {
				// Optimistic update
				set((state) => ({
					tasks: state.tasks.map((task) =>
						task.id === taskId
							? { ...task, isCompleted: !task.isCompleted }
							: task,
					),
				}));

				try {
					const task = get().tasks.find((t) => t.id === taskId);
					if (!task) {
						throw new Error("Task not found");
					}

					await taskApi.editTask(taskId, { isCompleted: !task.isCompleted });
				} catch (error: any) {
					//Revert on error
					set((state) => ({
						tasks: state.tasks.map((task) =>
							task.id === taskId
								? { ...task, isCompleted: !task.isCompleted }
								: task,
						),
						error: error.message,
					}));
				}
			},

			addTask: async (title) => {
				set({ isLoading: true, error: null });

				try {
					const newTask = await taskApi.createTask({ title });
					set((state) => ({
						tasks: [...state.tasks, newTask],
						isLoading: false,
					}));
				} catch (e: any) {
					set({ error: e.message, isLoading: false });
				}
			},

			deleteTask: async (id) => {
				// Store task for potential restore
				const taskToDelete = get().tasks.find((t) => t.id === id);

				if (!taskToDelete) {
					return;
				}

				// Optimistic delete
				set((state) => ({
					tasks: state.tasks.filter((t) => t.id !== id),
				}));

				try {
					await taskApi.deleteTask(id);
				} catch (e: any) {
					set((state) => ({
						tasks: [...state.tasks, taskToDelete],
						error: e.message,
					}));
				}
			},

			fetchTasks: async () => {
				set({ isLoading: true, error: null });

				try {
					const tasks = await taskApi.getTasks();

					set({ tasks, isLoading: false });
				} catch (e: any) {
					set({ error: e.message, isLoading: false });
				}
			},
		}),
		{
			name: "task-store",
		},
	),
);
