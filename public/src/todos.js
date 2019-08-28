import TodoApp from './components/app/TodoApp.js';

const app = new TodoApp();
document.body.prepend(app.renderDOM());