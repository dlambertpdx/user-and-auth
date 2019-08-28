import Component from '../Component.js';

class TodoForm extends Component {
    onRender(dom) {
        const onAdd = this.props.onAdd;
        const form = dom.querySelector('form');
        const input = dom.querySelector('input[name=todo]');

        form.addEventListener('submit', event => {
            event.preventDefault();
            const todo = {
                name: input.value
            };
            onAdd(todo)
                .then(() => {
                    form.reset();
                })
                .catch(err => {
                    // eslint-disable-next-line no-console
                    console.log(err);
                });
        });
    }

    renderHTML() {
        return /*html*/`
        <section class="todo-form-section">
            <form class="todo-form">
                <input name="todo">
                <button class="add-todo">Add</button>
            </form>
        </section>
        `;
    }
}

export default TodoForm;