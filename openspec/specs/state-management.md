# State Management

Global Store

tasks

filters

theme

Actions

createTask()

updateTask()

deleteTask()

moveTask()

searchTask()

saveTasks()

loadTasks()

Data Flow

UI

↓

Store

↓

localStorage

↓

UI Update

Optimistic Update

User action

↓

Immediate UI update

↓

Persist data

↓

Rollback on failure