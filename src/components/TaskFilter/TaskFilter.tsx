import { useTaskStore } from "../../stores/taskStore";

export const TaskFilter = () => {
	const currentFilter = useTaskStore((state) => state.filter);

	const setFilter = useTaskStore((state) => state.setFilter);

	return (
		<div className="flex flex-row space-between">
			<button
				type="button"
				className={`${currentFilter === "all" ? "bg-blue-500" : ""}`}
				onClick={() => setFilter("all")}
			>
				All
			</button>
			<button
				type="button"
				className={`${currentFilter === "active" ? "bg-blue-500" : ""}`}
				onClick={() => setFilter("active")}
			>
				Active
			</button>
			<button
				type="button"
				className={`${currentFilter === "completed" ? "bg-blue-500" : ""}`}
				onClick={() => setFilter("completed")}
			>
				Completed
			</button>
		</div>
	);
};
