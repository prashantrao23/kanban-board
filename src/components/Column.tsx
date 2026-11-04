import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "@/components/TaskCard";
import { cn } from "@/utils/index";

interface ColumnProps {
  status: TaskStatus;
  indexNumber?: string;
  title: string;
  count: number;
  tasks: Task[];
  empty?: boolean;
  isDraggingOver?: boolean;
  className?: string;
  onAddTask: () => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, status: TaskStatus) => void;
}

export function Column({
  status,
  indexNumber,
  title,
  count,
  tasks,
  empty = false,
  isDraggingOver = false,
  className,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { type: "column", status },
  });
  const isActiveDropTarget = isOver || isDraggingOver;

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex w-full min-w-0 min-h-[240px] sm:min-h-[420px] flex-col rounded-xl border border-[#e4ded4] bg-[#fdfbf7] p-3 sm:p-3.5 shadow-[0_1px_2px_rgba(31,27,22,0.04)] transition-colors",
        isActiveDropTarget &&
          "border-[#b44c1e]/50 bg-[#efe9df]/50 ring-1 ring-[#b44c1e]/20",
        className,
      )}
      aria-label={`${title} column`}
    >
      {/* Column Header */}
      <div className="mb-3 flex items-center justify-between border-b border-[#e4ded4]/70 pb-2.5">
        <div className="flex items-center gap-2">
          {indexNumber ? (
            <span className="font-mono text-[11px] tabular-nums text-[#7b7266]">
              {indexNumber}
            </span>
          ) : null}
          <h3 className="text-xs sm:text-sm font-medium tracking-tight text-[#1f1b16]">
            {title}
          </h3>
        </div>
        <span className="rounded border border-[#e4ded4] bg-[#efe9df] px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums text-[#5e554a]">
          {count}
        </span>
      </div>

      {/* Column Task List */}
      <div className="flex-1 space-y-2.5">
        {empty ? (
          <div className="flex min-h-[120px] sm:min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed border-[#e4ded4] bg-[#efe9df]/20 px-3 py-5 text-center">
            <p className="text-xs font-medium text-[#5e554a]">No tasks</p>
            <p className="mt-0.5 max-w-[160px] text-[11px] text-[#7b7266]">
              Drop a task here or create a new one.
            </p>
          </div>
        ) : (
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
                onMove={onMoveTask}
              />
            ))}
          </SortableContext>
        )}
      </div>

      {/* Add Task Trigger */}
      <button
        type="button"
        className="mt-3 flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#e4ded4] bg-transparent py-2 text-xs font-medium text-[#5e554a] transition hover:border-[#d5cdbf] hover:bg-[#efe9df]/60 hover:text-[#1f1b16] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b44c1e]"
        onClick={onAddTask}
      >
        <Plus size={13} strokeWidth={2} />
        <span>Add task</span>
      </button>
    </section>
  );
}
