import { Filter, Layers, Search, X } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";
import type { Priority } from "@/types/task";

export function Navbar() {
  const tasks = useBoardStore((state) => state.tasks);
  const searchQuery = useBoardStore((state) => state.searchQuery);
  const priorityFilter = useBoardStore((state) => state.priorityFilter);
  const setSearchQuery = useBoardStore((state) => state.setSearchQuery);
  const setPriorityFilter = useBoardStore((state) => state.setPriorityFilter);

  return (
    <header className="rounded-xl border border-[#e4ded4] bg-[#fdfbf7] p-3 sm:px-5 sm:py-3.5 shadow-[0_1px_2px_rgba(31,27,22,0.04)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-[#f5ebe4] text-[#b44c1e] border border-[#ebd8cc] shrink-0">
              <Layers size={16} strokeWidth={1.75} className="sm:hidden" />
              <Layers
                size={17}
                strokeWidth={1.75}
                className="hidden sm:block"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base font-medium tracking-tight text-[#1f1b16]">
                  Kanban Board
                </h1>
                <span className="rounded border border-[#e4ded4] bg-[#efe9df] px-1 py-0.2 sm:px-1.5 sm:py-0.5 font-mono text-[10px] sm:text-[11px] tabular-nums text-[#7b7266]">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#7b7266]">
                Product launch tracking
              </p>
            </div>
          </div>

          {/* Mobile task count tag */}
          <div className="flex sm:hidden items-center gap-1 rounded-md border border-[#e4ded4] bg-[#efe9df]/40 px-2 py-1 text-[11px] text-[#7b7266]">
            <span className="font-mono font-medium tabular-nums text-[#1f1b16]">
              {tasks.length}
            </span>
            <span>tasks</span>
          </div>
        </div>

        {/* Search & Filter row */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <label className="relative flex flex-1 sm:w-56 sm:flex-initial items-center gap-2 rounded-lg border border-[#e4ded4] bg-[#efe9df]/40 px-2.5 py-1.5 text-sm transition-colors focus-within:border-[#b44c1e] focus-within:bg-[#fdfbf7]">
            <Search size={14} className="text-[#7b7266] shrink-0" />
            <input
              className="w-full bg-transparent text-xs sm:text-sm text-[#1f1b16] placeholder:text-[#7b7266] outline-none"
              placeholder="Search tasks"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#7b7266] hover:text-[#1f1b16] p-0.5"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            ) : null}
          </label>

          <label className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-[#e4ded4] bg-[#efe9df]/40 px-2 sm:px-2.5 py-1.5 text-xs sm:text-sm text-[#5e554a] transition-colors hover:bg-[#efe9df] shrink-0">
            <Filter size={13} className="text-[#7b7266] shrink-0 sm:hidden" />
            <Filter
              size={14}
              className="text-[#7b7266] shrink-0 hidden sm:block"
            />
            <select
              className="cursor-pointer bg-transparent text-xs sm:text-sm text-[#5e554a] outline-none"
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as Priority | "all")
              }
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>

          {/* Desktop task count indicator */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#e4ded4] bg-[#efe9df]/30 px-2.5 py-1.5 text-xs text-[#7b7266] shrink-0">
            <span className="font-mono font-medium tabular-nums text-[#1f1b16]">
              {tasks.length}
            </span>
            <span>total tasks</span>
          </div>
        </div>
      </div>
    </header>
  );
}
