export type Task = {
	id: string;
	title: string;
	isCompleted: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type TaskActions = {
	onToggle?: (id: string) => void;
	onDelete?: (id: string) => void;
	onEdit?: (id: string) => void;
};
