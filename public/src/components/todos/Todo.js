import Component from '../Component.js';

class Todo extends Component {

    onRender(dom) {
        const todo = this.props.todo;
        const onUpdate = this.props.onUpdate;
        const onRemove = this.props.onRemove;

        const todoComplete = dom.querySelector('.completed');
        if(!todo.inactive === true){
            todoComplete.classList.remove('completed');
        }
        const completedButton = dom.querySelector('.completed-button');
        completedButton.addEventListener('click', () => {
            todo.inactive = !todo.inactive;
            onUpdate(todo);
        });
        
        const removeButton = dom.querySelector('.remove-button');
        removeButton.addEventListener('click', () => {
            if(confirm(`Are you sure you want to delete "${todo}"?`)) {
                onRemove(todo);
            }
        });
    }
    renderHTML() {
        const todo = this.props.todo;
        return /*html*/`
        <li class="todo-item">
        <div id="todo-div" class="completed">
            ${todo.name}
            </div>
            <div>
                <button class="completed-button">
                    ✔
                </button>
                <button class="remove-button">
                    🗑
                </button>
            </div>
            </li>
            
        `;
    }
}

export default Todo;