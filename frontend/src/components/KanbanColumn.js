import React from 'react';
import TaskCard from './TaskCard';

function KanbanColumn({ status, tasks, onEditTask, onDeleteTask, onMoveTask }) {
  return (
    <div className="kanban-column">
      <h2>{status} ({tasks.length})</h2>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanColumn;