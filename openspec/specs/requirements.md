FR-1
User can create a task.

FR-2
A task has a title, description, priority, status, labels, and an optional due date.

FR-3
User can move tasks between columns.

FR-4
The board updates immediately after a task change.

FR-5
Changes persist in browser storage when available.

FR-6
User can edit a task.

FR-7
User can delete a task.

FR-8
A column should show a clear empty state when it contains no tasks.

FR-9
If browser storage is unavailable or contains invalid data, the board should continue to work in memory without crashing.

## MVP Scope Clarifications

The initial implementation includes the board layout, task creation and editing flows, task movement, and persistence.

Search and theme switching are not part of the initial MVP and should be treated as future enhancements.

## Non-Functional Requirements

- The experience should remain responsive for a typical board with up to 100 tasks in a modern desktop browser.
- Persistence should use browser storage without requiring a backend service.
- The interface should support keyboard navigation and provide visible focus states.
- The experience should remain usable when storage is unavailable or when data is partially invalid.