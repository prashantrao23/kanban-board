import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Columns3, LayoutList, Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Column } from "@/components/Column";
import { TaskCard } from "@/components/TaskCard";
import { useBoardStore } from "@/store/useBoardStore";
import type { Task, TaskStatus } from "@/types/task";
import { cn } from "@/utils/index";

const columns = [
  { key: "backlog" as const, index: "01", title: "Backlog" },
  { key: "todo" as const, index: "02", title: "To Do" },
  { key: "in-progress" as const, index: "03", title: "In Progress" },
  { key: "done" as const, index: "04", title: "Done" },
];

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
    () => filteredTasks.find((task) => task.id === activeTaskId) ?? null,
    [activeTaskId, filteredTasks],
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

      const targetStatus = overId.startsWith("column-")
        ? (overId.replace("column-", "") as TaskStatus)
        : (tasks.find((task) => task.id === overId)?.status ??
          sourceTask.status);

      const targetTasks = tasks.filter(
        (task) => task.status === targetStatus && task.id !== activeId,
      );
      let targetIndex = targetTasks.length;

      if (!overId.startsWith("column-")) {
        const overTask = tasks.find((task) => task.id === overId);
        if (overTask?.status === targetStatus) {
          targetIndex = targetTasks.findIndex((task) => task.id === overId);
          if (targetIndex < 0) {
            targetIndex = targetTasks.length;
          }
        }
      }

      moveTask(activeId, targetStatus, targetIndex);
    },
    [moveTask, tasks],
  );

  const handleDragCancel = useCallback(() => {
    setActiveTaskId(null);
    setDraggedOverColumn(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
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

        {/* Desktop View: Clean 4-column Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-3.5">
          {columns.map((column) => (
            <Column
              key={column.key}
              status={column.key}
              indexNumber={column.index}
              title={column.title}
              count={groupedTasks[column.key].length}
              tasks={groupedTasks[column.key]}
              empty={groupedTasks[column.key].length === 0}
              isDraggingOver={draggedOverColumn === column.key}
              onAddTask={openCreateModal}
              onEditTask={openEditModal}
              onDeleteTask={deleteTask}
              onMoveTask={moveTask}
            />
          ))}
        </div>

        {/* Mobile & Tablet View */}
        <div className="lg:hidden w-full min-w-0 max-w-full">
          {activeMobileTab === "all" ? (
            mobileLayoutMode === "stack" ? (
              /* Stacked: columns stack vertically */
              <div className="flex flex-col gap-3.5 w-full">
                {columns.map((column) => (
                  <Column
                    key={column.key}
                    status={column.key}
                    indexNumber={column.index}
                    title={column.title}
                    count={groupedTasks[column.key].length}
                    tasks={groupedTasks[column.key]}
                    empty={groupedTasks[column.key].length === 0}
                    isDraggingOver={draggedOverColumn === column.key}
                    className="w-full min-w-0"
                    onAddTask={openCreateModal}
                    onEditTask={openEditModal}
                    onDeleteTask={deleteTask}
                    onMoveTask={moveTask}
                  />
                ))}
              </div>
            ) : (
              /* Swipe: horizontal carousel */
              <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory touch-scroll w-full">
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className="snap-center w-[85vw] max-w-[340px] shrink-0"
                  >
                    <Column
                      status={column.key}
                      indexNumber={column.index}
                      title={column.title}
                      count={groupedTasks[column.key].length}
                      tasks={groupedTasks[column.key]}
                      empty={groupedTasks[column.key].length === 0}
                      isDraggingOver={draggedOverColumn === column.key}
                      className="w-full min-w-0"
                      onAddTask={openCreateModal}
                      onEditTask={openEditModal}
                      onDeleteTask={deleteTask}
                      onMoveTask={moveTask}
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Single column view */
            <div className="w-full">
              {columns
                .filter((col) => col.key === activeMobileTab)
                .map((column) => (
                  <Column
                    key={column.key}
                    status={column.key}
                    indexNumber={column.index}
                    title={column.title}
                    count={groupedTasks[column.key].length}
                    tasks={groupedTasks[column.key]}
                    empty={groupedTasks[column.key].length === 0}
                    isDraggingOver={draggedOverColumn === column.key}
                    className="w-full min-w-0"
                    onAddTask={openCreateModal}
                    onEditTask={openEditModal}
                    onDeleteTask={deleteTask}
                    onMoveTask={moveTask}
                  />
                ))}
            </div>
          )}
        </div>
      </main>

      <DragOverlay
        dropAnimation={{
          duration: 150,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={() => undefined}
            onDelete={() => undefined}
            onMove={() => undefined}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
