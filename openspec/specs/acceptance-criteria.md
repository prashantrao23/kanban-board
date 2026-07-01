# Acceptance Criteria

## Board

- Four columns are visible
- The layout is responsive across mobile and desktop breakpoints
- Empty columns provide a clear empty state

## Tasks

- A user can create a task
- A user can edit a task
- A user can delete a task
- A task can be moved between columns

## Validation

- An empty title is not allowed
- A title longer than 100 characters is rejected
- Invalid or missing due dates do not break the form

## Persistence

- Refreshing the page retains tasks when storage is available
- If storage is unavailable or corrupted, the board still loads and remains usable

## Performance

- Task updates remain responsive
- The board avoids unnecessary re-renders during normal interaction

## Accessibility

- All interactive elements are keyboard reachable
- Focus indicators are visible
- Modal dialogs manage focus correctly
- Drag and drop provides a non-pointer alternative or clear keyboard support

## Code Quality

- TypeScript strict mode is used
- No ESLint errors are present
- No console warnings are introduced during normal usage