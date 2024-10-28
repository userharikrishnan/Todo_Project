import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useParams, Link } from 'react-router-dom';

function TodosList() {
    const user = useSelector(state => state.auth.user);
    const [todos, setTodos] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProjectTitleEditModel, setShowProjectTitleEditModel] = useState(false);
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [todoToEdit, setTodoToEdit] = useState(null);
    const { projectId } = useParams(); 
    const [project, setProject] = useState({ id: "", title: "" });
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        fetchProject();
        fetchTodos();
    }, []);
   

    // Project related calling section

    const fetchProject = () => {
        axios.get(`http://localhost:8000/projects/${projectId}/`, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            setProject(response.data);
        })
        .catch(error => {
            console.error('Error fetching project:', error);
        });
    };


     // Allow editing the project title 

     const editProjectTitle = () => {
        axios.put(`http://localhost:8000/projects/${projectId}/edit`, 
        { title: newTitle },
        {
            headers: { 'Authorization': `Token ${user.token}` }
        }
        )
        .then((response) => {
        fetchProject();
        console.log('Project updated:', response.data);
        setShowProjectTitleEditModel(false);
        })
        .catch((error) => {
        console.error('Error updating project:', error.response?.data || error.message);
        });
    }




// Todos related section



    //creating a todo

    const handleCreateTodo = () => {
        axios.post(`http://localhost:8000/projects/${projectId}/todos/create`, {
            project: projectId,
            description: newTodoDescription,
            status: false, 
        }, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            setTodos([...todos, response.data]);
            setShowCreateModal(false);
            setNewTodoDescription('');
        })
        .catch(error => {
            console.error('Error creating todo:', error);
        });
    };


// editing a todo content

    const handleEditTodo = () => {
        if (!todoToEdit) return;
        axios.patch(`http://localhost:8000/todos/${todoToEdit.id}/update`, {
            project: projectId,
            description: todoToEdit.description,
        }, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            const updatedTodos = todos.map(todo => 
                todo.id === todoToEdit.id ? response.data : todo
            );
            setTodos(updatedTodos);
            setShowEditModal(false);
            setTodoToEdit(null);
            fetchTodos();
        })
        .catch(error => {
            console.error('Error updating todo:', error);
        });
    };


// listing out all todos with respect to the project

    const fetchTodos = () => {
        axios.get(`http://localhost:8000/projects/${projectId}/todos`, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            setTodos(response.data);
            console.log(response.data);
           
        })
        .catch(error => {
            console.error('Error fetching todos:', error);
        });
    };

// allow editing todo status

    const toggleTodoStatus = (todoId, currentStatus) => {
        axios.patch(`http://localhost:8000/todos/${todoId}/status`, { status: !currentStatus }, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            const updatedTodos = todos.map(todo => 
                todo.id === todoId ? response.data : todo
            );
            setTodos(updatedTodos);
            fetchTodos();
        })
        .catch(error => {
            console.error('Error updating todo status:', error);
        });
    };

    // deleting a todo

    const deleteTodo = (todoId) => {
        axios.delete(`http://localhost:8000/todos/${todoId}/delete`, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(() => {
            setTodos(todos.filter(todo => todo.id !== todoId));
            alert("Todo removed successfully");
        })
        .catch(error => {
            console.error('Error deleting todo:', error);
        });
    };


    

    // function to correct the time format


    function correctDateTime(dateString) {
        const date = new Date(dateString);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        

        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; 
        
        return `${day}-${month}-${year} [${String(hours).padStart(2, '0')} : ${minutes} : ${seconds} ${amPm}]`;
    }
      

    


    return (
        <div className='container-fluid'>
            <div>
                <Link to={'/home'} className="btn btn-secondary my-2 float-right">Dashboard</Link>
                <button className="btn btn-primary my-2 float-left" onClick={() => setShowCreateModal(true)}>Create New Todo</button>
            </div>

    <table className="table table-bordered">
    <thead>
        <tr>
            <th colspan="2">
                <h1 className='text-center'>Todos for
                    <span
                        data-toggle="tooltip" data-placement="top" title="Tap to edit"
                        style={{cursor:'pointer', textTransform:'uppercase'}} onClick={() => setShowProjectTitleEditModel(true)}
                        className='text-info rounded ml-2 px-2'>
                        {project.title}
                    </span>
                </h1>
            </th>
        </tr>
        <tr>
            <th className='text-center'><h4>Completed</h4></th>
            <th className='text-center'><h4>Not Completed</h4></th>
        </tr>
    </thead>
    <tbody>
        <tr>
           
            <td style={{width:'50%'}}>
                <ul className="list-group">
                    {todos.filter(todo => todo.status).map(todo => (
                        <li key={todo.id} className="list-group-item border border-success my-2 d-flex flex-column justify-content-between">
                            <div>
                                <input
                                    style={{height: '17px', width: '17px'}}
                                    type="checkbox"
                                    checked={todo.status}
                                    onChange={() => toggleTodoStatus(todo.id, todo.status)}
                                />
                                <span style={{ marginLeft: '10px', fontSize: '23px',textTransform:'capitalize' }}>
                                    <b>{todo.description}</b>
                                </span>
                            </div>
                            <div className="mt-4">
                                <p><b className="text-primary">Created on:</b> {correctDateTime(todo.created_date)}</p>
                                <p><b className="text-primary">Updated on:</b> {correctDateTime(todo.updated_date)}</p>
                            </div>
                            <div>
                                <button className="btn btn-danger btn-sm float-right m-1" onClick={() => deleteTodo(todo.id)}>Delete</button>
                                <button className="btn btn-info btn-sm float-right m-1" onClick={() => {
                                    setTodoToEdit(todo);
                                    setShowEditModal(true);
                                }}>Update</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </td>

            
            <td style={{width:'50%'}}>
                <ul className="list-group">
                    {todos.filter(todo => !todo.status).map(todo => (
                        <li key={todo.id} className="list-group-item border border-warning my-2 d-flex flex-column justify-content-between">
                            <div>
                                <input
                                    style={{height: '17px', width: '17px'}}
                                    type="checkbox"
                                    checked={todo.status}
                                    onChange={() => toggleTodoStatus(todo.id, todo.status)}
                                />
                                <span style={{ marginLeft: '10px', fontSize: '23px',textTransform:'capitalize'}}>
                                    <b>{todo.description}</b>
                                </span>
                            </div>
                            <div className="mt-4">
                                <p><b className="text-primary">Created on:</b> {correctDateTime(todo.created_date)}</p>
                                <p><b className="text-primary">Updated on:</b> {correctDateTime(todo.updated_date)}</p>
                            </div>
                            <div>
                                <button className="btn btn-danger btn-sm float-right m-1" onClick={() => deleteTodo(todo.id)}>Delete</button>
                                <button className="btn btn-info btn-sm float-right m-1" onClick={() => {
                                    setTodoToEdit(todo);
                                    setShowEditModal(true);
                                }}>Update</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </td>
        </tr>
    </tbody>
</table>


            {showCreateModal && (
                <div className="modal show" style={{ display: 'block', zIndex: '1050', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Todo</h5>
                                <button type="button" className="close" onClick={() => setShowCreateModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Enter todo description"
                                    value={newTodoDescription}
                                    onChange={(e) => setNewTodoDescription(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleCreateTodo}>Create Todo</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal show" style={{ display: 'block', zIndex: '1050', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Todo</h5>
                                <button type="button" className="close" onClick={() => setShowEditModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Edit todo description"
                                    value={todoToEdit ? todoToEdit.description : ''}
                                    onChange={(e) => setTodoToEdit({ ...todoToEdit, description: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleEditTodo}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {showProjectTitleEditModel && (
            <div className="modal show" style={{ display: 'block', zIndex: '1050', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Project Title</h5>
                        <button type="button" className="close" onClick={() => setShowProjectTitleEditModel(false)}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            className='form-control m-2'
                            placeholder={project.title}
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowProjectTitleEditModel(false)}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={editProjectTitle}>Update Title</button>
                    </div>
                </div>
            </div>
        </div>
            )}

        </div>
    );
}

export default TodosList;
