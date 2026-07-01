# State Management

## Store Shape

The board can be managed with a single lightweight Zustand store containing:

- tasks
- selected task for editing, if needed
- a minimal UI state for modal visibility

## Actions

- createTask()
- updateTask()
- deleteTask()
- moveTask()
- loadTasks()
- saveTasks()

## Data Flow

UI
↓
Store
↓
localStorage
↓
UI Update

## Update Strategy

- User actions should update the store immediately so the UI feels responsive.
- Persistence should happen after the state update, but failures should not crash the experience.
- If storage fails, the UI should continue to work using the in-memory state.

## Notes

Search and theme state should be deferred until they are explicitly added to scope. The MVP should avoid extra abstractions beyond a simple shared store.