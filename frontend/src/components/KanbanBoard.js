import React from 'react';
import KanbanColumn from './KanbanColumn';


const columns = ['A Fazer', 'Em Progresso', 'Concluídas'];

function KanbanBoard({ tasks, onEditTask, onDeleteTask, onMoveTask }) {
  

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="kanban-board">
      {columns.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={getTasksByStatus(status)}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;