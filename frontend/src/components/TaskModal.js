import React, { useState } from 'react';

function TaskModal({ task, onSave, onClose }) {
 
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');

  const [status, setStatus] = useState(task ? task.status : 'A Fazer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert('O título é obrigatório.'); 
      return;
    }
    
   
    const taskData = {
      ...task, 
      title,
      description,
      status,
    };

    onSave(taskData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
        <form onSubmit={handleSubmit}>
          
          <label htmlFor="title">Título *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* O status só aparece no modo de edição */}
          {task && (
            <>
              <label htmlFor="status">Status</label>
              <select 
                id="status"
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="A Fazer">A Fazer</option>
                <option value="Em Progresso">Em Progresso</option>
                <option value="Concluídas">Concluídas</option>
              </select>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;