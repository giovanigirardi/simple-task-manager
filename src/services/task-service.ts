import type { Task } from "../types/task";
import { api } from "./api";

type CreateTaskPayload = {
	title: string;
};

type EditTaskPayload = {
	title?: string;
	isCompleted?: boolean;
};

export const getTasks = async () => {
	try {
		const getTasksResponse = await api.get<Task[]>("tasks");

		console.log("getTasksResponse", getTasksResponse);

		return getTasksResponse.data;
	} catch (e) {
		if (e.response?.status === 500) {
			throw new Error("Failed to fetch tasks");
		}

		throw e;
	}
};

export const createTask = async (payload: CreateTaskPayload) => {
	if (!payload.title.trim()) {
		throw new Error("Title field is mandatory");
	}

	const createTaskResponse = await api.post<Task>("tasks", payload);

	return createTaskResponse.data;
};

export const editTask = async (taskId: string, payload: EditTaskPayload) => {
	try {
		const editTaskResponse = await api.put<Task>(`tasks/${taskId}`, payload);

		return editTaskResponse.data;
	} catch (e) {
		if (e.response?.status === 404) {
			throw new Error("Task not found");
		}

		throw e;
	}
};

export const deleteTask = async (taskId: string) => {
	const deleteTaskResponse = await api.delete(`tasks/${taskId}`);

	return deleteTaskResponse.data;
};
