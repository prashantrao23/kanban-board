import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type Modifier,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Columns3, LayoutList, Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Column } from "@/components/Column";
import { TaskCardOverlay } from "@/components/TaskCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useBoardStore } from "@/store/useBoardStore";
import type { Task, TaskStatus } from "@/types/task";
import { cn } from "@/utils/index";

const columns = [
  { key: "backlog" as const, index: "01", title: "Backlog" },
  { key: "todo" as const, index: "02", title: "To Do" },
  { key: "in-progress" as const, index: "03", title: "In Progress" },
  { key: "done" as const, index: "04", title: "Done" },
];

/**
 * Prefer the card under the pointer. If the pointer is over a column but not
 * over a card (gaps, padding, empty space), snap to the nearest card in that
 * column so drops land where the user expects.
 */
const collisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args);
  const hits = pointerHits.length > 0 ? pointerHits : rectIntersection(args);

  const cardHit = hits.find((hit) => !String(hit.id).startsWith("column-"));
  if (cardHit) {
    return [cardHit];
  }

  const columnHit = hits.find((hit) => String(hit.id).startsWith("column-"));
  if (columnHit) {
    const status = String(columnHit.id).replace("column-", "");
    const columnCards = args.droppableContainers.filter(
      (container) =>
        container.data.current?.type === "task" &&
        container.data.current?.columnId === status,
    );
    if (columnCards.length > 0) {
      const nearest = closestCenter({
        ...args,
        droppableContainers: columnCards,
      });
      if (nearest.length > 0) {
        return [nearest[0]];
      }
    }
    return [columnHit];
  }

  return hits;
};

/** Keeps the floating card fully on screen horizontally while dragging. */
const keepOverlayInViewportX: Modifier = ({
  transform,
  draggingNodeRect,
  windowRect,
}) => {
  if (!draggingNodeRect || !windowRect) {
    return transform;
  }

  const minX = -draggingNodeRect.left;
  const maxX = windowRect.width - draggingNodeRect.right;
  return { ...transform, x: Math.min(Math.max(transform.x, minX), maxX) };
};

export function Board() {
  const tasks = useBoardStore((state) => state.tasks);
  const searchQuery = useBoardStore((state) => state.searchQuery);
  const priorityFilter = useBoardStore((state) => state.priorityFilter);
  const openCreateModal = useBoardStore((state) => state.openCreateModal);
  const openEditModal = useBoardStore((state) => state.openEditModal);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const moveTask = useBoardStore((state) => state.moveTask);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(
    null,
  );
  const [activeMobileTab, setActiveMobileTab] = useState<"all" | TaskStatus>(
    "all",
  );
  const [mobileLayoutMode, setMobileLayoutMode] = useState<"stack" | "swipe">(
    "stack",
  );
  // Mount exactly one column layout. dnd-kit tracks droppables/draggables by id,
  // so rendering the desktop and mobile trees together (hidden with CSS) makes
  // the hidden copy overwrite the visible one and breaks measuring.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [priorityFilter, searchQuery, tasks]);

  const groupedTasks = useMemo(() => {
    return columns.reduce<Record<TaskStatus, Task[]>>(
      (accumulator, column) => {
        accumulator[column.key] = filteredTasks.filter(
          (task) => task.status === column.key,
        );
        return accumulator;
      },
      { backlog: [], todo: [], "in-progress": [], done: [] },
    );
  }, [filteredTasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const doneCount = tasks.filter((task) => task.status === "done").length;
    const inProgressCount = tasks.filter(
      (task) => task.status === "in-progress",
    ).length;
    const todoCount = tasks.filter((task) => task.status === "todo").length;
    const backlogCount = tasks.filter(
      (task) => task.status === "backlog",
    ).length;
    const percentDone = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    return {
      total,
      doneCount,
      inProgressCount,
      todoCount,
      backlogCount,
      percentDone,
    };
  }, [tasks]);

  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeTaskId) ?? null,
    [activeTaskId, tasks],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
    setDraggedOverColumn(null);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const overId = event.over?.id;
      if (typeof overId === "string" && overId.startsWith("column-")) {
        setDraggedOverColumn(overId.replace("column-", "") as TaskStatus);
        return;
      }

      const overTask = tasks.find((task) => task.id === overId);
      setDraggedOverColumn(overTask?.status ?? null);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTaskId(null);
      setDraggedOverColumn(null);

      if (!over) {
        return;
      }

      const activeId = String(active.id);
      const overId = String(over.id);
      const sourceTask = tasks.find((task) => task.id === activeId);

      if (!sourceTask) {
        return;
      }

      // Dropped onto a column container
      if (overId.startsWith("column-")) {
        const targetStatus = overId.replace("column-", "") as TaskStatus;
        const targetColumnTasks = tasks.filter(
          (task) => task.status === targetStatus && task.id !== activeId,
        );
        moveTask(activeId, targetStatus, targetColumnTasks.length);
        return;
      }

      // Dropped onto another task
      const overTask = tasks.find((task) => task.id === overId);
      if (!overTask) {
        return;
      }

      const targetStatus = overTask.status;

      if (sourceTask.status === targetStatus) {
        // Reordering within the same column
        const columnTasks = tasks.filter((t) => t.status === targetStatus);
        const overIndex = columnTasks.findIndex((t) => t.id === overId);
        if (overIndex >= 0) {
          moveTask(activeId, targetStatus, overIndex);
        }
      } else {
        // Moving across columns
        const targetColumnTasks = tasks.filter(
          (t) => t.status === targetStatus && t.id !== activeId,
        );
        const overIndex = targetColumnTasks.findIndex((t) => t.id === overId);
        const translated = active.rect.current.translated;
        const isBelowOver =
          translated !== null &&
          translated.top + translated.height / 2 >
            over.rect.top + over.rect.height / 2;
        const targetIndex =
          overIndex >= 0
            ? overIndex + (isBelowOver ? 1 : 0)
            : targetColumnTasks.length;
        moveTask(activeId, targetStatus, targetIndex);
      }
    },
    [moveTask, tasks],
  );

  const handleDragCancel = useCallback(() => {
    setActiveTaskId(null);
    setDraggedOverColumn(null);
  }, []);

  const renderColumn = (
    column: (typeof columns)[number],
    className?: string,
  ) => (
    <Column
      key={column.key}
      status={column.key}
      indexNumber={column.index}
      title={column.title}
      count={groupedTasks[column.key].length}
      tasks={groupedTasks[column.key]}
      empty={groupedTasks[column.key].length === 0}
      isDraggingOver={draggedOverColumn === column.key}
      className={className}
      onAddTask={openCreateModal}
      onEditTask={openEditModal}
      onDeleteTask={deleteTask}
      onMoveTask={moveTask}
    />
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <main className="w-full min-w-0 max-w-full space-y-3 sm:space-y-4">
        {/* Board Header & Actions */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-medium tracking-tight text-[#1f1b16]">
              Product Launch
            </h2>
            <p className="text-xs text-[#7b7266]">
              Track issues and milestones across 4 stages
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#b44c1e] px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition hover:bg-[#9c3e16] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b44c1e]/40"
              onClick={openCreateModal}
            >
              <Plus size={15} strokeWidth={2} />
              <span>New task</span>
            </button>
          </div>
        </div>

        {/* Progress Metric Strip */}
        <div className="rounded-xl border border-[#e4ded4] bg-[#fdfbf7] p-3 shadow-[0_1px_2px_rgba(31,27,22,0.04)]">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-[#7b7266]">
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1">
              <span>
                <span className="font-mono font-medium tabular-nums text-[#1f1b16]">
                  {stats.percentDone}%
                </span>{" "}
                completed
              </span>
              <span className="text-[#e4ded4]">·</span>
              <span>
                <span className="font-mono font-medium tabular-nums text-[#1f1b16]">
                  {stats.doneCount}
                </span>
                /{stats.total} done
              </span>
              <span className="hidden xs:inline text-[#e4ded4]">·</span>
              <span className="hidden xs:inline">
                <span className="font-mono font-medium tabular-nums text-[#1f1b16]">
                  {stats.inProgressCount}
                </span>{" "}
                active
              </span>
            </div>
            <span className="font-mono tabular-nums text-[#7b7266] shrink-0">
              {stats.total} total
            </span>
          </div>

          {/* Segmented Progress Track */}
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#efe9df]">
            {stats.total > 0 ? (
              <>
                <div
                  style={{ width: `${(stats.doneCount / stats.total) * 100}%` }}
                  className="bg-[#2e7d4f] transition-[width] duration-300"
                  title={`${stats.doneCount} done`}
                />
                <div
                  style={{
                    width: `${(stats.inProgressCount / stats.total) * 100}%`,
                  }}
                  className="bg-[#b44c1e] transition-[width] duration-300"
                  title={`${stats.inProgressCount} in progress`}
                />
                <div
                  style={{ width: `${(stats.todoCount / stats.total) * 100}%` }}
                  className="bg-[#d5cdbf] transition-[width] duration-300"
                  title={`${stats.todoCount} to do`}
                />
                <div
                  style={{
                    width: `${(stats.backlogCount / stats.total) * 100}%`,
                  }}
                  className="bg-[#e8e2d7] transition-[width] duration-300"
                  title={`${stats.backlogCount} backlog`}
                />
              </>
            ) : (
              <div className="w-full bg-[#efe9df]" />
            )}
          </div>
        </div>

        {/* Mobile & Tablet Column Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between gap-2 border-b border-[#e4ded4]/70 pb-2">
          {/* Scrollable Tab Pills */}
          <div className="flex flex-1 items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar touch-scroll">
            <button
              type="button"
              onClick={() => setActiveMobileTab("all")}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-medium transition shrink-0",
                activeMobileTab === "all"
                  ? "border-[#b44c1e] bg-[#f5ebe4] text-[#b44c1e]"
                  : "border-[#e4ded4] bg-[#fdfbf7] text-[#5e554a] hover:bg-[#efe9df]",
              )}
            >
              <span>All</span>
              <span className="font-mono text-[11px] tabular-nums text-[#7b7266]">
                ({filteredTasks.length})
              </span>
            </button>
            {columns.map((column) => {
              const count = groupedTasks[column.key].length;
              const isActive = activeMobileTab === column.key;
              return (
                <button
                  key={column.key}
                  type="button"
                  onClick={() => setActiveMobileTab(column.key)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-medium transition shrink-0",
                    isActive
                      ? "border-[#b44c1e] bg-[#f5ebe4] text-[#b44c1e]"
                      : "border-[#e4ded4] bg-[#fdfbf7] text-[#5e554a] hover:bg-[#efe9df]",
                  )}
                >
                  <span>{column.title}</span>
                  <span className="font-mono text-[11px] tabular-nums text-[#7b7266]">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Layout toggle (stacked / swipe) for the "all" view */}
          {activeMobileTab === "all" ? (
            <div className="flex items-center rounded-lg border border-[#e4ded4] bg-[#efe9df]/40 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setMobileLayoutMode("stack")}
                className={cn(
                  "rounded p-1 text-[#5e554a] transition",
                  mobileLayoutMode === "stack"
                    ? "bg-white text-[#1f1b16] shadow-xs"
                    : "hover:text-[#1f1b16]",
                )}
                title="Stacked vertical view"
                aria-label="Stacked view"
              >
                <LayoutList size={13} />
              </button>
              <button
                type="button"
                onClick={() => setMobileLayoutMode("swipe")}
                className={cn(
                  "rounded p-1 text-[#5e554a] transition",
                  mobileLayoutMode === "swipe"
                    ? "bg-white text-[#1f1b16] shadow-xs"
                    : "hover:text-[#1f1b16]",
                )}
                title="Horizontal swipeable view"
                aria-label="Swipe view"
              >
                <Columns3 size={13} />
              </button>
            </div>
          ) : null}
        </div>

        {/* Columns */}
        {isDesktop ? (
          <div className="grid grid-cols-4 gap-3.5">
            {columns.map((column) => renderColumn(column))}
          </div>
        ) : (
          <div className="w-full min-w-0 max-w-full">
            {activeMobileTab === "all" ? (
              mobileLayoutMode === "stack" ? (
                /* Stacked: columns stack vertically */
                <div className="flex flex-col gap-3.5 w-full">
                  {columns.map((column) =>
                    renderColumn(column, "w-full min-w-0"),
                  )}
                </div>
              ) : (
                /* Swipe: horizontal carousel (snapping is paused while dragging) */
                <div
                  className={cn(
                    "flex gap-3 overflow-x-auto pb-3 touch-scroll w-full",
                    activeTaskId ? "snap-none" : "snap-x snap-mandatory",
                  )}
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className="snap-center w-[85vw] max-w-[340px] shrink-0"
                    >
                      {renderColumn(column, "w-full min-w-0")}
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Single column view */
              <div className="w-full">
                {columns
                  .filter((col) => col.key === activeMobileTab)
                  .map((column) => renderColumn(column, "w-full min-w-0"))}
              </div>
            )}
          </div>
        )}
      </main>

      {typeof document !== "undefined"
        ? createPortal(
            <DragOverlay
              modifiers={[keepOverlayInViewportX]}
              dropAnimation={{
                duration: 150,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {activeTask ? (
                <TaskCardOverlay
                  task={activeTask}
                  onEdit={() => undefined}
                  onDelete={() => undefined}
                  onMove={() => undefined}
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )
        : null}
    </DndContext>
  );
}
