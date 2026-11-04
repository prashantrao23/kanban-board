import '@/App.css'
import { useEffect } from 'react'
import { Board } from '@/components/Board'
import { CreateTaskModal } from '@/components/CreateTaskModal'
import { Navbar } from '@/components/Navbar'
import { useBoardStore } from '@/store/useBoardStore'

function App() {
  const tasks = useBoardStore((state) => state.tasks)
  const persistError = useBoardStore((state) => state.persistError)
  const isModalOpen = useBoardStore((state) => state.isModalOpen)
  const editingTaskId = useBoardStore((state) => state.editingTaskId)
  const createTask = useBoardStore((state) => state.createTask)
  const updateTask = useBoardStore((state) => state.updateTask)
  const closeModal = useBoardStore((state) => state.closeModal)
  const loadTasks = useBoardStore((state) => state.loadTasks)

  const editingTask = tasks.find((task) => task.id === editingTaskId) ?? null

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f7f4ee] px-3.5 py-4 text-[#1f1b16] sm:px-6 sm:py-6 lg:px-8 lg:py-7">
      <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-4 sm:gap-6">
        {persistError ? (
          <div className="rounded-lg border border-[#e4ded4] bg-[#fbf3db] px-4 py-2.5 text-xs sm:text-sm text-[#854d0e]">
            {persistError}
          </div>
        ) : null}
        <Navbar />
        <Board />
      </div>
      <CreateTaskModal
        key={`${isModalOpen ? 'open' : 'closed'}-${editingTaskId ?? 'new'}`}
        open={isModalOpen}
        task={editingTask}
        onClose={closeModal}
        onSubmit={(draft) => {
          if (editingTask) {
            updateTask(editingTask.id, draft)
            return
          }

          createTask(draft)
        }}
      />
    </div>
  )
}

export default App
