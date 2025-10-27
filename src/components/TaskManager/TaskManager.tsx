import { useEffect, useState } from "react";
import { createTask, getTasks } from "../../services/task-service";
import type { Task } from "../../types/task";
import { TaskItem } from "../TaskItem/TaskItem";

export const TaskManager = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [newTask, setNewTask] = useState("");

	useEffect(() => {
		const populateTasks = async () => {
			try {
				const getTasksResponse = await getTasks();

				setTasks(getTasksResponse);
			} finally {
				setIsLoading(false);
			}
		};

		populateTasks();
	}, []);

	const handleAddTask = async () => {
		if (!newTask) {
			return;
		}

		const newTaskResponse = await createTask({ title: newTask });

		if (newTaskResponse.title === newTask) {
			setTasks((oldValue) => [...oldValue, newTaskResponse]);
			setNewTask("");
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!tasks.length) {
		return <div>no tasks created yet, add your first task!</div>;
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-row justify-between align-middle">
				<input
					className="flex"
					type="text"
					placeholder="Add task"
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
				/>
				<button type="button" onClick={handleAddTask}>
					Add
				</button>
			</div>
			<div>
				{tasks.map((task) => (
					<TaskItem key={task.id} task={task} />
				))}
			</div>
		</div>
	);
};
