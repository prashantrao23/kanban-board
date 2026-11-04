import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical, PencilLine, Trash2 } from "lucide-react";
import { memo, type CSSProperties, type HTMLAttributes, type Ref } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { cn } from "@/utils/index";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (taskId: string, status: TaskStatus) => void;
  isOverlay?: boolean;
}

const priorityStyles: Record<Task["priority"], string> = {
  low: "bg-[#efe9df] text-[#5e554a] border-[#e4ded4]",
  medium: "bg-[#fbf3db] text-[#854d0e] border-[#f3e3b3]",
  high: "bg-[#faebe6] text-[#b44c1e] border-[#f3d2c7]",
  urgent: "bg-[#fae6e6] text-[#b91c1c] border-[#f4c6c6]",
};

const priorityLabels: Record<Task["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

interface TaskCardViewProps extends TaskCardProps {
  articleRef?: Ref<HTMLElement>;
  style?: CSSProperties;
  isDragging?: boolean;
  handleProps?: HTMLAttributes<HTMLButtonElement>;
}

/**
 * Pure presentational card. It never touches dnd-kit hooks, so it is safe to
 * render inside <DragOverlay> without registering a duplicate draggable.
 */
function TaskCardView({
  task,
  onEdit,
  onDelete,
  onMove,
  isOverlay = false,
  articleRef,
  style,
  isDragging = false,
  handleProps,
}: TaskCardViewProps) {
  return (
    <article
      ref={articleRef}
      style={style}
      className={cn(
        "group w-full rounded-lg border border-[#e4ded4] bg-white p-3 sm:p-3.5 shadow-[0_1px_2px_rgba(31,27,22,0.04)] transition-colors hover:border-[#d5cdbf]",
        isDragging && !isOverlay && "opacity-40",
        isOverlay &&
          "cursor-grabbing shadow-[0_10px_24px_rgba(31,27,22,0.14)] pointer-events-none select-none",
      )}
      aria-label={`${task.title} task card`}
    >
      {/* Header: Priority & Drag Handle */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none",
              priorityStyles[task.priority],
            )}
          >
            {priorityLabels[task.priority]}
          </span>
          {/* <span className="font-mono text-[11px] tabular-nums text-[#7b7266]">
            #{shortId}
          </span> */}
        </div>

        <button
          type="button"
          style={{ touchAction: "none" }}
          className="touch-none cursor-grab p-1 text-[#7b7266] opacity-60 transition hover:opacity-100 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b44c1e]"
          aria-label={`Drag ${task.title}`}
          {...handleProps}
        >
          <GripVertical size={14} />
        </button>
      </div>

      {/* Title */}
      <h4 className="text-xs sm:text-sm font-medium leading-snug text-[#1f1b16] break-words">
        {task.title}
      </h4>

      {/* Description */}
      {task.description ? (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5e554a] break-words">
          {task.description}
        </p>
      ) : null}

      {/* Labels */}
      {task.labels.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="rounded border border-[#e4ded4] bg-[#efe9df]/60 px-1.5 py-0.5 text-[10px] sm:text-[11px] text-[#5e554a]"
            >
              {label.name}
            </span>
          ))}
        </div>
      ) : null}

      {/* Card Controls */}
      <div className="mt-2.5 flex items-center gap-1.5 border-t border-[#ede8df] pt-2">
        <label className="flex-1 min-w-0">
          <span className="sr-only">Move task</span>
          <select
            className="w-full truncate cursor-pointer rounded-md border border-[#e4ded4] bg-[#efe9df]/40 px-2 py-1.5 text-xs text-[#5e554a] outline-none transition hover:bg-[#efe9df] focus:border-[#b44c1e] focus:bg-white"
            value={task.status}
            onChange={(event) =>
              onMove(task.id, event.target.value as TaskStatus)
            }
            aria-label={`Move ${task.title}`}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="rounded p-1.5 text-[#7b7266] transition hover:bg-[#efe9df] hover:text-[#1f1b16] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b44c1e]"
          onClick={onEdit}
          aria-label={`Edit ${task.title}`}
        >
          <PencilLine size={13} />
        </button>

        <button
          type="button"
          className="rounded p-1.5 text-[#7b7266] transition hover:bg-[#fae6e6] hover:text-[#b91c1c] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b91c1c]"
          onClick={onDelete}
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Due Date Indicator */}
      {task.dueDate ? (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#7b7266]">
          <CalendarDays size={12} />
          <span className="font-mono tabular-nums">{task.dueDate}</span>
        </div>
      ) : null}
    </article>
  );
}

export const TaskCard = memo(function TaskCard(props: TaskCardProps) {
  const { task } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task, columnId: task.status },
  });

  return (
    <TaskCardView
      {...props}
      articleRef={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      isDragging={isDragging}
      handleProps={{ ...attributes, ...listeners }}
    />
  );
});

/** Static copy of the card used inside <DragOverlay>. */
export function TaskCardOverlay(props: Omit<TaskCardProps, "isOverlay">) {
  return <TaskCardView {...props} isOverlay />;
}
