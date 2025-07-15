import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Login from './login';
import Register from './register';

const API_URL = 'http://localhost:5050/tasks';

function App(){
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '');
  const[showRegister,setShowRegister] = useState(false);
  const[tasks,setTasks] = useState([]);
  const[form,setForm] = useState({ title: '', description: '', status: 'pending' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const switchToLogin = () => setShowRegister(false);
  const switchToRegister = () => setShowRegister(true);
  const fetchTasks = async() => {
    if(!userId) return; 
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      setTasks(response.data);
    } catch(error) {
      console.error('Error fetching tasks:', error);
    }
};
  useEffect(() => {
    if(!userId) return;
    const fetchTasks = async() => {
      try {
        const response = await axios.get(`${API_URL}/${userId}`);
        setTasks(response.data);
      } catch(error) {
        console.error('Error fetching tasks:',error);
      }
    };
    fetchTasks();
  },[userId]);
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!form.title.trim()) {
      alert('Title is required');
      return;
    }try {
      const response = await axios.post(API_URL, {
        userId, title:form.title, description:form.description, status:form.status });
        console.log(response.data);
        setForm({ title: '', description: '', status: 'pending' });
        fetchTasks();
      } catch(error){
        console.error('Error adding task:', error);
      }};
      const handleDelete = async (taskId) => {
        try{
          const response = await axios.delete(`${API_URL}/${taskId}`);
          console.log(response.data);
          fetchTasks();
        } catch(error){
          console.error('Error deleting task:', error);
        }};
        const handleUpdate = async (e, taskId) => {
          e.preventDefault();
          try {
            const response = await axios.put(`${API_URL}/${taskId}`, form);
            console.log(response.data);
            setForm({ title: '', description: '', status: 'pending' });
            setEditingTaskId(null);
            fetchTasks();
          } catch(error) {
            console.error('Error updating task:', error);
          }};
          const handleToggleStatus = async (taskId, currentStatus) => {
            const task = tasks.find((t) => t.id === taskId);
            const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
            try {
              const response = await axios.put(`${API_URL}/${taskId}`, {
                title: task.title,
                description: task.description,
                status: newStatus
              });
              console.log(response.data);
              fetchTasks();
            } catch(error) {
              console.error('Error toggling task status:', error);
            }
          };
          const handleLogout = () => {
            localStorage.removeItem('userId');
            setUserId('');
          };
          return(
          <div>
            <h1>ToDo List</h1>
            {!userId ? (
              showRegister ? (
              <Register switchToLogin={switchToLogin} />
            ) : (
            <Login setUserId={setUserId} switchToRegister={switchToRegister} /> )
          ) : (
          <div>
            <button onClick={handleLogout}>Logout</button>
            <form onSubmit={editingTaskId ? (e) => handleUpdate(e, editingTaskId) : handleSubmit}>
              <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required/>
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} ></textarea>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button type="submit">{editingTaskId ? 'Update Task' : 'Add Task'}</button>
              </form>
              <ul>
                {tasks.map((task) => (
                  <li key={task.id}>
                    <strong>{task.title}</strong> <br />
                    <em>{task.description}</em> <br />
                    Status: {task.status}
                    <button onClick={() => handleToggleStatus(task.id, task.status)}>
                      {task.status === 'pending' ? 'Complete' : 'Undo'}
                      </button>
                      <button onClick={() => {
                        setForm({ title: task.title, description: task.description, status: task.status });
                        setEditingTaskId(task.id);}}>Edit</button>
                        <button onClick={() => handleDelete(task.id)}>Delete</button>
                        </li>
                      ))}
                      </ul>
                      </div>
                    )}
                    </div>
                    );
} export default App;              