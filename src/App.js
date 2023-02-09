
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [todoTitle, setTodoTitle] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editable, setEditable] = useState(null);

  //create data
  const createHandler = (event) => {
    event.preventDefault();
    const newTodo = {
      id: Date.now(),
      title: todoTitle
    }

    fetch('http://localhost:3000/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(() => {
        // setTodoList([newTodo, ...todoList]);
        // setTodoTitle("");
        fetch('http://localhost:3000/todos')
          .then(response => response.json())
          .then((data) => {
            setTodoList(data)
            setTodoTitle("")
          })
      })

  }

  const editHandler = (id) => {
    const tobeEdited = todoList.find(todo => todo.id === id);
    setIsEdit(true);
    setEditable(tobeEdited);
    setTodoTitle(tobeEdited.title);
  }

  const updateHandler = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/todos/${editable.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: todoTitle
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(() => {
        fetch('http://localhost:3000/todos')
          .then(response => response.json())
          .then(data => {
            setTodoList(data);
            setTodoTitle("");
            setIsEdit(false);
            setEditable(null);

          })
      })
    // editable.title = todoTitle;
    // setTodoTitle("");
    // setIsEdit(false);
    // setEditable(null);

  }

  const deleteHandler = (id) => {
    // const newTodoList = todoList.filter(todo => todo.id !== id);
    // setTodoList(newTodoList);
    const todo = todoList.find(todo => todo.id === id);
    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        fetch('http://localhost:3000/todos')
          .then(response => response.json())
          .then((data) => setTodoList(data))
      })

  }

  useEffect(
    () => {
      fetch('http://localhost:3000/todos')
        .then(response => response.json())
        .then(data => setTodoList(data))
    }, [],)


  return (
    <div className="text-center m-5">
      <h2 className='font-bold m-5 text-slate-700  '>Todo-List</h2>
      <form>
        <input className="placeholder:italic placeholder:text-slate-400 block bg-white m-auto w-11/12 border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder='Add Your Todo' value={todoTitle} type="text" name="todotitle" onChange={
          (event) => setTodoTitle(event.target.value)} />
        <button className="px-4 py-1 m-5 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-green-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" onClick={(event) => isEdit === true ? updateHandler(event) : createHandler(event)}>
          {isEdit === true ? "Update todo" : "Add Todo"}
        </button>
      </form>
      <ol>
        {todoList.map(todo => (
          <li key={todo.id} className='m-2 border-2 border-sky-500 rounded-full border indent-8 text-slate-900 font-bold'>
            <span>
              {todo.title}
            </span>
            <button className="px-4 py-1 m-2 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" onClick={() => editHandler(todo.id)}>Edit</button>
            <button className="px-4 py-1 m-2 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-red-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" onClick={() => deleteHandler(todo.id)} >Delete</button>
          </li>
        ))}
      </ol>
      <p className='mt-12 font-semibold'>Developed By <a href="https://sites.google.com/diu.edu.bd/ashiq">Md.Ashiqur Rahman</a></p>
    </div>
  );
}

export default App;
