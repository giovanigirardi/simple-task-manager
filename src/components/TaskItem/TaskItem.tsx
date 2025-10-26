import type { Task, TaskActions } from "../../types/task";

interface TaskItemProps {
	task: Task;
	taskActions?: TaskActions;
}

const TaskItem = ({ task, taskActions }: TaskItemProps) => {
	return (
		<div>
			<input
				type="checkbox"
				checked={task.isCompleted}
				onChange={() => taskActions?.onToggle?.(task.id)}
			/>
			{task.title}
			<button type="button" onClick={() => taskActions?.onEdit?.(task.id)}>
				Edit
			</button>
			<button type="button" onClick={() => taskActions?.onDelete?.(task.id)}>
				Delete
			</button>
		</div>
	);
};

export { TaskItem };
