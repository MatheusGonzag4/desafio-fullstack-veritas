import React, { useState, useEffect } from 'react';
import api from './api'; 
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data || []); 
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError("Falha ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Funções do Modal
  const handleOpenModal = (task = null) => {
    setCurrentTask(task); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };


  const handleSaveTask = async (taskData) => {
    try {
      if (currentTask) {

        const response = await api.put(`/tasks/${currentTask.id}`, taskData);
        setTasks(tasks.map(t => (t.id === currentTask.id ? response.data : t)));
      } else {

        const response = await api.post('/tasks', taskData);
        setTasks([...tasks, response.data]);
      }
    } catch (err) {
      console.error("Erro ao salvar tarefa:", err);
      setError("Falha ao salvar tarefa. Título é obrigatório.");

      return;
    }

    handleCloseModal();
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (err) {
        console.error("Erro ao excluir tarefa:", err);
        setError("Falha ao excluir tarefa.");
      }
    }
  };


  const handleMoveTask = async (task, newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    
    try {
      const response = await api.put(`/tasks/${task.id}`, updatedTask);
      setTasks(tasks.map(t => (t.id === task.id ? response.data : t)));
    } catch (err) {
      console.error("Erro ao mover tarefa:", err);
      setError("Falha ao mover tarefa.");
    }
  };


  return (
    <div className="app">
      <header className="app-header">
        <h1>Mini Kanban (React + Go)</h1>
        <button className="add-task-btn" onClick={() => handleOpenModal(null)}>
          + Adicionar Tarefa
        </button>
      </header>
      
      {}
      {loading && <p className="feedback-loading">Carregando tarefas...</p>}
      {error && <p className="feedback-error">{error}</p>}
      
      {!loading && !error && (
        <KanbanBoard
          tasks={tasks}
          onEditTask={handleOpenModal} 
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
        />
      )}

      {isModalOpen && (
        <TaskModal
          task={currentTask}
          onSave={handleSaveTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;