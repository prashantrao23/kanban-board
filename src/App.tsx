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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(247,249,251,0.95))] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {persistError ? (
          <div className="rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
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
