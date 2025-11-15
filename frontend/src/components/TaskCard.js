import React from 'react';

function TaskCard({ task, onEditTask, onDeleteTask, onMoveTask }) {
  
  // Lógica para os botões de "Mover"
  const canMoveLeft = task.status === 'Em Progresso' || task.status === 'Concluídas';
  const canMoveRight = task.status === 'A Fazer' || task.status === 'Em Progresso';

  const moveLeft = () => {
    const newStatus = task.status === 'Em Progresso' ? 'A Fazer' : 'Em Progresso';
    onMoveTask(task, newStatus);
  };

  const moveRight = () => {
    const newStatus = task.status === 'A Fazer' ? 'Em Progresso' : 'Concluídas';
    onMoveTask(task, newStatus);
  };

  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      {task.description && <p>{task.description}</p>}
      
      <div className="task-actions">
        <button onClick={() => onEditTask(task)} title="Editar">✏️</button>
        <button onClick={() => onDeleteTask(task.id)} title="Excluir">🗑️</button>
      </div>
      
      <div className="task-move">
        {canMoveLeft && <button onClick={moveLeft}>&larr; Mover</button>}
        {canMoveRight && <button onClick={moveRight}>Mover &rarr;</button>}
      </div>
    </div>
  );
}

export default TaskCard;