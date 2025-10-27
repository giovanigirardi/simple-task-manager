import { HttpResponse, http } from "msw";
import type { Task } from "../types/task";

let tasks: Task[] = [
	{
		id: "1",
		title: "This is test task 1",
		isCompleted: false,
		createdAt: "2024-01-01T10:00:00Z",
	},
	{
		id: "2",
		title: "This is another test task :D",
		isCompleted: false,
		createdAt: "2024-01-01T12:00:00Z",
	},
];

export const handlers = [
	http.get("/api/tasks", () => {
		return HttpResponse.json(tasks);
	}),

	http.post("/api/tasks", async ({ request }) => {
		const body = (await request.json()) as { title: string };

		if (!body.title) {
			return new HttpResponse("Title field is mandatory", { status: 400 });
		}

		const newTask: Task = {
			id: Date.now().toString(),
			title: body.title,
			isCompleted: false,
			createdAt: new Date().toISOString(),
		};

		tasks.push(newTask);
		return HttpResponse.json(newTask, { status: 201 });
	}),

	http.put("/api/tasks/:id", async ({ request, params }) => {
		const { id } = params;
		const updates = (await request.json()) as {
			title?: string;
			isCompleted?: boolean;
		};

		const taskIndex = tasks.findIndex((t) => t.id === id);
		if (taskIndex === -1) {
			return new HttpResponse(null, { status: 404 });
		}

		tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
		return HttpResponse.json(tasks[taskIndex]);
	}),

	http.delete("/api/tasks/:id", ({ params }) => {
		const { id } = params;

		tasks = tasks.filter((t) => t.id === id);

		return HttpResponse.json(null, { status: 204 });
	}),
];

export const resetTasks = () => {
	tasks = [
		{
			id: "1",
			title: "This is test task 1",
			isCompleted: false,
			createdAt: "2024-01-01T10:00:00Z",
		},
		{
			id: "2",
			title: "This is another test task :D",
			isCompleted: false,
			createdAt: "2024-01-01T12:00:00Z",
		},
	];
};
