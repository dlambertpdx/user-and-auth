import Component from '../Component.js';
import Header from './Header.js';
import TodoList from '../todos/TodoList.js';
import TodoForm from '../todos/TodoForm.js';
import { getTodos, addTodos, updateTodos, removeTodos } from '../../services/todo-api.js';


class TodoApp extends Component {
    onRender(dom) {
        const header = new Header();
        dom.prepend(header.renderDOM());
        
        const main = dom.querySelector('main');

        const todoForm = new TodoForm({
            onAdd: todo => {
                return addTodos(todo)
                    .then(saved => {
                        const todos = this.state.todos;
                        todos.push(saved);
                        todoList.update({ todos });
                    });
            }
        });
        main.appendChild(todoForm.renderDOM());

        const todoList = new TodoList({ 
            todos: [],
            onUpdate: todo => {
                return updateTodos(todo)
                    .then(updated => {
                        const todos = this.state.todos;

                        const index = todos.indexOf(todo);
                        todos.splice(index, 1, updated);

                        todoList.update({ todos });
                    });
            },
            onRemove: todo => {
                return removeTodos(todo.id)
                    .then(() => {
                        const todos = this.state.todos;
                        
                        const index = todos.indexOf(todo);
                        todos.splice(index, 1);

                        todoList.update({ todos });
                    });
            }
        });
        main.appendChild(todoList.renderDOM());

        getTodos({ showAll: true })
            .then(todos => {
                this.state.todos = todos;
                todoList.update({ todos });
            })
            .catch(err => {
                // eslint-disable-next-line no-console
                console.log(err);
            });

    }

    renderHTML() {
        return /*html*/`
            <div>
                <!-- header goes here -->
                <main>
                </main>
            </div>
        `;
    }
}

export default TodoApp;