import { useEffect, useMemo, useState } from "react";
import { useTaskStore } from "../../stores/taskStore";
import { TaskFilter } from "../TaskFilter/TaskFilter";
import { TaskItem } from "../TaskItem/TaskItem";

export const TaskManager = () => {
	const tasks = useTaskStore((state) => state.tasks);
	const isLoading = useTaskStore((state) => state.isLoading);
	const error = useTaskStore((state) => state.error);
	const filter = useTaskStore((state) => state.filter);

	const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
	const getStats = useTaskStore((state) => state.getStats);
	const fetchTasks = useTaskStore((state) => state.fetchTasks);
	const addTask = useTaskStore((state) => state.addTask);
	const toggleTask = useTaskStore((state) => state.toggleTask);
	const deleteTask = useTaskStore((state) => state.deleteTask);

	const [newTask, setNewTask] = useState("");

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: asd
	const filteredTasks = useMemo(() => getFilteredTasks(), [tasks, filter]);
	const stats = getStats();

	const handleAddTask = async () => {
		if (!newTask) {
			return;
		}

		await addTask(newTask);
		setNewTask("");
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	if (!filteredTasks.length) {
		return <div>no tasks created yet, add your first task!</div>;
	}

	return (
		<div className="flex flex-col">
			<TaskFilter />

			<div className="mb-4 p-2 bg-gray-100 rounded">
				<span>Total: {stats.total}</span>
				<span>Completed: {stats.completed}</span>
				<span>Active: {stats.active}</span>
				<span>Progress: {stats.percentComplete}%</span>
			</div>

			<div className="flex flex-row justify-start align-middle">
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
				{filteredTasks.map((task) => (
					<TaskItem
						key={task.id}
						task={task}
						taskActions={{ onDelete: deleteTask, onToggle: toggleTask }}
					/>
				))}
			</div>
		</div>
	);
};
