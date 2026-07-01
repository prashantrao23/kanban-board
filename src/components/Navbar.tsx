import { Filter, Moon, Search, UserRound } from 'lucide-react'
import { useBoardStore } from '@/store/useBoardStore'
import type { Priority } from '@/types/task'

export function Navbar() {
  const searchQuery = useBoardStore((state) => state.searchQuery)
  const priorityFilter = useBoardStore((state) => state.priorityFilter)
  const setSearchQuery = useBoardStore((state) => state.setSearchQuery)
  const setPriorityFilter = useBoardStore((state) => state.setPriorityFilter)

  return (
    <header className="rounded-[24px] border border-slate-200 bg-white/90 px-6 py-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.08),0_1px_2px_-1px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-indigo-50 text-indigo-600">
            <span className="text-lg font-semibold">K</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Productivity Suite</p>
            <h1 className="text-[24px] font-semibold text-slate-900">Kinetic Board</h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex min-w-[240px] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search size={16} className="text-slate-400" />
            <input
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Search tasks"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">
              <Filter size={16} />
              <select
                className="bg-transparent text-sm outline-none"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value as Priority | 'all')}
              >
                <option value="all">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
              <Moon size={16} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              <UserRound size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
