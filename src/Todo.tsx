import { useState, useEffect } from "react";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data: Todo[]) => setTodos(data));
  }, []);

  const toggleTodoStatus = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    axios.put(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      updatedTodo
    );
    setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
  };

  function markAllCompleted() {
    const updatedTodos = todos.map((todo) => ({ ...todo, completed: true }));

    updatedTodos.forEach((todo) => {
      axios.put(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, todo);
    });

    setTodos(updatedTodos);
  }

  const sortedTodos = Array.from(todos).sort((a, b) => {
    if (!a.completed && b.completed) {
      return -1;
    } else if (a.completed && !b.completed) {
      return 1;
    } else {
      return 0;
    }
  });

  const filteredTodos = sortedTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <section className="user-input">
        <input
          type="text"
          id="search-todos"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search todos..."
        />
        <button type="button" onClick={markAllCompleted}>
          Mark all completed
        </button>
      </section>

      <section>
        <ul>
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoStatus(todo)}
                />
              </div>
              <label>{todo.title}</label>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default TodoApp;
