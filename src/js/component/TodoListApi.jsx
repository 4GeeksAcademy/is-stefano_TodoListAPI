import React, { useEffect, useState } from "react";

export const TodoListApi = () => {
    const host = 'https://playground.4geeks.com/todo';
    const [todos, setTodos] = useState();
    const [users, setUsers] = useState();
    const [list, setList] = useState([]);
    const [task, setTask] = useState('');
    const [edit, setEdit] = useState(false);
    const [currentTodo, setCurrentTodo] = useState({});
    const user = 'spain-65';

    const deleteTask = async (id) => {
        const uri = `${host}/todos/${id}`;
        const options = {
            method: 'DELETE'
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error:', response.status, response.statusText);
            return;
        }
        getTodos();
    }

    const handleEditTodo = async (event, id) => {
        event.preventDefault();
        const dataToSend = {
            label: task,
            is_done: false
        };
        const uri = `${host}/todos/${id}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error:', response.status, response.statusText);
            return;
        }
        setEdit(false);
        setTask('');
        setCurrentTodo({});
        getTodos();
    }

    const editTask = (item) => {
        setCurrentTodo(item);
        setTask(item.label);
        setEdit(true);
    }

    const getTodos = async () => {
        const uri = `${host}/users/${user}`;
        const options = {
            method: 'GET'
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error:', response.status, response.statusText);
            return;
        }

        const data = await response.json();
        setList(data.todos);
    };

    const handleAddTodo = async (event) => {
        event.preventDefault();
        const dataToSend = {
            label: task,
            is_done: false
        };
        const uri = `${host}/todos/${user}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error', response.status, response.statusText);
            return;
        }
        setTask('');
        getTodos();
    }

    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className="container">
            <h1 className="text-center my-2">Todo List</h1>
            <form onSubmit={handleAddTodo}>
                <h3>Listado de tareas de <span className="text-primary">{user}</span></h3>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Añadir tarea"
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2"
                        value={task}
                        onChange={(event) => setTask(event.target.value)}
                    />
                    <button
                        className="btn btn-outline-primary"
                        type="submit"
                        id="button-addon2"
                    >
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            </form>

            <div className="container">
                {list.length === 0 ? <h3 className="text-center">Vacío</h3> :
                    <ul className="list-group">
                        {list.map((item) =>
                            <li key={item.id} className="list-group-item d-flex justify-content-between">
                                {currentTodo.id === item.id ? (
                                    <form onSubmit={(event) => handleEditTodo(event, item.id)} className="d-flex w-100">
                                        <input
                                            type="text" className="form-control"value={task} onChange={(event) => setTask(event.target.value)}/>

                                        <button
                                            type="submit"className="btn btn-success ms-2">Editar</button> 
                                    </form>
                                ) : (
                                    <>
                                        <span>{item.label}</span>
                                        <div>
                                            <span onClick={() => editTask(item)} className="me-2">
                                                <i type="button" className="fas fa-edit text-success"></i>
                                            </span>
                                            <span onClick={() => deleteTask(item.id)}>
                                                <i type="button" className="btn fas fa-trash text-danger"></i>
                                            </span>
                                        </div>
                                    </>
                                )}
                            </li>
                        )}
                    </ul>
                }
            </div>
        </div>
    )
};
